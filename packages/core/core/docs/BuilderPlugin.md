# Builder Plugin

- Builder plugin is responsible for compiling the config file into JavaScript that utilizes `@manta-style/runtime`
- Package name for a mock plugin should be `@manta-style/plugin-builder-*`
- Current language support

  1. TypeScript (`@manta-style/plugin-builder-typescript`)
  2. Flowtype (WIP, `@manta-style/plugin-builder-flow`)
  3. GraphQL (Under consideration, `@manta-style/plugin-builder-graphql`)

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
  buildSourceCode(sourceCode: string): Promise<string>;
}
```
