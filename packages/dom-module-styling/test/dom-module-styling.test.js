import { expect } from '@esm-bundle/chai';
// Import the adapter
import '../dom-module-styling.js';
import './setup.js';
// Import tests from themable-mixin package to be run with the adapter in place
import '../../vaadin-themable-mixin/test/register-styles.test.js';
import '../../vaadin-themable-mixin/test/themable-mixin.test.js';

describe('dom-module-styling', () => {
  it('should have created styles as dom-modules', async () => {
    expect(window.createStylesFunction.called).to.be.true;
  });

  it('should have registered styles using the adapter', async () => {
    expect(window.Vaadin.domModuleStyling.getAllThemes()).not.to.be.empty;
  });
});
