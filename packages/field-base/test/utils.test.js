import { expect } from '@esm-bundle/chai';
import { addValueToAttribute, removeValueFromAttribute } from '../src/utils.js';

describe('utils', () => {
  describe('addValueToAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should add a value to an attribute', () => {
      addValueToAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');

      addValueToAttribute(element, 'aria-labelledby', 'error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id error-id');
    });

    it('should not duplicate values in the attribute', () => {
      addValueToAttribute(element, 'aria-labelledby', 'label-id');
      addValueToAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');
    });
  });

  describe('removeValueFromAttribute', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('aria-labelledby', 'label-id error-id');
    });

    it('should remove a value from an attribute', () => {
      removeValueFromAttribute(element, 'aria-labelledby', 'error-id');
      expect(element.getAttribute('aria-labelledby')).to.equal('label-id');

      removeValueFromAttribute(element, 'aria-labelledby', 'label-id');
      expect(element.hasAttribute('aria-labelledby')).to.be.false;
    });
  });
});
