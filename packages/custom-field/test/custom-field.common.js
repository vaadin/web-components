import { expect } from '@vaadin/chai-plugins';
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

    it('should set has-value when updating values', async () => {
      customField.inputs.forEach((el) => {
        el.value = '1';
        fire(el, 'change');
      });
      await nextUpdate(customField);
      expect(customField.hasAttribute('has-value')).to.be.true;
    });

    it('should clear input values when set to null', async () => {
      customField.value = '1\t1';
      await nextUpdate(customField);

      customField.value = null;
      await nextUpdate(customField);
      customField.inputs.forEach((el) => {
        expect(el.value).to.equal('');
      });
    });
  });

  describe('value set with attribute', () => {
    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field value="01\t25">
          <input type="number" />
          <input type="number" />
        </vaadin-custom-field>
      `);
      await nextRender();
    });

    it('should not reset value set using attribute', () => {
      expect(customField.value).to.equal('01\t25');
    });

    it('should apply value set using attribute to inputs', () => {
      expect(customField.inputs[0].value).to.equal('01');
      expect(customField.inputs[1].value).to.equal('25');
    });
  });

  describe('value on input node changes', () => {
    beforeEach(async () => {
      customField = fixtureSync(`
        <vaadin-custom-field value="01">
          <input type="number" />
        </vaadin-custom-field>
      `);
      await nextRender();
    });

    it('should remove value when an input node is removed after updating value via input', async () => {
      customField.inputs[0].value = '02';
      fire(customField.inputs[0], 'change');
      await nextUpdate(customField);
      expect(customField.value).to.equal('02');

      customField.removeChild(customField.inputs[0]);
      await nextUpdate(customField);
      expect(customField.value).to.equal('');
    });

    it('should not remove value when an input node is removed after updating value using attribute', async () => {
      customField.inputs[0].value = '02';
      fire(customField.inputs[0], 'change');
      await nextUpdate(customField);
      expect(customField.value).to.equal('02');

      customField.value = '01';
      await nextUpdate(customField);
      expect(customField.value).to.equal('01');

      customField.removeChild(customField.inputs[0]);
      await nextUpdate(customField);
      expect(customField.value).to.equal('01');
    });

    it('should not remove value set using attribute when an input node is removed', async () => {
      customField.removeChild(customField.inputs[0]);
      await nextUpdate(customField);
      expect(customField.value).to.equal('01');
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
