import { createTransformer } from '../transformer';

export default function transpile(
  sourceCode: string,
  importHelpers: boolean = true,
): string {
  return createTransformer(importHelpers)(sourceCode);
}
