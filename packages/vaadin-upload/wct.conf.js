var args = require('yargs').argv;

module.exports = {
  extraScripts: args.dom === 'shadow' ? ['test/enable-shadow-dom.js'] : []
};
