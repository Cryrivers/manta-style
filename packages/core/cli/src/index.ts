#!/usr/bin/env node
import * as express from 'express';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import * as path from 'path';
import * as program from 'commander';
import findRoot = require('find-root');
import { Snapshot } from './utils/snapshot';
import Table = require('cli-table');
import * as logUpdate from 'log-update';
import chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as qs from 'query-string';
import axios from 'axios';
import {
  TypeAliasDeclarationFactory,
  TypeLiteral,
  Property,
} from '@manta-style/runtime';
import clear = require('clear');
import { multiSelect } from './inquirer-util';
import PluginDiscovery from './discovery';

export type HTTPMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';
const METHODS: HTTPMethods[] = ['get', 'post', 'put', 'delete', 'patch'];

program
  .version('0.0.11')
  .option(
    '-c --configFile <file>',
    'the TypeScript config file to generate entry points',
  )
  .option('-p --port <i> [3000]', 'To use a port different than 3000')
  .option('--proxyUrl <url>', 'To enable proxy for disabled endpoints')
  .option(
    '--generateSnapshot <file>',
    'To generate a API mock data snapshot (Not yet implemented.)',
  )
  .option('--useSnapshot <file>', 'To launch a server with data snapshot')
  .option('-v --verbose', 'show debug information')
  .option('--official-plugins', 'show all available official plugins')
  .parse(process.argv);

const {
  officialPlugins,
  configFile,
  port,
  generateSnapshot,
  useSnapshot,
  verbose = false,
  proxyUrl,
} = program;

const queryOfficialPlugin = (type: 'mock' | 'builder') =>
  axios.get(
    `https://api.npms.io/v2/search?q=scope:manta-style+keywords:${type}`,
  );

async function showOfficialPluginList() {
  const [{ data: builderPlugins }, { data: mockPlugins }] = await Promise.all([
    queryOfficialPlugin('builder'),
    queryOfficialPlugin('mock'),
  ]);
  const table = new Table({ colors: false });
  table.push([chalk.yellow('Builders'), chalk.yellow('Description')]);
  // @ts-ignore
  builderPlugins.results.forEach((item) => {
    table.push([item.package.name || '', item.package.description || '']);
  });
  table.push([chalk.yellow('Mocks'), chalk.yellow('Description')]);
  // @ts-ignore
  mockPlugins.results.forEach((item) => {
    table.push([item.package.name || '', item.package.description || '']);
  });
  console.log(table.toString());
  process.exit(0);
}

