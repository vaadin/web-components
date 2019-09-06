gemini.suite('vaadin-app-layout', function(rootSuite) {
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

  ['lumo', 'lumo-dark', 'material'].forEach(theme => {
    gemini.suite(`drawer-${theme}`, function(suite) {
      suite
        .setUrl(`/drawer.html?theme=${theme}`)
        .setCaptureElements('#drawer-tests')
        .capture('default');
    });

    gemini.suite(`primary-drawer-${theme}`, function(suite) {
      suite
        .setUrl(`/primary-drawer.html?theme=${theme}`)
        .setCaptureElements('#primary-drawer-tests')
        .capture('default');
    });

    gemini.suite(`tabs-${theme}`, function(suite) {
      suite
        .setUrl(`/tabs.html?theme=${theme}`)
        .setCaptureElements('#tabs-tests')
        .capture('default');
    });
  });
});
