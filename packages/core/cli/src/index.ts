#!/usr/bin/env node
import * as express from 'express';
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
import * as PrettyError from 'pretty-error';
import clear = require('clear');
import { multiSelect } from './inquirer-util';
import { MantaStyleContext, CompiledTypes, Core } from '@manta-style/core';
import { findPlugins } from './discovery';
import { rollup } from 'rollup';

const pe = new PrettyError();

program
  .version('0.2.0')
  .option('-c --configFile <file>', 'the config file to generate entry points')
  .option('-p --port <i> [3000]', 'To use a port different than 3000')
  .option(
    '-o --outputFile <file>',
    'Instead of setting up a server, output a single file for various purpose',
  )
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
  outputFile,
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
  const core = new Core(await findPlugins());
  // Check plugin nums
  if (core.builderPluginCount === 0) {
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

  if (core.mockPluginCount === 0) {
    console.log(
      chalk.bold(
        chalk.yellow(
          '\nNo mock plugin installed. You might want to run `ms --official-plugins` and install one.\n',
        ),
      ),
    );
  }

  const tmpDir = path.join(findRoot(process.cwd()), '.mantastyle-tmp');

  function buildFromConfigFile(transpileModule: boolean = true) {
    return core.buildConfigFile({
      configFilePath: path.resolve(configFile),
      destDir: tmpDir,
      transpileModule,
      verbose,
    });
  }

  if (outputFile) {
    const resolvedPath = path.resolve(outputFile);
    const compiledPath = await buildFromConfigFile(false);
    console.log('Compiling to', outputFile, 'from', compiledPath);
    const bundle = await rollup({
      input: compiledPath,
    });
    await bundle.write({
      file: path.basename(resolvedPath),
      dir: path.dirname(resolvedPath),
      format: 'cjs',
      sourcemap: true,
    });
    process.exit(0);
  }

  let server: Server | undefined;

  const snapshotFilePath = path.join(
    path.dirname(configFile),
    'ms.snapshot.json',
  );
  const snapshotWatcher = chokidar.watch(snapshotFilePath);
  const configFileWatcher = chokidar.watch(path.resolve(configFile));

  let isSnapshotMode = Boolean(useSnapshot);

  const snapshot = useSnapshot
    ? Snapshot.fromDisk(useSnapshot)
    : new Snapshot();

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

  async function setupMockServer() {
    if (server) {
      server.close();
    }
    const app = express();
    const compiledFilePath = await buildFromConfigFile();

    delete require.cache[compiledFilePath];

    const compileConfig: CompiledTypes = require(compiledFilePath || '');

    const endpoints = core.generateEndpoints(compileConfig, {
      proxyUrl,
    });

    for (const endpoint of endpoints) {
      app[endpoint.method](endpoint.url, async function(req, res) {
        const { query, params } = req;
        const queryString = qs.stringify(query);
        const context: MantaStyleContext = {
          query,
          param: params,
          plugins: core.pluginSystem,
        };
        if (endpoint.enabled) {
          if (isSnapshotMode) {
            const snapshotData = snapshot.fetchSnapshot(
              endpoint.method,
              endpoint.url,
              queryString,
            );
            if (snapshotData) {
              res.send(snapshotData);
              return;
            }
          }
          const result = await endpoint.callback(endpoint, context);
          snapshot.updateSnapshot(
            endpoint.method,
            endpoint.url,
            queryString,
            result,
          );
          res.send(result);
        } else if (endpoint.proxy) {
          axios
            .request({
              method: endpoint.method,
              url: req.path,
              baseURL: endpoint.proxy,
              params: req.query,
            })
            .then((result) => {
              snapshot.updateSnapshot(
                endpoint.method,
                endpoint.url,
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
                  <p>Unable to connect to <strong>${endpoint.url}</strong></p>
                  <p>Reason:</p>
                  <blockquote>
                    <p>${result.message}</p>
                  </blockquote>
                </body>
              </html>
            `);
            });
          return;
        } else {
          res.status(404);
          res.send();
        }
      });
    }

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
    const endpointTable = core.getEndpoints();
    for (const row of endpointTable) {
      table.push([
        row.method.toUpperCase(),
        `http://localhost:${port || 3000}${row.url}`,
        row.enabled
          ? chalk.green('Y')
          : row.proxy
            ? chalk.yellow('~>')
            : chalk.red('N'),
        row.proxy ? row.proxy + row.url : '',
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
    const endpointTable = core.getEndpoints();
    const selection = await multiSelect(
      'Select endpoint to mock.',
      endpointTable.map((endpoint) => ({
        name: `${endpoint.method.toUpperCase()} ${endpoint.url}`,
        value: endpoint,
      })),
      endpointTable.filter((endpoint) => endpoint.enabled),
    );
    for (const endpoint of endpointTable) {
      endpoint.enabled = selection.indexOf(endpoint) > -1;
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
})().catch((exception) => {
  if (exception instanceof Error) {
    if (verbose) {
      console.log(pe.render(exception));
    } else {
      console.log(chalk.red(exception.message + '\n'));
    }
  } else {
    console.log(
      chalk.red(
        'Unexpected Error caught. Please create an issue on https://github.com/Cryrivers/manta-style. Sorry for the inconvenience caused.\n',
      ),
    );
  }
  process.exit(1);
});
