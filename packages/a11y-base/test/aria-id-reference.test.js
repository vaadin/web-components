import { expect } from '@vaadin/chai-plugins';
import {
  removeAriaIDReference,
  restoreGeneratedAriaIDReference,
  setAriaIDReference,
} from '../src/aria-id-reference.js';

describe('aria-id-reference', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('span');
  });

  const attribute = 'aria-labelledby';

  it(`should not set ${attribute} if setAriaLabelledBy is called with 'null'`, () => {
    setAriaIDReference(element, attribute, { newId: null, oldId: null, fromUser: false });
    expect(element.hasAttribute(attribute)).to.be.false;
  });

  it(`should set ${attribute} to element`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    expect(element.getAttribute(attribute)).to.equal('id-0');
  });

  it(`should replace previous ${attribute} set`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'id-1', oldId: 'id-0', fromUser: false });
    expect(element.getAttribute(attribute)).to.equal('id-1');
  });

  it(`should be possible to append ${attribute} value`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'id-1', oldId: null, fromUser: false });

    expect(element.getAttribute(attribute)).to.contain('id-0');
    expect(element.getAttribute(attribute)).to.contain('id-1');
  });

  it(`should be able to clear ${attribute}`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'id-1', oldId: null, fromUser: false });

    removeAriaIDReference(element, attribute);

    expect(element.hasAttribute(attribute)).to.be.false;
  });

  it(`should be able to replace generated ${attribute} with a custom value`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'custom-id', oldId: null, fromUser: true });

    expect(element.getAttribute(attribute)).to.equal('custom-id');
  });

  it(`should be able to restore generated ${attribute} value after a custom value is set`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'id-1', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'custom-id', oldId: null, fromUser: true });
    setAriaIDReference(element, attribute, { newId: null, oldId: 'custom-id', fromUser: true });

    expect(element.getAttribute(attribute)).to.contain('id-0');
    expect(element.getAttribute(attribute)).to.contain('id-1');
    expect(element.getAttribute(attribute)).to.not.contain('custom-id');
  });

  it(`should be able to change user generated ${attribute}`, () => {
    setAriaIDReference(element, attribute, { newId: 'custom-id-0', oldId: null, fromUser: true });
    setAriaIDReference(element, attribute, { newId: 'custom-id-1', oldId: 'custom-id-0', fromUser: true });

    expect(element.getAttribute(attribute)).to.equal('custom-id-1');
  });

  it(`should be able to clear and restore genereated ${attribute} value`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    removeAriaIDReference(element, attribute);
    restoreGeneratedAriaIDReference(element, attribute);

    expect(element.getAttribute(attribute)).to.equal('id-0');
  });

  it(`should not set ${attribute} when generated ${attribute} is updated`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'custom-id-1', oldId: null, fromUser: true });

    setAriaIDReference(element, attribute, { newId: 'id-1', oldId: 'id-0', fromUser: false });
    expect(element.getAttribute(attribute)).to.equal('custom-id-1');
  });

  it(`should keep ${attribute} value if newId == oldId`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: 'id-0', fromUser: false });

    expect(element.getAttribute(attribute)).to.equal('id-0');
  });

  it(`should restore ${attribute} correctly when user value is the same as the previous one`, () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: true });
    setAriaIDReference(element, attribute, { newId: null, oldId: null, fromUser: true });

    expect(element.getAttribute(attribute)).to.be.equal('id-0');
  });

  it('should restore generated value if removeAriaIDReference is called after custom value had been set', () => {
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });
    setAriaIDReference(element, attribute, { newId: 'custom-id-0', oldId: null, fromUser: true });

    removeAriaIDReference(element, attribute);
    restoreGeneratedAriaIDReference(element, attribute);
    expect(element.getAttribute(attribute)).to.be.equal('id-0');
  });

  it(`should be able to set generated ${attribute} after remove/restore are called`, () => {
    removeAriaIDReference(element, attribute);
    restoreGeneratedAriaIDReference(element, attribute);
    setAriaIDReference(element, attribute, { newId: 'id-0', oldId: null, fromUser: false });

    expect(element.getAttribute(attribute)).to.be.equal('id-0');
  });

  it(`should not add empty ${attribute} if no value was stored`, () => {
    removeAriaIDReference(element, attribute);
    restoreGeneratedAriaIDReference(element, attribute);

    expect(element.getAttribute(attribute)).to.be.null;
  });
});
