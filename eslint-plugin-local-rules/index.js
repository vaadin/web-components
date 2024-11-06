/* eslint-env node */
module.exports = {
  get rules() {
    return {
      'no-direct-validate-method-calls': require('./no-direct-validate-method-calls'),
    };
  },
};
