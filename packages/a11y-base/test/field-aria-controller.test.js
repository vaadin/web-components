import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FieldAriaController } from '../src/field-aria-controller.js';

describe('FieldAriaController', () => {
  const tag = defineLit('field-aria', '<slot></slot>', (Base) => class extends PolylitMixin(Base) {});

  let element, input, controller;

  describe('default', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      controller = new FieldAriaController(element);
      element.addController(controller);
    });

    it('should not set aria-label attribute initially', () => {
      expect(element.hasAttribute('aria-label')).to.be.false;
    });

    it('should not set aria-labelledby attribute initially', () => {
      expect(element.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should not set aria-describedby attribute initially', () => {
      expect(element.hasAttribute('aria-describedby')).to.be.false;
    });

    it('should not set aria-required attribute initially', () => {
      expect(element.hasAttribute('aria-required')).to.be.false;
    });
  });

  describe('aria-label', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}><input></${tag}>`);
      await nextRender();
      input = element.querySelector('input');
      controller = new FieldAriaController(element);
      element.addController(controller);
    });

    it('should set aria-label attribute when label is set before target', () => {
      controller.setLabel('Label');
      controller.setTarget(input);
      expect(input.getAttribute('aria-label')).to.equal('Label');
    });

    it('should set aria-label attribute when label is set after target', () => {
      controller.setTarget(input);
      controller.setLabel('Label');
      expect(input.getAttribute('aria-label')).to.equal('Label');
      controller.setLabel(null);
      expect(input.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('id references', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag}>
          <input aria-labelledby="custom-id" aria-describedby="custom-id">
        </${tag}>
      `);
      await nextRender();
      input = element.querySelector('input');
      controller = new FieldAriaController(element);
      element.addController(controller);
    });

    describe('set before target', () => {
      it('should add label ids to aria-labelledby attribute', () => {
        controller.setLabelledBy('label-id-0 label-id-1');
        controller.setTarget(input);
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id label-id-0 label-id-1');
      });

      it('should add error id to aria-describedby attribute', () => {
        controller.setErrorId('error-id');
        controller.setTarget(input);
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id error-id');
      });

      it('should add helper id to aria-describedby attribute', () => {
        controller.setHelperId('helper-id');
        controller.setTarget(input);
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id helper-id');
      });

      it('should add description ids to aria-describedby attribute', () => {
        controller.setDescribedBy('description-id-0 description-id-1');
        controller.setTarget(input);
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id description-id-0 description-id-1');
      });
    });

    describe('set after target', () => {
      beforeEach(() => {
        controller.setTarget(input);
      });

      it('should set label ids to aria-labelledby attribute', () => {
        controller.setLabelledBy('label-id-0 label-id-1');
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id label-id-0 label-id-1');
        controller.setLabelledBy(null);
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id');
      });

      it('should set error id to aria-describedby attribute', () => {
        controller.setErrorId('error-id');
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id error-id');
        controller.setErrorId(null);
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id');
      });

      it('should set helper id to aria-describedby attribute', () => {
        controller.setHelperId('helper-id');
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id helper-id');
        controller.setHelperId(null);
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id');
      });

      it('should set description ids to aria-describedby attribute', () => {
        controller.setDescribedBy('description-id-0 description-id-1');
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id description-id-0 description-id-1');
        controller.setDescribedBy(null);
        expect(input.getAttribute('aria-describedby')).to.equal('custom-id');
      });
    });
  });

  describe('aria-required', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}><input></${tag}>`);
      await nextRender();
      input = element.querySelector('input');
      controller = new FieldAriaController(element);
      element.addController(controller);
    });

    describe('set before target', () => {
      it('should not set aria-required attribute on a native input target', () => {
        controller.setRequired(true);
        controller.setTarget(input);
        expect(input.hasAttribute('aria-required')).to.be.false;
      });

      it('should set aria-required attribute on a field group target', () => {
        controller.setRequired(true);
        controller.setTarget(element);
        expect(element.getAttribute('aria-required')).to.equal('true');
      });
    });

    describe('set after target', () => {
      it('should not set aria-required attribute on a native input target', () => {
        controller.setTarget(input);
        controller.setRequired(true);
        expect(input.hasAttribute('aria-required')).to.be.false;
      });

      it('should toggle aria-required attribute on a field group target', () => {
        controller.setTarget(element);
        controller.setRequired(true);
        expect(element.getAttribute('aria-required')).to.equal('true');
        controller.setRequired(false);
        expect(element.hasAttribute('aria-required')).to.be.false;
      });
    });
  });
});
