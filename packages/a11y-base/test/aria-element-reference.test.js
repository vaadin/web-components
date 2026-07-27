import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import { addAriaElementReference, removeAriaElementReference } from '../src/aria-element-reference.js';

describe('aria-element-reference', () => {
  let container, target, element;

  beforeEach(() => {
    container = fixtureSync(`
      <div>
        <div id="target"></div>
        <span id="element"></span>
      </div>
    `);
    target = container.querySelector('#target');
    element = container.querySelector('#element');
  });

  describe('addAriaElementReference', () => {
    it('should add the element to ariaDescribedByElements', () => {
      addAriaElementReference(target, 'aria-describedby', element);
      expect(target.ariaDescribedByElements).to.eql([element]);
    });

    it('should add the element to ariaLabelledByElements', () => {
      addAriaElementReference(target, 'aria-labelledby', element);
      expect(target.ariaLabelledByElements).to.eql([element]);
    });

    it('should keep previously added element references', () => {
      const element2 = document.createElement('span');
      container.appendChild(element2);

      addAriaElementReference(target, 'aria-describedby', element);
      addAriaElementReference(target, 'aria-describedby', element2);

      expect(target.ariaDescribedByElements).to.eql([element, element2]);
    });

    it('should not add the same element twice', () => {
      addAriaElementReference(target, 'aria-describedby', element);
      addAriaElementReference(target, 'aria-describedby', element);
      expect(target.ariaDescribedByElements).to.eql([element]);
    });
  });

  describe('removeAriaElementReference', () => {
    it('should remove the element from ariaDescribedByElements', () => {
      const element2 = document.createElement('span');
      container.appendChild(element2);

      addAriaElementReference(target, 'aria-describedby', element);
      addAriaElementReference(target, 'aria-describedby', element2);

      removeAriaElementReference(target, 'aria-describedby', element);

      expect(target.ariaDescribedByElements).to.eql([element2]);
    });

    it('should remove the element from ariaLabelledByElements', () => {
      addAriaElementReference(target, 'aria-labelledby', element);
      removeAriaElementReference(target, 'aria-labelledby', element);
      expect(target.ariaLabelledByElements).to.be.null;
    });

    it('should reset ariaDescribedByElements to null when removing the last element', () => {
      addAriaElementReference(target, 'aria-describedby', element);
      removeAriaElementReference(target, 'aria-describedby', element);

      expect(target.ariaDescribedByElements).to.be.null;
      expect(target.hasAttribute('aria-describedby')).to.be.false;
    });
  });
});
