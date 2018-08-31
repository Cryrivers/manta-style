import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as babelCore from 'babel-core';
import { createTransformer } from '../transformer';

export default function build(
  fileName: string,
  destDir: string,
  verbose: boolean = false,
  importHelpers: boolean = true,
) {
  return Promise.resolve('');
}
