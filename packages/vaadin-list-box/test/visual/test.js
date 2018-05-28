gemini.suite('vaadin-list-box', function(rootSuite) {
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

  gemini.suite('list-box', function(suite) {
    suite
      .setUrl('list-box.html')
      .setCaptureElements('#list-box-tests')
      .capture('list-box');
  });

});
