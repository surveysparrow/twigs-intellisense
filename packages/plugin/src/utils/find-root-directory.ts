import fs from 'fs';
import path from 'path';

const TWIGS_PACKAGE = path.join('node_modules', '@sparrowengg', 'twigs-react');

/** Walk up from `dir` to the filesystem root, calling `match` on each ancestor. */
function walkUp(dir: string, match: (candidate: string) => boolean): string | null {
  let current = dir;

  while (true) {
    if (match(current)) return current;

    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

/**
 * Find the directory whose `node_modules` actually contains `@sparrowengg/twigs-react`.
 *
 * Checking for the package itself rather than for any `node_modules` matters in a
 * monorepo: a workspace package often has its own `node_modules` holding only the
 * dependencies that could not be hoisted, while Twigs sits at the repository root.
 */
export function findRootDir(dir: string): string | null {
  return walkUp(dir, (candidate) => fs.existsSync(path.join(candidate, TWIGS_PACKAGE)));
}

/**
 * Find the nearest directory containing a Twigs config file. It need not be the
 * same directory as the one holding `node_modules` — a workspace package can carry
 * its own config while Twigs is installed at the root.
 */
export function findConfigDir(dir: string): string | null {
  return walkUp(dir, (candidate) => (
    fs.existsSync(path.join(candidate, 'twigs.config.js'))
    || fs.existsSync(path.join(candidate, 'twigs.config.ts'))
  ));
}
