import * as fs from 'fs-extra';
import * as path from 'path';
import { createTransformer } from '../transformer';

export default async function build(
  fileName: string,
  destDir: string,
  verbose: boolean = false,
  importHelpers: boolean = true,
) {
  const sourceCode = await fs.readFile(fileName, 'utf-8');
  const compiledContent = createTransformer(importHelpers)(sourceCode);
  console.log(destDir, fileName);
  const destPath = path.join(destDir, path.basename(fileName));
  await fs.writeFile(destPath, compiledContent, 'utf-8');
  return destPath;
}
