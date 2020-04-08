gemini.suite('vaadin-login-overlay', function(rootSuite) {
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

  const screens = [
    {name: 'desktop', width: 1600, height: 1000},
    {name: 'medium', width: 1000, height: 600},
    {name: 'small-portrait', width: 500, height: 1000}
  ];

  screens.forEach(({name, width, height}) => {

    ['lumo', 'material'].forEach(theme => {
      ['ltr', 'rtl'].forEach(direction => {

        gemini.suite(`default-tests-${name}-${theme}-${direction}`, function(suite) {
          suite
            .before(action => action.setWindowSize(width, height))
            .setUrl(`default.html?theme=${theme}&dir=${direction}`)
            .setCaptureElements('body')
            .capture(`vaadin-login-overlay`);
        });
      });
    });
  });

});
