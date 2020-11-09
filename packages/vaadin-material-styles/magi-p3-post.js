module.exports = {
  files: [
    'all-imports.js'
  ],
  from: [
    /import '\.\/(.+)\.js';/g
  ],
  to: [
    `import './$1.js';\nexport * from './$1.js';`
  ]
};
