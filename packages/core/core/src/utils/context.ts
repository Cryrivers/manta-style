import { PluginSystem, PluginEntry } from '../plugin';

let param: { [key: string]: any } = {};
let query: { [key: string]: any } = {};
let fetcherCounter = 0;
let plugins: PluginSystem = new PluginSystem([]);
let fetcherQueue: Array<Promise<any>> = [];
let resolvedFetcherValue: any[] = [];

export class Fetcher<T> {
  private fetcherId: number;
  constructor(fetcher: Promise<T>) {
    this.fetcherId = fetcherCounter;
    fetcherQueue.push(fetcher);
    fetcherCounter++;
  }
  public read(): T {
    if (resolvedFetcherValue.length !== fetcherCounter) {
      throw new Error(
        'Fetchers are not resolved yet. Please run `flushFetcher` first.',
      );
    } else {
      return resolvedFetcherValue[this.fetcherId];
    }
  }
}

/**
 * @param pluginEntries Array of plugin entries
 */
export function enablePlugins(pluginEntries: PluginEntry[]) {
  plugins = new PluginSystem(pluginEntries);
}

export function usePluginSystem(): [
  PluginSystem,
  (mutator: PluginSystem) => PluginSystem
] {
  return [plugins, (pluginMutator: PluginSystem) => (plugins = pluginMutator)];
}

export function useParam(): [
  { [key: string]: any },
  (mutator: { [key: string]: any }) => { [key: string]: any }
] {
  return [
    param,
    (paramMutator: { [key: string]: any }) => (param = paramMutator),
  ];
}

export function useQuery(): [
  { [key: string]: any },
  (mutator: { [key: string]: any }) => { [key: string]: any }
] {
  return [
    query,
    (queryMutator: { [key: string]: any }) => (param = queryMutator),
  ];
}

export async function flushFetcher() {
  resolvedFetcherValue = await Promise.all(fetcherQueue);
}

export function resetContext() {
  fetcherCounter = 0;
  fetcherQueue = [];
  resolvedFetcherValue = [];
  plugins = new PluginSystem([]);
}
