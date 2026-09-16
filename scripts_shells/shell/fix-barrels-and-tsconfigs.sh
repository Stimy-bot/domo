#!/usr/bin/env bash
set -euo pipefail

git checkout -b fix/tsconfigs-and-barrels

echo "Fixing barrel exports (.js/.tsx -> extensionless) ..."
git ls-files 'libs/**/src/index.*' | while read -r f; do
  if grep -qE "export \* from .*/lib/.*\.(js|tsx)('|\")" "$f"; then
    perl -0777 -pe "s{export \* from (['\"])(\./lib/[^'\"\n]+?)\.(js|tsx)\1}{export * from \$1\$2\$1}g" -i "$f"
    echo "  updated $f"
  fi
done

echo "Ensuring tsconfig include patterns for libs..."
find libs -type f -name 'tsconfig*.json' -print0 | while IFS= read -r -d '' cfg; do
  node -e "
const fs = require('fs');
const p = '$cfg';
let j = JSON.parse(fs.readFileSync(p,'utf8'));
const want = ['src/**/*.ts','src/**/*.tsx','src/**/*.d.ts'];
if (!j.include) {
  j.include = want;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\\n');
  console.log('  added include to', p);
} else {
  const set = new Set(j.include);
  let changed = false;
  for (const w of ${JSON.stringify(['src/**/*.ts','src/**/*.tsx','src/**/*.d.ts'])}) {
    if (!set.has(w)) { j.include.push(w); changed = true; }
  }
  if (changed) {
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\\n');
    console.log('  merged include into', p);
  } else {
    console.log('  include ok for', p);
  }
}
"
done

git add -A
git commit -m "fix: remove explicit .js/.tsx from barrels; add include patterns to lib tsconfigs"

echo "Done. Created branch $(git rev-parse --abbrev-ref HEAD)."
