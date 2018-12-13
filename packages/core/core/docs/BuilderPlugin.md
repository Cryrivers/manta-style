# Builder Plugin

- Builder plugin is responsible for compiling the config file into JavaScript that utilizes `@manta-style/runtime`
- Package name for a builder plugin should be `@manta-style/builder-*`
- Current language support

  1. TypeScript (`@manta-style/builder-typescript`)
  2. Flowtype (`@manta-style/builder-flow-type`)
  3. GraphQL (Under consideration, `@manta-style/builder-graphql`)

## Interface

```typescript
interface BuilderPlugin {
  name: string;
  supportedExtensions: string[];
  buildConfigFile(
    configFilePath: string,
    destDir: string,
    verbose: boolean = false,
    importHelpers: boolean = true,
  ): Promise<string>;
  buildConfigSource(sourceCode: string): Promise<string>;
}
```
