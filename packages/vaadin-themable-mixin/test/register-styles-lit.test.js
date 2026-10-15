import { expect } from '@vaadin/chai-plugins';
import './lit-setup.js';
import './register-styles.test.js';
import { LitElement } from 'lit';

it('should have defined LitElement based custom elements', () => {
  expect(document.createElement('register-styles-component-type-test')).to.be.instanceOf(LitElement);
});
