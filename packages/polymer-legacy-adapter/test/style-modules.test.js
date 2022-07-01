import { expect } from '@esm-bundle/chai';
// Import the adapter
import '../style-modules.js';
import './setup.js';
// Import tests from themable-mixin package to be run with the adapter in place
import '@vaadin/vaadin-themable-mixin/test/register-styles.test';
import '@vaadin/vaadin-themable-mixin/test/themable-mixin.test';

describe('style-modules', () => {
  it('should have created styles as dom-modules', () => {
    expect(window.createStylesFunction.called).to.be.true;
  });

  it('should have registered styles using the adapter', () => {
    expect(window.Vaadin.styleModules.getAllThemes()).not.to.be.empty;
  });
});
