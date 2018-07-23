#!/usr/bin/env node
import * as express from "express";
import * as path from "path";
import * as builder from "@manta-style/typescript-builder";
import * as program from "commander";
import findRoot = require("find-root");
import packageInfo = require("../package.json");
import { Snapshot } from "@manta-style/cli/src/utils/snapshot";

export type HTTPMethods = "get" | "post" | "put" | "delete" | "patch";

// const snapshot = {};

// fs.writeFileSync("snapshot.json", JSON.stringify(snapshot, undefined, 2));

// app.listen(3000, () =>
//   console.log("Manta Style Mock Server is working on port 3000.")
// );

program
  .version(packageInfo.version)
  .option(
    "-c --configFile <file>",
    "the TypeScript config file to generate entry points"
  )
  .option("-p --port <i> [3000]", "To use a port different than 3000")
  .option(
    "--generateSnapshot <file>",
    "To generate a API mock data snapshot (Not yet implemented.)"
  )
  .option(
    "--useSnapshot <file>",
    "To launch a server with data snapshot (Not yet implemented.)"
  )
  .option("-v --verbose", "show debug information")
  .parse(process.argv);

const {
  configFile,
  port,
  generateSnapshot,
  useSnapshot,
  verbose = false
} = program;

if (!configFile) {
  console.log(
    "Please specifiy a entry point config file by using --configFile."
  );
  process.exit(1);
}
if (generateSnapshot && useSnapshot) {
  console.log(
    "You cannot use --generateSnapshot and --useSnapshot at the same time."
  );
  process.exit(1);
}

const app = express();
const tmpDir = findRoot(process.cwd()) + "/.mantastyle-tmp";
const compiledFilePath = builder.build(
  path.resolve(configFile),
  tmpDir,
  verbose
);

if (useSnapshot) {
  console.log("Using snapshot file: " + useSnapshot);
}
let isSnapshotMode = Boolean(useSnapshot);
const snapshot = useSnapshot ? Snapshot.fromDisk(useSnapshot) : new Snapshot();
const compileConfig = require(compiledFilePath);

function buildEndpoints(method: HTTPMethods) {
  const methodTypeDef = compileConfig[method.toUpperCase()];
  if (methodTypeDef) {
    const endpoints = methodTypeDef.getType()._getProperties();
    for (const endpoint of endpoints) {
      app[method](endpoint.name, (req, res) => {
        const randomMockData = endpoint.type.mock();
        const mockData = isSnapshotMode
          ? snapshot.fetchSnapshot(method, endpoint.name) || randomMockData
          : randomMockData;
        snapshot.updateSnapshot(method, endpoint.name, mockData);
        res.send(mockData);
      });
    }
  }
}

(["get", "post", "put", "delete", "patch"] as HTTPMethods[]).forEach(
  buildEndpoints
);

app.listen(port || 3000);

console.log("Manta Style launched at http://localhost:" + (port || 3000));

if (!isSnapshotMode) {
  console.log("Press S to enter Instant Snapshot mode.");
} else {
  console.log("You have entered Instant Snapshot mode. Press X to exit.");
}

const { stdin } = process;

stdin.on("data", function(key: Buffer) {
  const keyCode = key.toString();
  switch (keyCode) {
    case "\u0003": {
      process.exit();
      break;
    }
    case "s":
    case "S": {
      if (!isSnapshotMode) {
        console.log("You have entered Instant Snapshot mode. Press X to exit.");
      } else {
        console.log("Saving snapshot to disk.");
      }
      isSnapshotMode = true;
      snapshot.writeToDisk(
        path.join(path.dirname(configFile), "mock-snapshot.json")
      );
      break;
    }
    case "x":
    case "X": {
      if (isSnapshotMode) {
        snapshot.clearSnapshot();
        isSnapshotMode = false;
        console.log(
          "You have exited Instant Snapshot mode. All mock data would be randomly-generated."
        );
      }
    }
  }
});

stdin.setRawMode && stdin.setRawMode(true);
stdin.resume();
