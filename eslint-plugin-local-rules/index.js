/* eslint-env node */
const fs = require('fs');
const path = require('path');

const rules = {};
const rulesDir = `${__dirname}/rules`;

fs.readdirSync(rulesDir)
  .map((fileName) => path.resolve(rulesDir, fileName))
  .forEach((filePath) => {
    const name = path.basename(filePath, path.extname(filePath));
    rules[name] = require(filePath);
  });

module.exports = { rules };
