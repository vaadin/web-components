import { expect } from '@esm-bundle/chai';
import './patch-touch-detection.js';
import './items.test.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

describe('touch in use', () => {
  it('should have touch in use', () => {
    expect(isTouch).to.be.true;
  });
});
