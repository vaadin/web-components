gemini.suite('vaadin-tabs', function(rootSuite) {

  function wait(actions, find) {
    return actions
      .waitForJSCondition(function(window) {
        return !!(window.WebComponents && window.WebComponents.ready);
      }, 15000);
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
    gemini.suite(`horizontal-tabs-${theme}`, (suite) => {
      suite
        .setUrl(`horizontal-tabs.html?theme=${theme}`)
        .setCaptureElements('#horizontal-tabs')
        .capture('horizontal-tabs');
    });

    gemini.suite(`vertical-tabs-${theme}`, (suite) => {
      suite
        .setUrl(`vertical-tabs.html?theme=${theme}`)
        .setCaptureElements('#vertical-tabs')
        .capture('vertical-tabs');
    });

    gemini.suite(`scrollable-tabs-${theme}`, (suite) => {
      suite
        .setUrl(`scrollable-tabs.html?theme=${theme}`)
        .setCaptureElements('#scrollable-tabs')
        .capture('scrollable-tabs');
    });

    gemini.suite(`anchor-tabs-${theme}`, (suite) => {
      suite
        .setUrl(`anchor-tabs.html?theme=${theme}`)
        .setCaptureElements('#anchor-tabs')
        .capture('anchor-tabs');
    });
  });

});
