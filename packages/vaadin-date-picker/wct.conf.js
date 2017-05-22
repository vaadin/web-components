module.exports = {
  registerHooks: function(context) {
    context.options.plugins.sauce.browsers = [
      // - So much random timeouts in CI but working in local
      // 'OS X 10.11/iphone@10.2',
      // 'OS X 10.11/ipad@10.2',

      // - Works in local, but in CI there are some failures on detach
      //   probably because of async tasks executed after test is done.
      //   Revisit when pure Polymer 2.0
      // 'Windows 10/internet explorer@11'

      'Windows 10/chrome@55',
      'Windows 10/firefox@50',
      'Windows 10/microsoftedge@14',
      'OS X 10.11/safari@10.0'
    ];
  },

  plugins: {
    'random-output': true
  }
};
