import {
  ServerPlugin,
  CompiledTypes,
  Endpoint,
  HTTPMethods,
} from '@manta-style/core';

const HTTP_METHODS: HTTPMethods[] = ['get', 'post', 'put', 'patch', 'delete'];

const restfulServer: ServerPlugin = {
  name: 'RESTful Server',
  generateEndpoints(compiled: CompiledTypes): Endpoint[] {
    return [];
  },
  serialize(payload: any): string {
    return JSON.stringify(payload);
  },
  deserialize(payload: string) {
    return JSON.parse(payload);
  },
};

export default restfulServer;
