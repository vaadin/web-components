import { globSync } from 'glob';
import fs from 'node:fs';

// Remove any existing generated test files
globSync('packages/*/test/**/*.generated.test.{js,ts}').forEach((testPath) => {
  fs.unlinkSync(testPath);
});

const packages = fs.readdirSync('packages');

// Generate Lit unit test files
packages
  .filter((pkg) => {
    return globSync(`packages/${pkg}/vaadin-lit-*`).length > 0;
  })
  .flatMap((pkg) => {
    return globSync(`packages/${pkg}/test/*.test.{js,ts}`);
  })
  .filter((testPath) => {
    return !/(-polymer|-lit)(\.generated)?\.test/u.test(testPath);
  })
  .forEach((testPath) => {
    const generatedLitTestPath = testPath.replace('.test.', '-lit.generated.test.');
    fs.symlinkSync(fs.realpathSync(testPath), generatedLitTestPath);
  });

// Generate RTL visual test files
packages
  .flatMap((pkg) => {
    return globSync(`packages/${pkg}/test/visual/**/*.test.{js,ts}`);
  })
  .filter((testPath) => {
    if (/(-rtl|-ltr)(\.generated)?\.test/u.test(testPath)) {
      return false;
    }

    if (!fs.readFileSync(testPath, 'utf-8').match(/^const DIR = document.dir/mu)) {
      return false;
    }

    return true;
  })
  .forEach((testPath) => {
    const generatedRTLTestPath = testPath.replace('.test.', '-rtl.generated.test.');
    fs.symlinkSync(fs.realpathSync(testPath), generatedRTLTestPath);
  });
