gemini.suite('vaadin-element', function(rootSuite) {

  rootSuite.setUrl('/');

  gemini.suite('button', function(suite) {
    suite
      .setCaptureElements('#visual-tests')
      .before(function(actions, find) {
        this.button = find('button');
      })
      .capture('normal-button')
      .capture('clicked-button', function(actions) {
        actions.mouseDown(this.button);
      });
  });

});
