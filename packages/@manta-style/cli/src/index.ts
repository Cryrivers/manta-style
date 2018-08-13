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
import clear = require('clear');
import { multiSelect } from './inquirer-util';

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
const endpointTable: { method: string; endpoint: string }[] = [];
const endpointMockTable: {
  [method: string]: { [endpoint: string]: boolean };
} = {};
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
    const endpoints = methodTypeDef()
      .getType()
      ._getProperties();
    const endpointMap: { [key: string]: any } = {};

    for (const endpoint of endpoints) {
      endpointTable.push({
        method,
        endpoint: endpoint.name,
      });
      (endpointMockTable[method] = endpointMockTable[method] || {})[
        endpoint.name
      ] = true;
      endpointMap[endpoint.name] = endpoint;
    }

    app.use((req, res, next) => {
      const { url, query, method: requestMethod } = req;
      const queryString = qs.stringify(query);

      const endpoint = endpointMap[trimEndingSlash(url)];
      if (
        requestMethod === method.toUpperCase() &&
        endpoint &&
        endpointMockTable[method][endpoint.name]
      ) {
        MantaStyle.clearQueryTypes();
        if (typeof query === 'object') {
          Object.keys(query).forEach((key) => {
            MantaStyle.createTypeByQuery(key, query[key]);
          });
        }
        const literalType = endpoint.type.deriveLiteral([]);
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
        return;
      }
      next();
    });
  }
}

(['get', 'post', 'put', 'delete', 'patch'] as HTTPMethods[]).forEach(
  buildEndpoints,
);

app.listen(port || 3000);
clear();
printMessage();
toggleSnapshotMode(true);

function printMessage() {
  console.log(`Manta Style launched at http://localhost:${port || 3000}`);
  const table = new Table({
    colors: false,
    head: ['Method', 'Endpoint', 'isMocked'],
  });
  for (const row of endpointTable) {
    table.push([
      row.method.toUpperCase(),
      `http://localhost:${port || 3000}${row.endpoint}`,
      endpointMockTable[row.method][row.endpoint]
        ? chalk.green('Y')
        : chalk.red('N'),
    ]);
  }
  console.log(table.toString());
  console.log(`Press ${chalk.bold('O')} to configure selective mocking`);
}

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

async function selectiveMock() {
  clear();
  const selection = await multiSelect(
    'Select endpoint to mock.',
    endpointTable.map((endpoint) => ({
      name: `${endpoint.method.toUpperCase()} ${endpoint.endpoint}`,
      value: endpoint,
    })),
    endpointTable.filter(
      (endpoint) => endpointMockTable[endpoint.method][endpoint.endpoint],
    ),
  );
  for (const endpoint of endpointTable) {
    endpointMockTable[endpoint.method][endpoint.endpoint] =
      selection.indexOf(endpoint) > -1;
  }
  clear();
  printMessage();
  console.log('');
  toggleSnapshotMode(true);

  stdin.setRawMode && stdin.setRawMode(true);
  stdin.resume();
}

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
      break;
    }
    case 'o':
    case 'O': {
      selectiveMock();
      break;
    }
  }
});

stdin.setRawMode && stdin.setRawMode(true);
stdin.resume();

function trimEndingSlash(url: string) {
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1);
  }
  return url;
}
