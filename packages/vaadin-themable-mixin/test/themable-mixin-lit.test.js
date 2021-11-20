import { expect } from '@esm-bundle/chai';
import './themable-mixin-lit-setup.js';
import './themable-mixin.test.js';
import { LitElement } from 'lit';

it('should have defined LitElement based custom elements', async () => {
  expect(document.createElement('test-foo')).to.be.instanceOf(LitElement);
});
