#!/usr/bin/env node
import * as path from 'path';
import * as builder from '@manta-style/typescript-builder';
import * as program from 'commander';
import findRoot = require('find-root');
import chalk from 'chalk';

program
  .version('0.0.11')
  .option(
    '-c --configFile <file>',
    'the TypeScript config file to generate entry points',
  )
  .option('-v --verbose', 'show debug information')
  .parse(process.argv);

const { configFile, verbose = false } = program;

if (!configFile) {
  console.log(
    'Please specifiy a entry point config file by using --configFile.',
  );
  process.exit(1);
}

const tmpDir = findRoot(process.cwd()) + '/.mantastyle-tmp';
builder.build(path.resolve(configFile), tmpDir, verbose);
console.log(
  chalk.green(
    `Built manta-style runnable code into ${chalk.underline.white(tmpDir)}`,
  ),
);
