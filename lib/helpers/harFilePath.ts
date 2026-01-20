import path = require("path");
import fs = require("fs");

/**
 * Resolve an absolute path for a HAR file under the workspace-level .hars directory.
 * Example: harFilePath("product") -> <workspace-root>/.hars/product.har
 * The .hars directory is created if it does not exist.
 */
export function harFilePath(harFileName: string) {
  const harPath = path.resolve(__dirname, "..", "..", ".hars", `${harFileName}.har`);
  fs.mkdir(path.dirname(harPath), { recursive: true }, (err) => {});
  return harPath;
}
