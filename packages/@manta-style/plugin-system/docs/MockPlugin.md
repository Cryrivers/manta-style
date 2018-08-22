# Mock Plugin

- Mock plugin is responsible for mocking data.
- Package name for a mock plugin should be `@manta-style/plugin-mock-*`

## Node type supported

- ArrayType
- StringType
- NumberType
- BooleanType

## Plugin Interface

```typescript
type SupportedMockNodeType =
  | 'ArrayType'
  | 'StringType'
  | 'NumberType'
  | 'BooleanType';

type MockResult<T extends SupportedMockNodeType> = T extends 'ArrayType'
  ? any[]
  : T extends 'StringType'
    ? string
    : T extends 'NumberType' ? number : T extends 'BooleanType' ? boolean : any;

type Plugin = {
  name: string;
  mock: {
    [key in SupportedMockNodeType]?: (
      type: Type,
      annotations: Annotation[],
    ) => MockResult<key> | null
  };
};
```

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
  build(configFilePath): Promise<Result>;
}
```

# CLI Plugin

- CLI Plugin is responsible for adding interfaces to the command line tool `ms`.
- Package name for a CLI plugin should be `@manta-style/plugin-cli-*`
- Current CLI plugin support
  1. KOA REST Server (`@manta-style/plugin-cli-koa-rest`)
  2. Boilerplate Code Generator (Under consideration, `@manta-style/plugin-cli-boilerplate-generator`)
  3. Apollo GraphQL Server (Under consideration, `@manta-style/plugin-cli-apollo-graphql`)

## Plugin Interface (TBD)

```typescript
interface CLIPlugin {
  name: string;
  launchCommands: Array<{ option: string; description: string }>;
  activationKeys: Array<{ key: string; description: string }>;
  launch(configs: any)?: Promise<void>;
  didReceiveRequest()?: Promise<any>;
  willSendResponse()?: Promise<any>;
  didActivate(key: string)?: Promise<Array<{ key: string; description: string }>>;
  willDestroy()?: Promise<void>;
};
```

## Example: Snapshot Plugin

```typescript
class Snapshot implements CLIPlugin {
    name: 'snapshot-plugin',
    launchCommands: [],
    activationKeys: [{
        key: 'S',
        description: 'to take an instant snapshot'
    }],
    async didReceiveRequest(req) {
        if (haveSnapshot(req)) {
            return getSnapshot(req);
        }
    }
    async willSendResponse(rep) {
        writeToSnapshot(rep);
    }
    async didActivate(key) {
        switch(key) {
            case 'S':
                enableSnapshotMode();
                takeASnapshot();
                return [{
                    key: 'S',
                    description: 'to take one more snapshot'
                },
                {
                    key: 'X', description: 'to disable snapshot'
                }];
            case 'X':
                disableSnapshotMode();
                return [{
                    key: 'S',
                    description: 'to enable instant snapshot mode'
                }];
        }
    }
}
```

TBD: How to make current Snapshot feature fits into the plugin system
