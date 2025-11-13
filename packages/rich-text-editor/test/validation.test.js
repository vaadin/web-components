import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-rich-text-editor.js';

describe('validation', () => {
  let rte, validateSpy;

  describe('initial', () => {
    beforeEach(() => {
      rte = document.createElement('vaadin-rich-text-editor');
      validateSpy = sinon.spy(rte, 'validate');
    });

    afterEach(() => {
      rte.remove();
    });

    it('should not validate without value', async () => {
      document.body.appendChild(rte);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    describe('with value', () => {
      beforeEach(() => {
        rte.value = '[{"insert":"Hello World"}]';
      });

      it('should not validate by default', async () => {
        document.body.appendChild(rte);
        await nextRender();
        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('basic', () => {
    let validatedSpy;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      validatedSpy = sinon.spy();
      rte.addEventListener('validated', validatedSpy);
    });

    it('should fire a validated event on validation success', () => {
      rte.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', async () => {
      rte.required = true;
      await nextUpdate(rte);

      rte.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
    });

    it('should fail validation when required and empty', () => {
      rte.required = true;
      expect(rte.checkValidity()).to.be.false;
      expect(rte.validate()).to.be.false;
      expect(rte.invalid).to.be.true;
    });

    it('should pass validation when required and has value', async () => {
      rte.value = '[{"insert":"Hello"}]';
      rte.required = true;
      await nextUpdate(rte);
      expect(rte.checkValidity()).to.be.true;
      expect(rte.validate()).to.be.true;
      expect(rte.invalid).to.be.false;
    });

    it('should pass validation when not required and empty', () => {
      expect(rte.checkValidity()).to.be.true;
      expect(rte.validate()).to.be.true;
      expect(rte.invalid).to.be.false;
    });

    it('should update "invalid" state when "required" is removed', async () => {
      rte.required = true;
      await nextUpdate(rte);
      rte.validate();
      expect(rte.invalid).to.be.true;

      rte.required = false;
      await nextUpdate(rte);
      expect(rte.invalid).to.be.false;
    });

    it('should update "invalid" state when value changes', async () => {
      rte.required = true;
      await nextUpdate(rte);
      rte.validate();
      expect(rte.invalid).to.be.true;

      rte.value = '[{"insert":"Hello"}]';
      await nextUpdate(rte);
      expect(rte.invalid).to.be.false;
    });

    it('should not consider Quill empty content as a value', () => {
      rte.required = true;
      rte.value = '[{"insert":"\\n"}]';
      expect(rte.checkValidity()).to.be.false;
    });

    it('should set required attribute to true when required', () => {
      rte.required = true;
      expect(rte.hasAttribute('required')).to.be.true;
    });

    it('should display required indicator when required', () => {
      rte.required = true;
      expect(rte.hasAttribute('required')).to.be.true;
    });
  });

  describe('checkValidity', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
    });

    it('should return true when valid', () => {
      expect(rte.checkValidity()).to.be.true;
    });

    it('should return true when manually set to invalid but has no constraint violations', () => {
      rte.invalid = true;
      expect(rte.checkValidity()).to.be.true;
    });

    it('should return false when required and empty', () => {
      rte.required = true;
      expect(rte.checkValidity()).to.be.false;
    });

    it('should return true when required and has value', async () => {
      rte.required = true;
      rte.value = '[{"insert":"Test"}]';
      await nextUpdate(rte);
      expect(rte.checkValidity()).to.be.true;
    });
  });

  describe('change event', () => {
    let changeSpy;

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      changeSpy = sinon.spy();
      rte.addEventListener('change', changeSpy);
    });

    it('should validate on change event', async () => {
      rte.required = true;
      await nextUpdate(rte);

      const editor = rte._editor;
      editor.insertText(0, 'Hello');

      rte.dispatchEvent(new Event('change', { bubbles: true }));

      await nextUpdate(rte);
      expect(rte.invalid).to.be.false;
    });
  });
});
