import fs from 'fs';

export function parseFile(path: string) {
  try {
    const contents = fs.readFileSync(path, 'utf8');
    return contents
  } catch (err) {
    console.error(`File not present in ${path} ${err}`);
    return null;
  }
}