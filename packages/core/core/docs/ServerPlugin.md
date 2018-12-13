# Server Plugin

- Server Plugin is responsible for adding endpoints to the command line tool `ms`.
- Package name for a server plugin should be `@manta-style/server-*`
- Current Server plugin support
  1. REST Server (`@manta-style/server-restful`)
  2. Apollo GraphQL Server (Under consideration, `@manta-style/server-apollo-graphql`)

## Plugin Interface

```typescript
interface ServerPlugin {
  name: string;
  generateEndpoints(
    compiled: CompiledTypes,
    options: { proxyUrl?: string },
  ): Endpoint[];
}
```
