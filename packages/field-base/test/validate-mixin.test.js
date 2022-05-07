import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { ValidateMixin } from '../src/validate-mixin.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass]('validate-mixin', '<input>', (Base) => class extends ValidateMixin(Base) {});

  let element;

  describe('properties', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
    });

    it('should reflect required property to attribute', async () => {
      expect(element.hasAttribute('required')).to.be.false;

      element.required = true;
      await nextFrame();
      expect(element.hasAttribute('required')).to.be.true;
    });

    it('should reflect invalid property to attribute', async () => {
      expect(element.hasAttribute('invalid')).to.be.false;

      element.invalid = true;
      await nextFrame();
      expect(element.hasAttribute('invalid')).to.be.true;
    });
  });

  describe('checkValidity', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></$${tag}>`);
      await nextRender();
    });

    it('should return true when element is not required', () => {
      expect(element.checkValidity()).to.be.true;
    });

    it('should return false when element is required and value is not set', () => {
      element.required = true;
      expect(element.checkValidity()).to.be.false;
    });

    it('should return true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      expect(element.checkValidity()).to.be.true;
    });
  });

  describe('validate', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
    });

    it('should return true when element is not required', () => {
      expect(element.validate()).to.be.true;
    });

    it('should return false when element is required and value is not set', () => {
      element.required = true;
      expect(element.validate()).to.be.false;
    });

    it('should return true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      expect(element.validate()).to.be.true;
    });

    it('should not set invalid to true when element is not required', () => {
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should set invalid when element is required and value is not set', () => {
      element.required = true;
      element.validate();
      expect(element.invalid).to.be.true;
    });

    it('should not set invalid to true when element is required and value is set', () => {
      element.required = true;
      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.false;
    });

    it('should set invalid back to false after value is set on the element', () => {
      element.required = true;
      element.validate();

      element.value = 'value';
      element.validate();
      expect(element.invalid).to.be.false;
    });
  });
};

describe('ValidateMixin + Polymer', () => {
  runTests('polymer');
});

describe('ValidateMixin + Lit', () => {
  runTests('lit');
});
