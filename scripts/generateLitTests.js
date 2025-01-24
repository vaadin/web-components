const fs = require('fs');
const path = require('path');
const glob = require('glob');

glob.sync('packages/*/test/*.test.{js,ts}').forEach((testPath) => {
  if (/(-polymer|-lit)\.test/u.test(testPath)) {
    return;
  }

  const litTestPath = testPath.replace('.test.', '-generated-lit.test.');
  if (fs.existsSync(litTestPath)) {
    return;
  }

  fs.symlinkSync(path.relative(path.dirname(testPath), testPath), litTestPath, 'file');
});
