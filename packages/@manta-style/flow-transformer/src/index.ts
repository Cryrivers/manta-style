import * as Babel from 'babel-core';
import { createTypeAliasDeclaration } from './utils';
import { MANTASTYLE_RUNTIME_NAME, MANTASTYLE_PACKAGE_NAME } from './constants';

export function createTransformer(importHelpers: boolean) {
  return function(babel: typeof Babel) {
    const plugin: Babel.PluginObj = {
      visitor: {
        TypeAlias(path) {
          return createTypeAliasDeclaration(path.node);
        },
      },
    };
    return plugin;
  };
}
