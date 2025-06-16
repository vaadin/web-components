import { walk } from 'estree-walker';
import { globSync } from 'glob';
import MagicString from 'magic-string';
import fs from 'node:fs';
import oxc from 'oxc-parser';

function read(file) {
  const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : '';
  const result = oxc.parseSync(file, content);

  return {
    code: new MagicString(content),
    ast: result.program,
    module: result.module,
  };
}

function write(file, code) {
  fs.writeFileSync(file, code.toString(), 'utf-8');
}

for (const file of globSync([`packages/*/src/**/*-styles.{js,ts}`])) {
  if (file.endsWith('-core-styles.js') || file.endsWith('-base-styles.js')) {
    continue;
  }

  const coreFile = file.replace('-styles', '-core-styles');
  const baseFile = file.replace('-styles', '-base-styles');

  if (fs.existsSync(coreFile) || fs.existsSync(baseFile)) {
    continue;
  }

  fs.copyFileSync(file, baseFile);
  fs.renameSync(file, coreFile);

  if (baseFile.endsWith('.d.ts')) {
    continue;
  }

  const { code, ast } = read(baseFile);

  walk(ast, {
    enter(node) {
      if (node.type === 'TaggedTemplateExpression' && node.tag.name === 'css') {
        code.update(node.start, node.end, `css\`@layer base {}\``);
      }
    },
  });

  write(baseFile, code);
}

for (const file of globSync([`packages/*/src/**/*.js`, `!packages/*/src/**/*-styles.js`])) {
  const { code, module } = read(file);

  module.staticImports.forEach(({ moduleRequest }) => {
    const importPath = moduleRequest.value;
    if (!importPath.endsWith('-styles.js')) {
      return;
    }

    if (!importPath.endsWith('-core-styles.js') && !importPath.endsWith('-base-styles.js')) {
      code.update(moduleRequest.start, moduleRequest.end, `'${importPath.replace('-styles.js', '-core-styles.js')}'`);
    }
  });

  write(file, code);
}
