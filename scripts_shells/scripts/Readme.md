Here is a zero-dependency Node.js script that scans all projects in libs/ for cross-library circular dependencies and outputs any detected cycles directly to your terminal.

Step 1: Create the detection script
Create a file at scripts/detect-circular-deps.mjs:

Step 2: Add script command to package.json
Add a convenience script to your root package.json:

{
  "scripts": {
    "check:circular": "node scripts/detect-circular-deps.mjs"
  }
}

Step 3: Run the detector
Execute the script from your terminal:

Bash
pnpm check:circular