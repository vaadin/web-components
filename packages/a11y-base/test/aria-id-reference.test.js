import { expect } from '@esm-bundle/chai';
import {
  removeAriaDescribedBy,
  removeAriaLabelledBy,
  restoreGeneratedAriaDescribedBy,
  restoreGeneratedAriaLabelledBy,
  setAriaDescribedBy,
  setAriaLabelledBy,
} from '../src/aria-id-reference.js';

describe('aria-id-reference', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('span');
  });

  function runTestsForAttribute(attribute) {
    describe(attribute, () => {
      const setAriaIDReference = attribute === 'aria-labelledby' ? setAriaLabelledBy : setAriaDescribedBy;
      const removeAriaIdReference = attribute === 'aria-labelledby' ? removeAriaLabelledBy : removeAriaDescribedBy;
      const restoreGeneratedAriaIdReference =
        attribute === 'aria-labelledby' ? restoreGeneratedAriaLabelledBy : restoreGeneratedAriaDescribedBy;

      it(`should not set ${attribute} if setAriaLabelledBy is called with 'null'`, () => {
        setAriaIDReference(element, null, null, false);
        expect(element.hasAttribute(attribute)).to.be.false;
      });

      it(`should set ${attribute} to element`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        expect(element.getAttribute(attribute)).to.equal('id-0');
      });

      it(`should replace previous ${attribute} set`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'id-1', 'id-0', false);
        expect(element.getAttribute(attribute)).to.equal('id-1');
      });

      it(`should be possible to append ${attribute} value`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'id-1', null, false);

        expect(element.getAttribute(attribute)).to.contain('id-0');
        expect(element.getAttribute(attribute)).to.contain('id-1');
      });

      it(`should be able to clear ${attribute}`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'id-1', null, false);

        removeAriaIdReference(element);

        expect(element.hasAttribute(attribute)).to.be.false;
      });

      it(`should be able to replace generated ${attribute} with a custom value`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'custom-id', null, true);

        expect(element.getAttribute(attribute)).to.equal('custom-id');
      });

      it(`should be able to restore generated ${attribute} value after a custom value is set`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'id-1', null, false);
        setAriaIDReference(element, 'custom-id', null, true);
        setAriaIDReference(element, null, 'custom-id', true);

        expect(element.getAttribute(attribute)).to.contain('id-0');
        expect(element.getAttribute(attribute)).to.contain('id-1');
        expect(element.getAttribute(attribute)).to.not.contain('custom-id');
      });

      it(`should be able to change user generated ${attribute}`, () => {
        setAriaIDReference(element, 'custom-id-0', null, true);
        setAriaIDReference(element, 'custom-id-1', 'custom-id-0', true);

        expect(element.getAttribute(attribute)).to.equal('custom-id-1');
      });

      it(`should be able to clear and restore genereated ${attribute} value`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        removeAriaIdReference(element);
        restoreGeneratedAriaIdReference(element);

        expect(element.getAttribute(attribute)).to.equal('id-0');
      });

      it(`should not set ${attribute} when generated ${attribute} is updated`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'custom-id-1', null, true);

        setAriaIDReference(element, 'id-1', 'id-0', false);
        expect(element.getAttribute(attribute)).to.equal('custom-id-1');
      });

      it(`should keep ${attribute} value if newId == oldId`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'id-0', 'id-0', false);

        expect(element.getAttribute(attribute)).to.equal('id-0');
      });

      it(`should restore ${attribute} correctly when user value is the same as the previous one`, () => {
        setAriaIDReference(element, 'id-0', null, false);
        setAriaIDReference(element, 'id-0', null, true);
        setAriaIDReference(element, null, null, true);

        expect(element.getAttribute(attribute)).to.be.equal('id-0');
      });
    });
  }

  runTestsForAttribute('aria-describedby');
  runTestsForAttribute('aria-labelledby');
});