(async function() {
  const pluginSystem = await PluginDiscovery.findPlugins(process.cwd());
  // Check plugin nums
  if (pluginSystem.getBuilderPluginCount() === 0) {
    console.log(
      chalk.bold(
        chalk.yellow(
          "\nHi there! It seems that you don't have any builder plugins installed. Manta Style needs them to support different languages. Please check out the following table and install one.\n",
        ),
      ),
    );
    await showOfficialPluginList();
  }
  if (officialPlugins) {
    await showOfficialPluginList();
  }
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
  if (pluginSystem.getMockPluginCount() === 0) {
    console.log(
      chalk.bold(
        chalk.yellow(
          '\nNo mock plugin installed. You might want to run `ms --official-plugins` and install one.\n',
        ),
      ),
    );
  }
  let server: Server | undefined;
  let endpointTable: {
    method: string;
    endpoint: string;
    proxy: string | null;
  }[] = [];
  let endpointMockTable: {
    [method: string]: { [endpoint: string]: boolean };
  } = {};
  const snapshotFilePath = path.join(
    path.dirname(configFile),
    'ms.snapshot.json',
  );

  const tmpDir = findRoot(process.cwd()) + '/.mantastyle-tmp';
  const snapshotWatcher = chokidar.watch(snapshotFilePath);
  const configFileWatcher = chokidar.watch(path.resolve(configFile));

  let isSnapshotMode = Boolean(useSnapshot);
  const snapshot = useSnapshot
    ? Snapshot.fromDisk(useSnapshot)
    : new Snapshot();

  type MantaStyleConfig = {
    [key: string]: ReturnType<TypeAliasDeclarationFactory> | undefined;
  };

  snapshotWatcher.on('change', () => {
    snapshot.reloadFromFile(snapshotFilePath);
  });

  configFileWatcher.on('change', async () => {
    console.log(chalk.yellowBright('\nUpdating config file...\n'));
    await setupMockServer();
    clear();
    console.log(chalk.green('\nEndpoint config updated!\n'));
    printMessage();
  });

  function buildEndpoints(
    method: HTTPMethods,
    compileConfig: MantaStyleConfig,
    app: Express,
  ) {
    const methodTypeDef = compileConfig[method.toUpperCase()];
    if (methodTypeDef) {
      const endpoints = (methodTypeDef.getType() as TypeLiteral)._getProperties();
      const endpointMap: { [key: string]: Property } = {};
      for (const endpoint of endpoints) {
        const proxyAnnotation = endpoint.annotations.find(
          (item) => item.key === 'proxy',
        );
        endpointTable.push({
          method,
          endpoint: endpoint.name,
          proxy: proxyAnnotation
            ? proxyAnnotation.value
            : proxyUrl
              ? proxyUrl
              : null,
        });
        (endpointMockTable[method] = endpointMockTable[method] || {})[
          endpoint.name
        ] = true;
        endpointMap[trimEndingSlash(endpoint.name)] = endpoint;
      }

      app.use(async (req, res, next) => {
        const { path, query } = req;
        const context = { query, plugins: pluginSystem };
        const queryString = qs.stringify(query);
        const endpoint = endpointMap[trimEndingSlash(path)];
        const endpointInfo =
          endpoint &&
          endpointTable.find(
            (item) => item.method === method && item.endpoint === endpoint.name,
          );
        if (endpointInfo && endpointMockTable[method][endpoint.name]) {
          const literalType = await endpoint.type.deriveLiteral([], context);
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
        } else if (
          endpointInfo &&
          !endpointMockTable[method][endpoint.name] &&
          endpointInfo.proxy
        ) {
          axios
            .request({
              method,
              url: endpoint.name,
              baseURL: endpointInfo.proxy,
              params: req.query,
            })
            .then((result) => {
              snapshot.updateSnapshot(
                method,
                endpoint.name,
                queryString,
                result.data,
              );
              res.send(result.data);
            })
            .catch((result: Error) => {
              res.status(502).send(`
              <html>
                <head>
                  <style>
                    * {
                      font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
                    }
                  </style>
                </head>
                <body>
                  <h2>Manta Style Proxy Error</h2>
                  <p>Unable to connect to <strong>${endpoint.name}</strong></p>
                  <p>Reason:</p>
                  <blockquote>
                    <p>${result.message}</p>
                  </blockquote>
                </body>
              </html>
            `);
            });
          return;
        }
        next();
      });
    }
  }

  async function setupMockServer() {
    if (server) {
      server.close();
    }
    const app = express();
    endpointTable = [];
    endpointMockTable = {};
    const compiledFilePath = await pluginSystem.buildConfigFile(
      path.resolve(configFile),
      tmpDir,
      verbose,
    );
    delete require.cache[compiledFilePath];
    const compileConfig: MantaStyleConfig = require(compiledFilePath || '');
    METHODS.forEach((method) => buildEndpoints(method, compileConfig, app));
    server = app.listen(port || 3000);
  }

  await setupMockServer();
  clear();
  printMessage();
  toggleSnapshotMode(true);

  function printMessage() {
    console.log(`Manta Style launched at http://localhost:${port || 3000}`);
    const table = new Table({
      colors: false,
      head: ['Method', 'Endpoint', 'Mocked', 'Proxy'],
    });
    for (const row of endpointTable) {
      table.push([
        row.method.toUpperCase(),
        `http://localhost:${port || 3000}${row.endpoint}`,
        endpointMockTable[row.method][row.endpoint]
          ? chalk.green('Y')
          : row.proxy
            ? chalk.yellow('~>')
            : chalk.red('N'),
        row.proxy ? row.proxy + row.endpoint : '',
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
})().catch((exception) => {
  console.log(exception);
  process.exit(1);
});
