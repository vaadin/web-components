const fs = require('fs');
const path = require('path');
const glob = require('glob');

const litPackages = fs.readdirSync('packages').filter((package) => {
  return fs.existsSync(`packages/${package}/vaadin-lit-${package}.js`);
});

litPackages
  .flatMap((package) => {
    return glob.sync(`packages/${package}/test/*.test.{js,ts}`);
  })
  .filter((testPath) => {
    return !/(-polymer|-lit)\.test/u.test(testPath);
  })
  .forEach((testPath) => {
    const litTestPath = testPath.replace('.test.', '-generated-lit.test.');
    if (fs.existsSync(litTestPath)) {
      return;
    }

    fs.symlinkSync(path.relative(path.dirname(testPath), testPath), litTestPath, 'file');
  });
