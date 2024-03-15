import fs from 'fs';
import path from 'path';

export function findRootDir(dir: string) {
  if (fs.existsSync(path.join(dir, 'node_modules'))) {
    return dir;
  } else {
    let parentDir = path.dirname(dir);
    if (parentDir === dir) {
      return null;
    } else {
      return findRootDir(parentDir);
    }
  }
}