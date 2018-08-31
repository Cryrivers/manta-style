import * as Babel from '@babel/core';
import { createTypeAlias } from './utils';

export function createTransformer(importHelpers: boolean) {
  return function(babel: typeof Babel) {
    const plugin: Babel.PluginObj = {
      visitor: {
        TypeAlias(path) {
          return createTypeAlias(path.node);
        },
      },
    };
    return plugin;
  };
}
