// Runs after the production build. Removes build bookkeeping that would otherwise be
// published with the site: Vite's manifest files list every original source and photo
// path next to its random output name, which defeats the point of the random names.
import { rmSync, existsSync } from 'node:fs';

for (const target of ['dist/.vite']) {
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`clean-dist: removed ${target}`);
  }
}
