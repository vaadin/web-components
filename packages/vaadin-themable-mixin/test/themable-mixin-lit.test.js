import { expect } from '@esm-bundle/chai';
import './lit-setup.js';
import './themable-mixin.test.js';
import { LitElement } from 'lit';

it('should have defined LitElement based custom elements', () => {
  expect(document.createElement('component-type-test')).to.be.instanceOf(LitElement);
});
