// @ts-check
const builder = require("@manta-style/typescript-builder");
const path = require("path");
builder.build(
  path.join(__dirname, "..", "src", "index.ts"),
  path.join(__dirname, "..", "lib"),
  true,
  false
);
