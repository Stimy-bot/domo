import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const libsDir = path.join(rootDir, 'libs');

// 1. Discover all libraries in libs/
function getLibraries() {
  if (!fs.existsSync(libsDir)) {
    console.error(`Error: Directory ${libsDir} does not exist.`);
    process.exit(1);
  }

  return fs.readdirSync(libsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// 2. Scan TypeScript files for import/export statements
function getFileImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /(?:import|export)\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]|(?:import|export)\s*['"]([^'"]+)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const specifier = match[1] || match[2];
    if (specifier) {
      imports.push(specifier);
    }
  }

  return imports;
}

// 3. Build library-level dependency graph
function buildDependencyGraph(libraries) {
  const graph = {};
  for (const lib of libraries) {
    graph[lib] = new Set();
  }

  function walkDirectory(currentDir, currentLib) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory() && entry.name !== 'node_modules') {
        walkDirectory(fullPath, currentLib);
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name) && !entry.name.endsWith('.spec.ts')) {
        const importSpecifiers = getFileImports(fullPath);

        for (const specifier of importSpecifiers) {
          // Check for package alias imports e.g., "@domo/shared-services"
          if (specifier.startsWith('@domo/')) {
            const targetLib = specifier.replace('@domo/', '').split('/')[0];
            if (libraries.includes(targetLib) && targetLib !== currentLib) {
              graph[currentLib].add(targetLib);
            }
          }

          // Check for cross-lib relative path imports
          if (specifier.startsWith('.')) {
            const resolvedPath = path.resolve(path.dirname(fullPath), specifier);
            const relativeToLibs = path.relative(libsDir, resolvedPath);
            if (!relativeToLibs.startsWith('..')) {
              const targetLib = relativeToLibs.split(path.sep)[0];
              if (libraries.includes(targetLib) && targetLib !== currentLib) {
                graph[currentLib].add(targetLib);
              }
            }
          }
        }
      }
    }
  }

  for (const lib of libraries) {
    const libPath = path.join(libsDir, lib, 'src');
    if (fs.existsSync(libPath)) {
      walkDirectory(libPath, lib);
    }
  }

  return graph;
}

// 4. Find cycles using Depth First Search (DFS)
function findCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const recStack = [];

  function dfs(node) {
    visited.add(node);
    recStack.push(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recStack.includes(neighbor)) {
        const cyclePath = recStack.slice(recStack.indexOf(neighbor));
        cyclePath.push(neighbor);
        cycles.push(cyclePath);
      }
    }

    recStack.pop();
  }

  for (const node of Object.keys(graph)) {
    visited.clear();
    dfs(node);
  }

  // Deduplicate identical cycles
  const uniqueCycles = [];
  const cycleKeys = new Set();

  for (const cycle of cycles) {
    const key = cycle.join('->');
    if (!cycleKeys.has(key)) {
      cycleKeys.add(key);
      uniqueCycles.push(cycle);
    }
  }

  return uniqueCycles;
}

// Run analysis
const libraries = getLibraries();
const graph = buildDependencyGraph(libraries);
const cycles = findCycles(graph);

console.log('\n🔍 --- Nx Workspace Library Dependency Scan ---');
console.log(`Discovered ${libraries.length} libraries: ${libraries.join(', ')}\n`);

if (cycles.length === 0) {
  console.log('✅ No circular dependencies detected between libraries!');
} else {
  console.error(`❌ Found ${cycles.length} circular dependency cycle(s):\n`);
  cycles.forEach((cycle, index) => {
    console.error(`  ${index + 1}) ${cycle.join(' ➔ ')}`);
  });
  console.log('\nResolve these by removing reverse imports or moving shared types/utilities into a lower-level library.');
  process.exit(1);
}