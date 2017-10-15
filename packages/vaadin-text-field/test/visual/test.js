var argv = require('yargs').argv;

var component = argv.component;

gemini.suite(component, function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
    });
  }

  rootSuite
    .before(wait)
    .after(goToAboutBlank);

  switch (component) {
    case 'vaadin-text-field':
      gemini.suite('text-field', function(suite) {
        suite
          .setUrl('vaadin-text-field/text-field.html')
          .setCaptureElements('#text-field')
          .capture('text-field');
      });

      gemini.suite('styling', function(suite) {
        suite
          .setUrl('vaadin-text-field/styling.html')
          .setCaptureElements('vaadin-text-field')
          .capture('styling');
      });

      gemini.suite('rtl', function(suite) {
        suite
          .setUrl('vaadin-text-field/rtl.html')
          .setCaptureElements('#rtl')
          .capture('rtl');
      });
      break;

    case 'vaadin-password-field':
      gemini.suite('password', function(suite) {
        suite
          .setUrl('vaadin-password-field/password-field.html')
          .setCaptureElements('#password-field')
          .capture('password-field');
      });

      gemini.suite('rtl', function(suite) {
        suite
          .setUrl('vaadin-password-field/rtl.html')
          .setCaptureElements('#rtl')
          .capture('rtl');
      });
      break;

    case 'vaadin-text-area':
      gemini.suite('text-area-1', function(suite) {
        suite
          .setUrl('vaadin-text-area/text-area-1.html')
          .setCaptureElements('#text-area')
          .capture('text-area-1');
      });

      gemini.suite('text-area-2', function(suite) {
        suite
          .setUrl('vaadin-text-area/text-area-2.html')
          .setCaptureElements('#text-area')
          .capture('text-area-2');
      });

      gemini.suite('text-area-3', function(suite) {
        suite
          .setUrl('vaadin-text-area/text-area-3.html')
          .setCaptureElements('#text-area')
          .capture('text-area-3');
      });

      gemini.suite('styling', function(suite) {
        suite
          .setUrl('vaadin-text-area/styling.html')
          .setCaptureElements('vaadin-text-area')
          .capture('styling');
      });

      gemini.suite('rtl', function(suite) {
        suite
          .setUrl('vaadin-text-area/rtl.html')
          .setCaptureElements('#rtl')
          .capture('rtl');
      });
      break;
  }
});
