import { expect } from '@esm-bundle/chai';
import { removeAriaLabelledBy, restoreGeneratedAriaLabellledBy, setAriaLabelledBy } from '../src/aria-id-reference.js';

describe('aria-id-reference', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('span');
  });

  it('should set aria-labellebdy to element', () => {
    setAriaLabelledBy(element, 'aria-labelledby', null, false);
    expect(element.getAttribute('aria-labelledby')).to.equal('aria-labelledby');
  });

  it('should replace previous aria-labelledby set', () => {
    setAriaLabelledBy(element, 'aria-labelledby', null, false);
    setAriaLabelledBy(element, 'new-aria-labelledby', 'aria-labelledby', false);

    expect(element.getAttribute('aria-labelledby')).to.equal('new-aria-labelledby');
  });

  it('should be possible to append aria-labelledby value', () => {
    setAriaLabelledBy(element, 'id-0', null, false);
    setAriaLabelledBy(element, 'id-1', null, false);

    expect(element.getAttribute('aria-labelledby')).to.contain('id-0');
    expect(element.getAttribute('aria-labelledby')).to.contain('id-1');
  });

  it('should be able to clear aria-labelledby', () => {
    setAriaLabelledBy(element, 'id-0', null, false);
    setAriaLabelledBy(element, 'id-1', null, false);

    removeAriaLabelledBy(element);

    expect(element.hasAttribute('aria-labelledby')).to.be.false;
  });

  it('should be able to replace generated aria-labelledby with a custom value', () => {
    setAriaLabelledBy(element, 'id-0', null, false);
    setAriaLabelledBy(element, 'custom-id', null, true);

    expect(element.getAttribute('aria-labelledby')).to.equal('custom-id');
  });

  it('should be able to restore generated aria-labelledby value after a custom value is set', () => {
    setAriaLabelledBy(element, 'id-0', null, false);
    setAriaLabelledBy(element, 'id-1', null, false);
    setAriaLabelledBy(element, 'custom-id', null, true);
    setAriaLabelledBy(element, null, 'custom-id', true);

    expect(element.getAttribute('aria-labelledby')).to.contain('id-0');
    expect(element.getAttribute('aria-labelledby')).to.contain('id-1');
    expect(element.getAttribute('aria-labelledby')).to.not.contain('custom-id');
  });

  it('should be able to change user generated aria-labelledby', () => {
    setAriaLabelledBy(element, 'custom-id-0', null, true);
    setAriaLabelledBy(element, 'custom-id-1', 'custom-id-0', true);

    expect(element.getAttribute('aria-labelledby')).to.equal('custom-id-1');
  });

  it('should be able to clear and restore genereated aria-labelledby value', () => {
    setAriaLabelledBy(element, 'id-0', null, false);
    removeAriaLabelledBy(element);
    restoreGeneratedAriaLabellledBy(element);

    expect(element.getAttribute('aria-labelledby')).to.equal('id-0');
  });

  it('should not set aria-labelledby when label is updated', () => {
    setAriaLabelledBy(element, 'id-0', null, false);
    setAriaLabelledBy(element, 'custom-id-1', null, true);

    setAriaLabelledBy(element, 'id-1', 'id-0', false);
    expect(element.getAttribute('aria-labelledby')).to.equal('custom-id-1');
  });

  // it('should not set aria-labelledby when label is updated', () => {
  //   setAriaLabelledBy(element, 'id-0', null, false);
  //   setAriaLabelledBy(element, 'custom-id-1', null, true);

  //   setAriaLabelledBy(element, 'id-1', 'id-0', false);
  //   expect(element.getAttribute('aria-labelledby')).to.equal('custom-id-1');
  // });
});
