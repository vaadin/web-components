gemini.suite('vaadin-form-layout', (rootSuite) => {

  var demos = [
    {name: 'index', snippets: [
      'basic',
      'single-column',
      'columns',
      'colspan',
      'br',
      'column-gap',
      'paper-input'
    ]}
  ];

  demos.forEach(function(demo) {

    gemini.suite(demo.name, (demoSuite) => {

      demo.snippets.forEach((snippet, snippetIndex) => {
        gemini.suite(snippet, (snippetSuite) => {
          snippetSuite
            .setUrl('/../../demo/' + demo.name + '.html')
            .setCaptureElements('demo-snippet:nth-of-type(' + (snippetIndex + 1) + ') vaadin-form-layout')
            .capture('default', {}, (actions, find) => {
              actions
                .waitForJSCondition(function(window) {
                  return window.webComponentsAreReady;
                }, 60000)
                .executeJS(function(window) {
                  // Ensure nothing is focused to prevent blinking cursor
                  var input = window.document.createElement('input');
                  window.document.body.appendChild(input);
                  input.focus();
                  window.document.body.removeChild(input);
                });
            });
        });
      });

    });

  });

});
