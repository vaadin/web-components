gemini.suite('vaadin-text-field', function(rootSuite) {
  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return window.webComponentsAreReady;
      }, 80000);
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
  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`text-field-1-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-field/text-field-1.html?theme=${theme}`)
        .setCaptureElements('#text-field')
        .capture('text-field-1');
    });

    gemini.suite(`text-field-2-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-field/text-field-2.html?theme=${theme}`)
        .setCaptureElements('#text-field')
        .capture('text-field-2');
    });

    gemini.suite(`text-field-3-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-field/text-field-3.html?theme=${theme}`)
        .setCaptureElements('#text-field')
        .capture('text-field-3');
    });

    gemini.suite(`text-field-styling-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-field/styling.html?theme=${theme}`)
        .setCaptureElements('#text-field')
        .capture('styling');
    });

    gemini.suite(`text-field-rtl-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-field/rtl.html?theme=${theme}`)
        .setCaptureElements('#rtl')
        .capture('rtl');
    });

    gemini.suite(`text-field-clear-button-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-field/text-field-clear-btn.html?theme=${theme}`)
        .setCaptureElements('#text-field-clear-button')
        .capture('text-field-clear-button');
    });

    gemini.suite(`password-field-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-password-field/password-field.html?theme=${theme}`)
        .setCaptureElements('#password-field')
        .capture('password-field');
    });

    gemini.suite(`password-field-rtl-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-password-field/rtl.html?theme=${theme}`)
        .setCaptureElements('#rtl')
        .capture('rtl');
    });

    gemini.suite(`password-field-clear-button-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-password-field/password-field-clear-btn.html?theme=${theme}`)
        .setCaptureElements('#password-field-clear-button')
        .capture('password-field-clear-button');
    });

    gemini.suite(`number-field-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-number-field/number-field.html?theme=${theme}`)
        .setCaptureElements('#number-field')
        .capture('number-field');
    });

    gemini.suite(`text-area-1-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-area/text-area-1.html?theme=${theme}`)
        .setCaptureElements('#text-area')
        .capture('text-area-1', function(actions) {
          actions.executeJS(function(window) {
            window.scrollTextArea();
          });
        });
    });

    gemini.suite(`text-area-2-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-area/text-area-2.html?theme=${theme}`)
        .setCaptureElements('#text-area')
        .capture('text-area-2');
    });

    gemini.suite(`text-area-3-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-area/text-area-3.html?theme=${theme}`)
        .setCaptureElements('#text-area')
        .capture('text-area-3');
    });

    gemini.suite(`text-area-styling-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-area/styling.html?theme=${theme}`)
        .setCaptureElements('#text-area')
        .capture('styling');
    });

    gemini.suite(`text-area-rtl-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-area/rtl.html?theme=${theme}`)
        .setCaptureElements('#rtl')
        .capture('rtl');
    });

    gemini.suite(`text-area-clear-button-${theme}`, function(suite) {
      suite
        .setUrl(`vaadin-text-area/text-area-clear-btn.html?theme=${theme}`)
        .setCaptureElements('#text-area-clear-button')
        .capture('text-area-clear-button');
    });
  });
});
