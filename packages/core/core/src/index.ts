import * as annotationUtils from './utils/annotation';
import { PluginSystem, CompiledTypes } from './plugin';
import { Annotation } from './utils/annotation';

export type MantaStyleContext = {
  query: { [key: string]: unknown };
  param: { [key: string]: unknown };
  plugins: PluginSystem;
};
export * from './plugin';
export { annotationUtils, Annotation };

export type HTTPMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type Endpoint = {
  method: HTTPMethods;
  url: string;
  proxy: string | null;
  enabled: boolean;
  callback: (
    matchedEndpoint: Endpoint,
    context: MantaStyleContext,
  ) => Promise<any>;
};

export class Core {
  public pluginSystem: PluginSystem;
  private endpoints: Endpoint[] = [];
  constructor(plugins: PluginSystem) {
    this.pluginSystem = plugins;
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
  public buildConfigFile(
    configFilePath: string,
    destDir: string,
    verbose?: boolean,
  ) {
    this.endpoints = [];
    return this.pluginSystem.buildConfigFile(configFilePath, destDir, verbose);
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

export abstract class Type {
  public abstract deriveLiteral(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ): Promise<Type>;
  public mock(): any {
    throw new Error('Literal types should be derived before mock.');
  }
}

export abstract class CustomType extends Type {
  public abstract typeForAssignabilityTest(
    parentAnnotations: Annotation[],
    context: MantaStyleContext,
  ): Promise<Type>;
}
