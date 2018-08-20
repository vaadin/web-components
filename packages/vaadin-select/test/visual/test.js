gemini.suite('vaadin-dropdown-menu', function(rootSuite) {
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

  // Lumo theme
  gemini.suite('default-tests', function(suite) {
    suite
      .setUrl('dropdown-menu.html')
      .setCaptureElements('#dropdown-menu')
      .capture('dropdown-menu');
  });

  // Material theme
  gemini.suite('material-default-tests', function(suite) {
    suite
      .setUrl('dropdown-menu.html')
      .setCaptureElements('#dropdown-menu')
      .capture('dropdown-menu');
  });

});
