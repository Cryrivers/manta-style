import * as annotationUtils from './utils/annotation';
import { PluginSystem } from './plugin';
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
  private endpoints: Endpoint[] = [];
  public registerEndpoint(endpoint: Endpoint) {
    if (!this.getEndpointByMethodURL(endpoint.method, endpoint.url)) {
      this.endpoints.push(endpoint);
    } else {
      throw new Error('Duplicated endpoints');
    }
  }
  public clearEndpoints() {
    this.endpoints = [];
  }
  public getEndpoints() {
    return this.endpoints;
  }
  public getEndpointByMethodURL(method: HTTPMethods, url: string) {
    return this.endpoints.find(
      (item) => item.method === method && item.url === url,
    );
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
