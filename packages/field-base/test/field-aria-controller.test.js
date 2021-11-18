import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { FieldAriaController } from '../src/field-aria-controller.js';

customElements.define('field-element', class extends ControllerMixin(PolymerElement) {});

describe('field-aria-controller', () => {
  let element, input, controller;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-element></field-element>`);
      controller = new FieldAriaController(element);
      element.addController(controller);
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

  describe('field', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <field-element>
          <input aria-labelledby="custom-id" aria-describedby="custom-id">
        </field-element>
      `);
      input = element.querySelector('input');
      controller = new FieldAriaController(element);
      element.addController(controller);
    });

    describe('label id', () => {
      beforeEach(() => {
        controller.setLabelId('label-id');
        controller.setTarget(input);
      });

      it('should add label id to aria-labelledby attribute', () => {
        expect(input.getAttribute('aria-labelledby')).equal('custom-id label-id');
      });

      it('should not add label id to aria-describedby attribute', () => {
        expect(input.getAttribute('aria-describedby')).not.to.include('label-id');
      });
    });

    describe('error id', () => {
      beforeEach(() => {
        controller.setErrorId('error-id');
        controller.setTarget(input);
      });

      it('should add error id to aria-describedby attribute', () => {
        expect(input.getAttribute('aria-describedby')).equal('custom-id error-id');
      });

      it('should not add error id to aria-labelledby attribute', () => {
        expect(input.getAttribute('aria-labelledby')).not.to.include('error-id');
      });
    });

    describe('helper id', () => {
      beforeEach(() => {
        controller.setHelperId('helper-id');
        controller.setTarget(input);
      });

      it('should add helper id to aria-describedby attribute', () => {
        expect(input.getAttribute('aria-describedby')).equal('custom-id helper-id');
      });

      it('should not add helper id to aria-labelledby attribute', () => {
        expect(input.getAttribute('aria-labelledby')).not.to.include('helper-id');
      });
    });

    describe('aria-required', () => {
      it('should not add aria-required attribute', () => {
        controller.setRequired(true);
        controller.setTarget(input);
        expect(element.hasAttribute('aria-required')).to.be.false;
      });
    });

    describe('target is set initially', () => {
      beforeEach(() => {
        controller.setTarget(input);
      });

      it('should set label id to aria-labelledby attribute', () => {
        controller.setLabelId('label-id');
        expect(input.getAttribute('aria-labelledby')).equal('custom-id label-id');
        controller.setLabelId(null);
        expect(input.getAttribute('aria-labelledby')).equal('custom-id');
      });

      it('should set error id to aria-describedby attribute', () => {
        controller.setErrorId('error-id');
        expect(input.getAttribute('aria-describedby')).equal('custom-id error-id');
        controller.setErrorId(null);
        expect(input.getAttribute('aria-describedby')).equal('custom-id');
      });

      it('should set helper id to aria-describedby attribute', () => {
        controller.setHelperId('helper-id');
        expect(input.getAttribute('aria-describedby')).equal('custom-id helper-id');
        controller.setHelperId(null);
        expect(input.getAttribute('aria-describedby')).equal('custom-id');
      });
    });
  });

  describe('field group', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <field-element aria-labelledby="custom-id" aria-describedby="custom-id"></field-element>
      `);
      controller = new FieldAriaController(element);
      element.addController(controller);
    });

    describe('label id', () => {
      beforeEach(() => {
        controller.setLabelId('label-id');
        controller.setTarget(element);
      });

      it('should add label id to aria-labelledby attribute', () => {
        expect(element.getAttribute('aria-labelledby')).equal('custom-id label-id');
      });

      it('should not add label id to aria-describedby attribute', () => {
        expect(element.getAttribute('aria-describedby')).not.to.include('label-id');
      });
    });

    describe('error id', () => {
      beforeEach(() => {
        controller.setErrorId('error-id');
        controller.setTarget(element);
      });

      it('should add error id to aria-labelledby attribute', () => {
        expect(element.getAttribute('aria-labelledby')).equal('custom-id error-id');
      });

      it('should not add error id to aria-describedby attribute', () => {
        expect(element.getAttribute('aria-describedby')).not.to.include('error-id');
      });
    });

    describe('helper id', () => {
      beforeEach(() => {
        controller.setHelperId('helper-id');
        controller.setTarget(element);
      });

      it('should add helper id to aria-labelledby attribute', () => {
        expect(element.getAttribute('aria-labelledby')).equal('custom-id helper-id');
      });

      it('should not add helper id to aria-describedby attribute', () => {
        expect(element.getAttribute('aria-describedby')).not.to.include('helper-id');
      });
    });

    describe('aria-required', () => {
      it('should add aria-required attribute', () => {
        controller.setRequired(true);
        controller.setTarget(element);
        expect(element.getAttribute('aria-required')).to.equal('true');
      });
    });

    describe('target is set initially', () => {
      beforeEach(() => {
        controller.setTarget(element);
      });

      it('should set label id to aria-labelledby attribute', () => {
        controller.setLabelId('label-id');
        expect(element.getAttribute('aria-labelledby')).equal('custom-id label-id');
        controller.setLabelId(null);
        expect(element.getAttribute('aria-labelledby')).equal('custom-id');
      });

      it('should set error id to aria-labelledby attribute', () => {
        controller.setErrorId('error-id');
        expect(element.getAttribute('aria-labelledby')).equal('custom-id error-id');
        controller.setErrorId(null);
        expect(element.getAttribute('aria-labelledby')).equal('custom-id');
      });

      it('should set helper id to aria-labelledby attribute', () => {
        controller.setHelperId('helper-id');
        expect(element.getAttribute('aria-labelledby')).equal('custom-id helper-id');
        controller.setHelperId(null);
        expect(element.getAttribute('aria-labelledby')).equal('custom-id');
      });

      it('should toggle aria-required attribute', () => {
        controller.setRequired(true);
        expect(element.getAttribute('aria-required')).to.equal('true');
        controller.setRequired(false);
        expect(element.hasAttribute('aria-required')).to.be.false;
      });
    });
  });
});
