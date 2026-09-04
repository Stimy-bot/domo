// scripts/fix-tsconfigs.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.cwd(), 'libs');

function findFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) out.push(...findFiles(p));
    else if (/tsconfig.*\.json$/.test(name)) out.push(p);
  }
  return out;
}

const files = findFiles(root);
const targetFiles = files.filter((f) => {
  try {
    const txt = fs.readFileSync(f, 'utf8');
    return /"outDir"\s*:\s*".*dist\/out-tsc/.test(txt);
  } catch {
    return false;
  }
});

if (!targetFiles.length) {
  console.log('No tsconfig files with outDir -> dist/out-tsc found under libs/.');
  process.exit(0);
}

for (const file of targetFiles) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(raw);

    if (typeof json !== 'object' || Array.isArray(json)) {
      console.log('Skipping non-object JSON', file);
      continue;
    }

    json.compilerOptions = json.compilerOptions || {};

    // Only set rootDir if not present
    if (!('rootDir' in json.compilerOptions)) {
      json.compilerOptions.rootDir = 'src';
      console.log('Set rootDir for', file);
    } else {
      console.log('rootDir already present in', file);
    }

    if (!('moduleResolution' in json.compilerOptions)) {
      json.compilerOptions.moduleResolution = 'node';
      console.log('Set moduleResolution for', file);
    }

    if (!('jsx' in json.compilerOptions)) {
      json.compilerOptions.jsx = 'react-jsx';
      console.log('Set jsx for', file);
    }

    // Merge include entries
    const desired = ['src/**/*.ts', 'src/**/*.tsx', 'src/types/**/*.d.ts'];
    json.include = Array.isArray(json.include) ? Array.from(new Set([...json.include, ...desired])) : desired;

    // Write back with 2-space formatting
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('Updated', file);
  } catch (err) {
    console.error('Failed to process', file, err.message);
  }
}
