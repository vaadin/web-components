// To add more device use Platform generator from here:
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
// and check that the configuration is available at https://saucelabs.com/beta/manual
module.exports = {
  verbose: false,
  testTimeout: 6 * 60 * 1000,
  suites: ['test'],
  plugins: {
    sauce: {
      'disabled': true,
      'browsers': [
        {
          'browserName': 'MicrosoftEdge',
          'platform': 'Windows 10',
          'version': '16'
        },
        {
          'browserName': 'Internet Explorer',
          'platform': 'Windows 7',
          'version': '11'
        },
        {
          'browserName': 'Chrome',
          'platform': 'Windows 10',
          'version': '55.0'
        },
        {
          'browserName': 'Firefox',
          'platform': 'Windows 10',
          'version': '50.0'
        },
        {
          'browserName': 'safari',
          'platform': 'OS X 10.11',
          'version': '10.0'
        },
        {
          'browserName': 'safari',
          'platform': 'OS X 10.11',
          'version': '9.0'
        },
        {
          'browserName': 'safari',
          'appiumVersion': '1.6.3',
          'deviceName': 'iPad Simulator',
          'deviceOrientation': 'portrait',
          'platformName': 'iOS',
          'platformVersion': '10.2'
        }
      ]
    }
  }
};
