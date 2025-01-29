const fs = require('fs');
const glob = require('glob');

const packages = fs.readdirSync('packages');

packages
  .filter((pkg) => {
    return fs.existsSync(`packages/${pkg}/vaadin-lit-${pkg}.js`);
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
