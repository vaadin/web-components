import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, focusin, focusout, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';

describe('custom field', () => {
  let customField;

  beforeEach(async () => {
    customField = fixtureSync(`
      <vaadin-custom-field>
        <input type="text" />
        <input type="number" />
      </vaadin-custom-field>
    `);
    await nextRender();
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

    it('should ignore slotted inputs', async () => {
      customField = fixtureSync(`
        <vaadin-custom-field>
          <div>
            <input type="text" slot="input" />
            <textarea slot="textarea" />
          </div>
        </vaadin-custom-field>
      `);
      await nextRender();
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
        fire(el, 'change');
      });
      expect(customField.value).to.equal('1\t1');
    });

    it('should update input values when set', async () => {
      customField.value = '1\t1';
      await nextUpdate(customField);
      customField.inputs.forEach((el) => {
        expect(el.value).to.equal('1');
      });
    });
  });

  describe('aria-required', () => {
    it('should toggle aria-required attribute on required property change', async () => {
      customField.required = true;
      await nextUpdate(customField);
      expect(customField.getAttribute('aria-required')).to.equal('true');

      customField.required = false;
      await nextUpdate(customField);
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

  describe('custom parser and formatter', () => {
    it('should use custom parser if that exists', async () => {
      customField.parseValue = (value) => {
        return value.split(' ').map((value) => parseInt(value) + 1);
      };

      customField.value = '1 1';
      await nextUpdate(customField);

      customField.inputs.forEach((el) => {
        expect(el.value).to.equal('2');
      });
    });

    it('should use custom formatter if that exists', async () => {
      customField.formatValue = (inputValues) => {
        return inputValues.map((value) => parseInt(value) + 1 || '').join(' ');
      };

      customField.inputs.forEach((el) => {
        el.value = '1';
        fire(el, 'change');
      });

      await nextUpdate(customField);

      expect(customField.value).to.be.equal('2 2');
    });

    describe('incorrect parser', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn if custom parser has not returned array of values', async () => {
        customField.parseValue = () => '';

        customField.value = 'foo';
        await nextUpdate(customField);
        expect(console.warn.callCount).to.equal(1);
      });
    });
  });
});
