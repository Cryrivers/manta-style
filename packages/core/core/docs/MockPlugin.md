# Mock Plugin

- Mock plugin is responsible for mocking data.
- Package name for a mock plugin should be `@manta-style/mock-*`

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
