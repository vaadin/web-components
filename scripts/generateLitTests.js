import { globSync } from 'glob';
import fs from 'node:fs';

const packages = fs.readdirSync('packages');

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

    if (!fs.existsSync(generatedLitTestPath)) {
      fs.symlinkSync(fs.realpathSync(testPath), generatedLitTestPath);
    }
  });
