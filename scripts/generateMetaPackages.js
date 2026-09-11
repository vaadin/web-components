#!/usr/bin/env node

/**
 * This script generates the contents of the meta packages, `@vaadin/vaadin-core`
 * and `@vaadin/vaadin`, from the workspace: the `version` and `dependencies` of
 * their `package.json`, and the imports of their entry point.
 *
 * A package is a dependency of `@vaadin/vaadin-core` when it is licensed under
 * Apache-2.0 and of `@vaadin/vaadin` when it is not, which is what separates the
 * core components from the commercial ones. `@vaadin/vaadin` also depends on
 * `@vaadin/vaadin-core`, so that it ships every component.
 *
 * The entry point imports the root level `vaadin-*.js` entry points of those
 * packages that register something when imported, either a custom element or an
 * iconset. Whether they do is resolved by following their imports and re-exports
 * within the package, which leaves out the entry points that only export a mixin
 * or a class.
 *
 * Run with: node scripts/generateMetaPackages.js
 * Verify that the committed files are up to date: node scripts/generateMetaPackages.js --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lerna from '../lerna.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

const { version } = lerna;

const META_PACKAGES = [
  { dir: 'vaadin-core', name: '@vaadin/vaadin-core', entryPoint: 'vaadin-core.js', core: true },
  { dir: 'vaadin', name: '@vaadin/vaadin', entryPoint: 'vaadin.js', core: false },
];

// The theme packages are dependencies of the meta packages, but their entry
// points are styles and icons rather than components, so they are not imported.
const THEME_PACKAGES = new Set(['aura', 'vaadin-lumo-styles']);

// How a module registers a custom element or an iconset
const REGISTRATION = /\b(?:defineCustomElement|customElements\.define|Iconset\.register)\(/u;

// The relative imports and re-exports of a module, which stay within the package
const RELATIVE_IMPORTS = /(?:^|[\s,{}])(?:from|import)\s*['"](\.[^'"]+)['"]/gmu;

const metaPackageDirs = new Set(META_PACKAGES.map((metaPackage) => metaPackage.dir));

// Sorts names by code unit, the order of a sort with no compare function, which
// keeps the generated files byte for byte the same on every machine
const byName = (a, b) => {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
};

/**
 * Reads the `package.json` of a package of the workspace.
 * @param {string} dir - the package directory name, e.g. "button"
 * @returns {object | null} - the parsed `package.json`, or null when there is none
 */
function readPackageJson(dir) {
  const file = path.join(packagesDir, dir, 'package.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : null;
}

/**
 * Lists the packages of the workspace that the meta packages ship, in two
 * groups: the ones licensed under Apache-2.0 and the commercial ones.
 * @returns {{ core: object[], commercial: object[] }}
 */
function collectPackages() {
  const core = [];
  const commercial = [];

  for (const dir of fs.readdirSync(packagesDir).sort(byName)) {
    if (metaPackageDirs.has(dir)) {
      continue;
    }

    const packageJson = readPackageJson(dir);
    if (!packageJson || packageJson.private) {
      continue;
    }

    const group = packageJson.license === 'Apache-2.0' ? core : commercial;
    group.push({ dir, ...packageJson });
  }

  return { core, commercial };
}

/**
 * Returns whether importing the module registers a custom element or an iconset,
 * following its imports and re-exports within the package. An entry point that
 * only exports a mixin or a class, e.g. `vaadin-item-mixin.js`, registers
 * nothing and thus does not belong to the entry point of a meta package.
 * @param {string} file - absolute path of the module
 * @param {Set<string>} visited - the modules already followed
 * @returns {boolean}
 */
function registersComponent(file, visited = new Set()) {
  if (visited.has(file) || !fs.existsSync(file)) {
    return false;
  }
  visited.add(file);

  const source = fs.readFileSync(file, 'utf-8');
  if (REGISTRATION.test(source)) {
    return true;
  }

  return [...source.matchAll(RELATIVE_IMPORTS)].some(([, specifier]) =>
    registersComponent(path.resolve(path.dirname(file), specifier), visited),
  );
}

/**
 * Lists the modules of a package that the entry point of a meta package imports.
 * The main entry point comes first and is imported by package name, the other
 * ones by their path.
 * @param {object} packageJson - the `package.json` of the package
 * @returns {string[]} - e.g. ["@vaadin/login", "@vaadin/login/vaadin-login-form.js"]
 */
function collectImports(packageJson) {
  if (THEME_PACKAGES.has(packageJson.dir)) {
    return [];
  }

  const packageDir = path.join(packagesDir, packageJson.dir);
  const entryPoints = fs
    .readdirSync(packageDir)
    .filter((file) => /^vaadin-.*\.js$/u.test(file))
    .filter((file) => registersComponent(path.join(packageDir, file)))
    .sort(byName);

  // The main entry point of the package comes first, imported by package name
  const main = entryPoints.indexOf(packageJson.main);
  if (main > 0) {
    entryPoints.unshift(entryPoints.splice(main, 1)[0]);
  }

  return entryPoints.map((file) => (file === packageJson.main ? packageJson.name : `${packageJson.name}/${file}`));
}

/**
 * Creates the contents of the entry point of a meta package.
 * @param {string[]} imports - the modules to import
 * @returns {string}
 */
function createEntryPoint(imports) {
  return [
    '// This file is generated by scripts/generateMetaPackages.js. Do not edit it by hand.',
    ...imports.map((module) => `import '${module}';`),
    '',
  ].join('\n');
}

/**
 * Creates the contents of the `package.json` of a meta package, keeping every
 * field of the committed one but the generated `version` and `dependencies`.
 * @param {object} packageJson - the committed `package.json`
 * @param {string[]} dependencies - the names of the packages to depend on
 * @returns {string}
 */
function createPackageJson(packageJson, dependencies) {
  const generated = {
    ...packageJson,
    version,
    dependencies: Object.fromEntries([...dependencies].sort(byName).map((name) => [name, version])),
  };

  return `${JSON.stringify(generated, null, 2)}\n`;
}

const check = process.argv.includes('--check');
const { core, commercial } = collectPackages();
const outdated = [];

for (const metaPackage of META_PACKAGES) {
  const packageJson = readPackageJson(metaPackage.dir);
  if (!packageJson) {
    throw new Error(`No package.json found for ${metaPackage.name}`);
  }

  const packages = metaPackage.core ? core : commercial;
  const dependencies = packages.map((pkg) => pkg.name);
  const imports = packages.flatMap((pkg) => collectImports(pkg));

  if (!metaPackage.core) {
    dependencies.unshift('@vaadin/vaadin-core');
    imports.unshift('@vaadin/vaadin-core');
  }

  const files = {
    'package.json': createPackageJson(packageJson, dependencies),
    [metaPackage.entryPoint]: createEntryPoint(imports),
  };

  for (const [name, content] of Object.entries(files)) {
    const file = path.join(packagesDir, metaPackage.dir, name);

    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf-8') !== content) {
        outdated.push(path.relative(rootDir, file));
      }
    } else {
      fs.writeFileSync(file, content);
      console.log(`Generated ${path.relative(rootDir, file)}`);
    }
  }

  if (!check) {
    console.log(`${metaPackage.name}: ${dependencies.length} packages, ${imports.length} imports`);
  }
}

if (outdated.length > 0) {
  console.error(
    [
      `The meta packages are out of date: ${outdated.join(', ')}`,
      'Run `yarn generate:meta` and commit the result.',
    ].join('\n'),
  );
  process.exit(1);
}
