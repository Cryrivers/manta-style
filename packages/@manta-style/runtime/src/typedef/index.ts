// TODO: refactor this to interface package

import PluginSystem from '@manta-style/plugin-system';

export type MantaStyleContext = {
  query: { [key: string]: unknown };
  plugins: PluginSystem;
};

export type Annotation = {
  key: string;
  value: string;
};
