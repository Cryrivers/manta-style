import { HTTPMethods } from '..';
import * as fs from 'fs';
import * as path from 'path';

type AnyObject = {
  [key: string]: any;
};

type SnapshotStructure = { [key in HTTPMethods]?: AnyObject };

function snapshotKey(url: string, query: string) {
  return `${url}?${query}`;
}

export class Snapshot {
  private diskSnapshots: SnapshotStructure = {};
  private stashedSnapshots: SnapshotStructure = {};
  public static fromDisk(filePath: string) {
    const content = fs.readFileSync(path.resolve(filePath));
    const snapshotInstance = new Snapshot();
    snapshotInstance.diskSnapshots = JSON.parse(content.toString());
    snapshotInstance.stashedSnapshots = JSON.parse(content.toString());
    return snapshotInstance;
  }
  public reloadFromFile(filePath: string) {
    const content = fs.readFileSync(path.resolve(filePath));
    this.diskSnapshots = JSON.parse(content.toString());
    this.stashedSnapshots = JSON.parse(content.toString());
  }
  public updateSnapshot(
    method: HTTPMethods,
    url: string,
    query: string,
    payload: any,
  ) {
    const methodObj = this.stashedSnapshots[method];
    if (!methodObj) {
      this.stashedSnapshots = {
        ...this.stashedSnapshots,
        [method]: {
          [snapshotKey(url, query)]: payload,
        },
      };
    } else {
      this.stashedSnapshots = {
        ...this.stashedSnapshots,
        [method]: {
          ...methodObj,
          [snapshotKey(url, query)]: payload,
        },
      };
    }
  }
  public fetchSnapshot(method: HTTPMethods, url: string, query: string) {
    const methodObj = this.diskSnapshots[method];
    return methodObj && methodObj[snapshotKey(url, query)];
  }
  public clearSnapshot() {
    this.stashedSnapshots = {};
    this.diskSnapshots = {};
  }
  public writeToDisk(filePath: string) {
    const stashedJsonString = JSON.stringify(
      this.stashedSnapshots,
      undefined,
      2,
    );
    fs.writeFileSync(path.resolve(filePath), stashedJsonString);
    this.diskSnapshots = JSON.parse(stashedJsonString);
  }
}
