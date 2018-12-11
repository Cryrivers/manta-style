import {
  ServerPlugin,
  CompiledTypes,
  Endpoint,
  HTTPMethods,
  Type,
  flushFetcher,
} from '@manta-style/core';

const HTTP_METHODS: HTTPMethods[] = ['get', 'post', 'put', 'patch', 'delete'];
type TypeAliasDeclaration = import('@manta-style/runtime/src/nodes/TypeAliasDeclaration').default;
type TypeLiteral = import('@manta-style/runtime').TypeLiteral;

function isTypeAliasDeclaration(type: any): type is TypeAliasDeclaration {
  return typeof type === 'object' && typeof type.getType === 'function';
}

function isTypeLiteral(type: any): type is TypeLiteral {
  return typeof type === 'object' && typeof type._getProperties === 'function';
}

async function restfulServerCallback(matchedEndpoint: Endpoint) {
  const type = typeMapping[generateHashString(matchedEndpoint)];
  if (type) {
    const literalType = type.deriveLiteral([]);
    await flushFetcher();
    return literalType.mock();
  }
  throw Error(
    'RESTful Server Plugin is supposed to generate mock data but no type found.',
  );
}

function generateHashString(endpoint: Endpoint) {
  return `${endpoint.method}__${endpoint.url}`;
}

let typeMapping: { [key: string]: Type | undefined };

const restfulServer: ServerPlugin = {
  name: 'RESTful Server',
  generateEndpoints(
    compiled: CompiledTypes,
    options: { proxyUrl?: string },
  ): Endpoint[] {
    typeMapping = {};
    const generatedEndpoints: Endpoint[] = [];
    for (const method of HTTP_METHODS) {
      const methodTypeDef = compiled[method.toUpperCase()];
      if (isTypeAliasDeclaration(methodTypeDef)) {
        const type = methodTypeDef.getType();
        if (isTypeLiteral(type)) {
          const endpoints = type._getProperties();
          for (const endpoint of endpoints) {
            const proxyAnnotation = endpoint.annotations.find(
              (item) => item.key === 'proxy',
            );
            const endpointObject: Endpoint = {
              method,
              url: endpoint.name,
              proxy: proxyAnnotation
                ? proxyAnnotation.value
                : options.proxyUrl
                  ? options.proxyUrl
                  : null,
              enabled: true,
              callback: restfulServerCallback,
            };
            generatedEndpoints.push(endpointObject);
            typeMapping[generateHashString(endpointObject)] = endpoint.type;
          }
        }
      }
    }
    return generatedEndpoints;
  },
};

export default restfulServer;
