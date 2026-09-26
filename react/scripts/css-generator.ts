/**
 * This script exposes Lumo utility styles as CSS modules for backwards compatibility.
 * It copies individual utility CSS files from the @vaadin/vaadin-lumo-styles package
 * and processes the main utility.css file to reference these CSS modules. File names
 * and paths are adjusted to match the previous file paths.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { nodeModulesDir, packageDir } from './utils/config.js';

const themePackage = resolve(nodeModulesDir, '@vaadin/vaadin-lumo-styles');
const utilitiesSourceDir = resolve(themePackage, 'src', 'utilities');

const outputDir = resolve(packageDir, 'css', 'lumo');
const utilitiesOutputDir = resolve(outputDir, 'utilities');

function toCamelCase(dashSeparated: string): string {
  return dashSeparated
    .split('-')
    .map((item) => item[0].toUpperCase() + item.substring(1))
    .join('');
}

// Create output directories
mkdirSync(utilitiesOutputDir, { recursive: true });

// Copy individual utility CSS files to CSS modules
readdirSync(utilitiesSourceDir)
  .filter((file) => file.endsWith('.css'))
  .forEach((file) => {
    const moduleName = toCamelCase(file.replace(/\.css$/, '')) + '.module.css';

    const sourceFilePath = resolve(utilitiesSourceDir, file);
    const outputFilePath = resolve(utilitiesOutputDir, moduleName);

    copyFileSync(sourceFilePath, outputFilePath);
  });

// Process utility.css entry point to CSS module
const entryPointSourceFile = resolve(themePackage, 'utility.css');
const entryPointOutputFile = resolve(outputDir, 'Utility.module.css');
const entryPointCss = readFileSync(entryPointSourceFile, 'utf-8').replace(
  /@import\s+['"]([^'"]+)['"];/g,
  (_match, path) => {
    const fileName = path
      .split('/')
      .pop()
      .replace(/\.css$/, '');
    const moduleName = toCamelCase(fileName) + '.module.css';

    return `@import './utilities/${moduleName}';`;
  },
);
writeFileSync(entryPointOutputFile, entryPointCss, 'utf-8');
