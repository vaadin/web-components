import { expect } from '@esm-bundle/chai';
// Import the adapter
import '../style-modules.js';
// Use LitElement based custom elements in the tests
import '@vaadin/vaadin-themable-mixin/test/lit-setup.js';
// Use <dom-module theme-for="..."> styling (via the adapter) in the tests
import './setup.js';
// Import tests from themable-mixin package to be run with the adapter in place
import '@vaadin/vaadin-themable-mixin/test/register-styles.test.js';
import '@vaadin/vaadin-themable-mixin/test/themable-mixin.test.js';
import { LitElement } from 'lit';

describe('style-modules-lit', () => {
  it('should have created styles as dom-modules', () => {
    expect(window.createStylesFunction.called).to.be.true;
  });

  it('should have registered styles using the adapter', () => {
    expect(window.Vaadin.styleModules.getAllThemes()).not.to.be.empty;
  });

  it('should have defined LitElement based custom elements', () => {
    expect(document.createElement('register-styles-component-type-test')).to.be.instanceOf(LitElement);
  });
});
