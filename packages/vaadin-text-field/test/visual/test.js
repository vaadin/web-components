gemini.suite('vaadin-text-field', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.WebComponents && window.WebComponents.ready;
      }, 60000);
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

  gemini.suite('text-field-1', function(suite) {
    suite
      .setUrl('vaadin-text-field/text-field-1.html')
      .setCaptureElements('#text-field')
      .capture('text-field-1');
  });

  gemini.suite('text-field-2', function(suite) {
    suite
      .setUrl('vaadin-text-field/text-field-2.html')
      .setCaptureElements('#text-field')
      .capture('text-field-2');
  });

  gemini.suite('text-field-styling', function(suite) {
    suite
      .setUrl('vaadin-text-field/styling.html')
      .setCaptureElements('#text-field')
      .capture('styling');
  });

  gemini.suite('text-field-rtl', function(suite) {
    suite
      .setUrl('vaadin-text-field/rtl.html')
      .setCaptureElements('#rtl')
      .capture('rtl');
  });

  gemini.suite('password-field', function(suite) {
    suite
      .setUrl('vaadin-password-field/password-field.html')
      .setCaptureElements('#password-field')
      .capture('password-field');
  });

  gemini.suite('password-field-rtl', function(suite) {
    suite
      .setUrl('vaadin-password-field/rtl.html')
      .setCaptureElements('#rtl')
      .capture('rtl');
  });

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

  gemini.suite('text-area-styling', function(suite) {
    suite
      .setUrl('vaadin-text-area/styling.html')
      .setCaptureElements('#text-area')
      .capture('styling');
  });

  gemini.suite('text-area-rtl', function(suite) {
    suite
      .setUrl('vaadin-text-area/rtl.html')
      .setCaptureElements('#rtl')
      .capture('rtl');
  });
});
