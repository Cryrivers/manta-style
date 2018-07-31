#!/usr/bin/env node
import * as express from 'express';
import * as path from 'path';
import * as builder from '@manta-style/typescript-builder';
import * as program from 'commander';
import findRoot = require('find-root');
import { Snapshot } from './utils/snapshot';
import Table = require('cli-table');
import * as logUpdate from 'log-update';
import chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as qs from 'query-string';
import MantaStyle from '@manta-style/runtime';

export type HTTPMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

program
  .version('0.0.11')
  .option(
    '-c --configFile <file>',
    'the TypeScript config file to generate entry points',
  )
  .option('-p --port <i> [3000]', 'To use a port different than 3000')
  .option(
    '--generateSnapshot <file>',
    'To generate a API mock data snapshot (Not yet implemented.)',
  )
  .option('--useSnapshot <file>', 'To launch a server with data snapshot')
  .option('-v --verbose', 'show debug information')
  .parse(process.argv);

const {
  configFile,
  port,
  generateSnapshot,
  useSnapshot,
  verbose = false,
} = program;

if (!configFile) {
  console.log(
    'Please specifiy a entry point config file by using --configFile.',
  );
  process.exit(1);
}
if (generateSnapshot && useSnapshot) {
  console.log(
    'You cannot use --generateSnapshot and --useSnapshot at the same time.',
  );
  process.exit(1);
}

const app = express();
const table = new Table({
  colors: false,
  head: ['Method', 'Endpoint'],
});
const snapshotFilePath = path.join(
  path.dirname(configFile),
  'ms.snapshot.json',
);
const tmpDir = findRoot(process.cwd()) + '/.mantastyle-tmp';
const snapshotWatcher = chokidar.watch(snapshotFilePath);
const compiledFilePath = builder.build(
  path.resolve(configFile),
  tmpDir,
  verbose,
);

let isSnapshotMode = Boolean(useSnapshot);
const snapshot = useSnapshot ? Snapshot.fromDisk(useSnapshot) : new Snapshot();
const compileConfig = require(compiledFilePath || '');

snapshotWatcher.on('change', () => {
  snapshot.reloadFromFile(snapshotFilePath);
});

function buildEndpoints(method: HTTPMethods) {
  const methodTypeDef = compileConfig[method.toUpperCase()];
  if (methodTypeDef) {
    const endpoints = methodTypeDef.getType()._getProperties();
    for (const endpoint of endpoints) {
      table.push([
        method.toUpperCase(),
        `http://localhost:${port || 3000}${endpoint.name}`,
      ]);
      app[method](endpoint.name, (req, res) => {
        const { query } = req;
        const queryString = qs.stringify(query);
        MantaStyle.clearQueryTypes();
        if (typeof query === 'object') {
          Object.keys(query).forEach((key) => {
            MantaStyle.createTypeByQuery(key, query[key]);
          });
        }
        const literalType = endpoint.type.deriveLiteral();
        const mockData = literalType.mock();
        if (isSnapshotMode) {
          const snapshotData = snapshot.fetchSnapshot(
            method,
            endpoint.name,
            queryString,
          );
          if (snapshotData) {
            res.send(snapshotData);
            return;
          }
        }
        snapshot.updateSnapshot(method, endpoint.name, queryString, mockData);
        res.send(mockData);
      });
    }
  }
}

(['get', 'post', 'put', 'delete', 'patch'] as HTTPMethods[]).forEach(
  buildEndpoints,
);

app.listen(port || 3000);

console.log(`Manta Style launched at http://localhost:${port || 3000}`);
console.log(table.toString());

function toggleSnapshotMode(showMessageOnly?: boolean) {
  if (!showMessageOnly) {
    isSnapshotMode = !isSnapshotMode;
  }
  logUpdate(
    isSnapshotMode
      ? `${chalk.yellow('[SNAPSHOT MODE]')} Press ${chalk.bold(
          'S',
        )} to take a snapshot for other APIs. Press ${chalk.bold(
          'X',
        )} to disable Snapshot Mode`
      : `${chalk.yellow('[FAKER MODE]')} Press ${chalk.bold(
          'S',
        )} to take an instant snapshot`,
  );
}

toggleSnapshotMode(true);

const { stdin } = process;

stdin.on('data', function(key: Buffer) {
  const keyCode = key.toString();
  switch (keyCode) {
    case '\u0003': {
      process.exit();
      break;
    }
    case 's':
    case 'S': {
      if (!isSnapshotMode) {
        toggleSnapshotMode();
      }
      snapshot.writeToDisk(snapshotFilePath);
      break;
    }
    case 'x':
    case 'X': {
      if (isSnapshotMode) {
        snapshot.clearSnapshot();
        toggleSnapshotMode();
      }
    }
  }
});

stdin.setRawMode && stdin.setRawMode(true);
stdin.resume();
