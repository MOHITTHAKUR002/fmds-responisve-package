#!/usr/bin/env node

/**
 * FMDS CLI - Command line transformer for plain HTML/CSS projects
 * Usage:
 *   npx fmds input.css -o output.css [--watch]
 */

import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import fmdsPostcss from '../src/postcss/index.js';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Fluid Multiplier Design System (FMDS) CLI

Website & Docs: https://fmds-responsive.quadops.in/

Usage:
  fmds <input.css> -o <output.css> [options]

Options:
  -o, --output <file>    Output destination file (required)
  -w, --watch            Watch input file for changes and recompile
  --min-px <number>      Minimum pixel value to transform (default: 2)
  -h, --help             Show this help message

Examples:
  fmds src/style.css -o dist/style.css
  fmds src/style.css -o dist/style.css --watch
`);
}

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  printHelp();
  process.exit(0);
}

let inputFile = null;
let outputFile = null;
let isWatch = false;
let minPixelValue = 2;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '-o' || arg === '--output') {
    outputFile = args[++i];
  } else if (arg === '-w' || arg === '--watch') {
    isWatch = true;
  } else if (arg === '--min-px') {
    minPixelValue = parseFloat(args[++i]);
  } else if (!arg.startsWith('-')) {
    if (!inputFile) inputFile = arg;
  }
}

if (!inputFile || !outputFile) {
  console.error('Error: Both input file and output file (-o) are required.');
  printHelp();
  process.exit(1);
}

const processor = postcss([
  fmdsPostcss({ minPixelValue })
]);

async function build() {
  try {
    const inputPath = path.resolve(process.cwd(), inputFile);
    const outputPath = path.resolve(process.cwd(), outputFile);

    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file not found: ${inputPath}`);
      return;
    }

    const cssContent = fs.readFileSync(inputPath, 'utf8');
    const result = await processor.process(cssContent, {
      from: inputPath,
      to: outputPath,
    });

    // Ensure output directory exists
    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, result.css);
    console.log(`[FMDS] Transformed ${inputFile} -> ${outputFile} (${new Date().toLocaleTimeString()})`);
  } catch (err) {
    console.error('[FMDS] Build Error:', err.message);
  }
}

build();

if (isWatch) {
  console.log(`[FMDS] Watching ${inputFile} for changes...`);
  fs.watch(inputFile, (eventType) => {
    if (eventType === 'change') {
      build();
    }
  });
}
