import * as annotationUtils from './utils/annotation';
import { PluginSystem, CompiledTypes, PluginEntry } from './plugin';
import { Annotation } from './utils/annotation';

export * from './plugin';
export * from './utils/context';

export { annotationUtils, Annotation };

export type HTTPMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type Endpoint = {
  method: HTTPMethods;
  url: string;
  proxy: string | null;
  enabled: boolean;
  callback: (matchedEndpoint: Endpoint) => Promise<any>;
};

export class Core {
  public pluginSystem: PluginSystem;
  private endpoints: Endpoint[] = [];
  constructor(plugins: PluginEntry[]) {
    this.pluginSystem = new PluginSystem(plugins);
  }
  public get builderPluginCount() {
    return this.pluginSystem.getBuilderPluginCount();
  }
  public get mockPluginCount() {
    return this.pluginSystem.getMockPluginCount();
  }
  public getEndpoints() {
    return this.endpoints;
  }
  public buildConfigFile({
    configFilePath,
    destDir,
    transpileModule,
    verbose,
  }: {
    configFilePath: string;
    destDir: string;
    transpileModule: boolean;
    verbose?: boolean;
  }) {
    this.endpoints = [];
    return this.pluginSystem.buildConfigFile({
      configFilePath,
      destDir,
      transpileModule,
      verbose,
    });
  }
  public generateEndpoints(
    compiled: CompiledTypes,
    options: { proxyUrl?: string },
  ) {
    const endpoints = this.pluginSystem
      .getServer()
      .generateEndpoints(compiled, options);

    this.endpoints = endpoints;
    return endpoints;
  }
}

export abstract class Type<T = any> {
  public abstract deriveLiteral(parentAnnotations: Annotation[]): Type<T>;
  public mock(): T {
    throw new Error('Literal types should be derived before mock.');
  }
  public abstract validate(value: unknown): value is T;
  public abstract format(value: unknown): T;
}

export abstract class CustomType extends Type {
  public abstract typeForAssignabilityTest(
    parentAnnotations: Annotation[],
  ): Type;
}
