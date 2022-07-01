import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusin, focusout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-custom-field.js';
import { dispatchChange } from './common.js';

describe('custom field', () => {
  let customField;

  beforeEach(() => {
    customField = fixtureSync(`
      <vaadin-custom-field>
        <input type="text" />
        <input type="number" />
      </vaadin-custom-field>
    `);
  });

  describe('inputs', () => {
    it('should make inputs property read-only', () => {
      expect(customField.inputs.length).to.be.above(0);
      customField.inputs = [];
      expect(customField.inputs.length).to.be.above(0);
    });

    it('should properly define internal inputs', () => {
      expect(customField.inputs.length).to.equal(2);
      for (let i = 0; i < 2; i++) {
        expect(customField.inputs[i].localName).to.be.equal('input');
      }
    });

    it('should focus the first input on focus()', () => {
      customField.focus();
      expect(document.activeElement).to.equal(customField.inputs[0]);
    });

    it('should ignore slotted inputs', () => {
      customField = fixtureSync(`
        <vaadin-custom-field>
          <div>
            <input type="text" slot="input" />
            <textarea slot="textarea" />
          </div>
        </vaadin-custom-field>
      `);
      expect(customField.inputs).to.be.empty;
    });
  });

  describe('value', () => {
    it('should contain Tab character', () => {
      expect(customField.value).to.equal('\t');
    });

    it('should update value on change event', () => {
      customField.inputs.forEach((el) => {
        el.value = '1';
        dispatchChange(el);
      });
      expect(customField.value).to.equal('1\t1');
    });

    it('should update input values when set', () => {
      customField.value = '1\t1';
      customField.inputs.forEach((el) => {
        expect(el.value).to.equal('1');
      });
    });
  });

  describe('aria-required', () => {
    it('should toggle aria-required attribute on required property change', () => {
      customField.required = true;
      expect(customField.getAttribute('aria-required')).to.equal('true');
      customField.required = false;
      expect(customField.hasAttribute('aria-required')).to.be.false;
    });
  });

  describe('focused', () => {
    it('should set focused attribute on input focusin', () => {
      focusin(customField.inputs[0]);
      expect(customField.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on input focusout', () => {
      focusin(customField.inputs[0]);
      focusout(customField.inputs[0]);
      expect(customField.hasAttribute('focused')).to.be.false;
    });

    it('should not remove focused attribute when moving ot other input', () => {
      focusin(customField.inputs[0]);
      focusout(customField.inputs[0], customField.inputs[1]);
      expect(customField.hasAttribute('focused')).to.be.true;
    });
  });

  describe('required', () => {
    beforeEach(() => {
      customField.required = true;
    });

    it('should set invalid to false by default', () => {
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid on validate call when empty', () => {
      expect(customField.invalid).to.be.false;
      customField.validate();
      expect(customField.invalid).to.be.true;
    });

    it('should become valid after receiving a non-empty value from "change" event', () => {
      customField.inputs[0].value = 'foo';
      dispatchChange(customField.inputs[0]);
      expect(customField.invalid).to.be.false;
    });

    it('should become invalid after receiving an empty value from "change" event', () => {
      customField.value = 'foo';
      customField.inputs[0].value = '';
      dispatchChange(customField.inputs[0]);
      expect(customField.invalid).to.be.true;
    });
  });

  describe('validation', () => {
    it('should check validity on validate', () => {
      const spy = sinon.spy(customField, 'checkValidity');
      customField.validate();
      expect(spy.called).to.be.true;
    });

    it('should run validation on input change', () => {
      const spy = sinon.spy(customField, 'checkValidity');
      customField.inputs[0].value = 'foo';
      dispatchChange(customField.inputs[0]);
      expect(spy.called).to.be.true;
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      customField.addEventListener('validated', validatedSpy);
      customField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      customField.addEventListener('validated', validatedSpy);
      customField.required = true;
      customField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('custom parser and formatter', () => {
    it('should use custom parser if that exists', () => {
      customField.set(
        'i18n.parseValue',
        sinon.stub().callsFake((value) => {
          return value.split(' ').map((value) => parseInt(value) + 1);
        }),
      );

      customField.value = '1 1';

      customField.inputs.forEach((el) => {
        expect(el.value).to.equal('2');
      });
    });

    it('should use custom formatter if that exists', () => {
      customField.set(
        'i18n.formatValue',
        sinon.stub().callsFake((inputValues) => {
          return inputValues.map((value) => parseInt(value) + 1 || '').join(' ');
        }),
      );

      customField.inputs.forEach((el) => {
        el.value = '1';
        dispatchChange(el);
      });

      expect(customField.value).to.be.equal('2 2');
    });

    describe('incorrect parser', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn if custom parser has not returned array of values', () => {
        customField.set('i18n.parseValue', () => '');

        customField.value = 'foo';
        expect(console.warn.callCount).to.equal(1);
      });
    });
  });
});
