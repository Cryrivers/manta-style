import * as express from "express";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import builder from "@manta-style/typescript-builder";
import { fstat } from "fs";

// options: configFile, --generateSnapshot, --useSnapshot

const tmpDir = __dirname + "/tmp";
builder(path.resolve("./test-config.ts"), tmpDir);

const test = require(path.resolve(tmpDir + "/test-config"));
const properties = test.default._getProperties();

const app = express();

const snapshot = {};

for (const p of properties) {
  // @ts-ignore
  snapshot[p.name.replace(/"/g, "")] = p.type.mock();
  app.get(p.name.replace(/"/g, ""), (req, res) => {
    res.send(p.type.mock());
  });
}

fs.writeFileSync("snapshot.json", JSON.stringify(snapshot, undefined, 2));

app.listen(3000, () =>
  console.log("Manta Style Mock Server is working on port 3000.")
);
