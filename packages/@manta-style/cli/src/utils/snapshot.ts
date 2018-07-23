import { HTTPMethods } from "..";
import * as fs from "fs";
import * as path from "path";

type AnyObject = {
  [key: string]: any;
};

type SnapshotStructure = { [key in HTTPMethods]?: AnyObject };

export class Snapshot {
  private snapshots: SnapshotStructure = {};
  public static fromDisk(filePath: string) {
    const content = fs.readFileSync(path.resolve(filePath));
    const obj = JSON.parse(content.toString());
    const snapshotInstance = new Snapshot();
    snapshotInstance.snapshots = obj;
    return snapshotInstance;
  }
  public updateSnapshot(
    method: HTTPMethods,
    url: string,
    payload: any
  ): boolean {
    const methodObj = this.snapshots[method];
    if (!methodObj) {
      this.snapshots = {
        ...this.snapshots,
        [method]: {
          [url]: payload
        }
      };
      return true;
    } else {
      if (!methodObj[url]) {
        this.snapshots = {
          ...this.snapshots,
          [method]: {
            ...methodObj,
            [url]: payload
          }
        };
        return true;
      }
      return false;
    }
  }
  public fetchSnapshot(method: HTTPMethods, url: string) {
    const methodObj = this.snapshots[method];
    return methodObj && methodObj[url];
  }
  public clearSnapshot() {
    this.snapshots = {};
  }
  public writeToDisk(filePath: string) {
    fs.writeFileSync(
      path.resolve(filePath),
      JSON.stringify(this.snapshots, undefined, 2)
    );
  }
}
