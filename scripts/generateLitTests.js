import { glob } from 'glob';
import fs from 'node:fs';

const packages = fs.readdirSync('packages');

packages
  .filter((pkg) => {
    return glob.sync(`packages/${pkg}/vaadin-lit-*`).length > 0;
  })
  .flatMap((pkg) => {
    return glob.sync(`packages/${pkg}/test/*.test.{js,ts}`);
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
