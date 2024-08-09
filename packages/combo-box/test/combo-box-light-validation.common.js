import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

describe('vaadin-combo-box-light - validation', () => {
  let comboBox, input;

  describe('basic', () => {
    let validateSpy, changeSpy;

    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box-light>
          <input class="input" />
        </vaadin-combo-box-light>
      `);
      comboBox.items = ['foo', 'bar', 'baz'];
      await nextRender();
      input = comboBox.inputElement;
      validateSpy = sinon.spy(comboBox, 'validate');
      changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);
    });

    it('should pass validation by default', () => {
      expect(comboBox.checkValidity()).to.be.true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });

    it('should validate on blur', () => {
      input.focus();
      input.blur();
      expect(validateSpy.calledOnce).to.be.true;
    });

    it('should validate before change event on blur', async () => {
      input.focus();
      await sendKeys({ type: 'foo' });
      input.blur();
      expect(changeSpy.calledOnce).to.be.true;
      expect(validateSpy.calledOnce).to.be.true;
      expect(validateSpy.calledBefore(changeSpy)).to.be.true;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        input.focus();
        input.blur();
        expect(validateSpy.called).to.be.false;
      });
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      comboBox = fixtureSync(`
        <vaadin-combo-box-light>
          <input class="input" />
        </vaadin-combo-box-light>
      `);
      comboBox.items = ['foo', 'bar', 'baz'];
      comboBox.required = true;
      await nextRender();
    });

    it('should fail validation without value', () => {
      expect(comboBox.checkValidity()).to.be.false;
      expect(comboBox.validate()).to.be.false;
      expect(comboBox.invalid).to.be.true;
    });

    it('should pass validation with a value', () => {
      comboBox.value = 'foo';
      expect(comboBox.checkValidity()).to.be.true;
      expect(comboBox.validate()).to.be.true;
      expect(comboBox.invalid).to.be.false;
    });
  });
});
