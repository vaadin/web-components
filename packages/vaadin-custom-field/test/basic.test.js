import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, html } from '@open-wc/testing-helpers';
import { dispatchChange } from './common.js';
import '../vaadin-custom-field.js';

describe('custom field', () => {
  let customField;

  beforeEach(() => {
    customField = fixtureSync(html`
      <vaadin-custom-field>
        <input type="text" />
        <input type="number" />
      </vaadin-custom-field>
    `);
  });

  describe('inputs property', () => {
    it('should be readOnly', () => {
      expect(customField.inputs.length).to.be.above(0);
      customField.inputs = [];
      expect(customField.inputs.length).to.be.above(0);
    });

    it('should properly define internal inputs', () => {
      expect(customField.inputs.length).to.equal(2);
      for (var i = 0; i < 2; i++) {
        expect(customField.inputs[i].localName).to.be.equal('input');
      }
    });

    it('should focus the first input on `focus()`', () => {
      const spy = sinon.spy(customField.inputs[0], 'focus');
      customField.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('value property', () => {
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

  describe('label', () => {
    let labelElement;

    beforeEach(() => {
      labelElement = customField.shadowRoot.querySelector('[part=label]');
    });

    it('should be empty by default', () => {
      expect(customField.label).to.equal('');
    });

    it('should be displayed when assigned', () => {
      customField.label = 'Foo';
      expect(labelElement.textContent).to.equal('Foo');
    });

    it('should update aria-describedby attribute on host element when displayed', () => {
      customField.label = 'Foo';
      expect(customField.getAttribute('aria-labelledby')).to.be.equal(labelElement.id);
    });

    it('should set has-label attribute on host element when displayed', () => {
      customField.label = 'Foo';
      expect(customField.hasAttribute('has-label')).to.be.true;
    });

    it('should have unique label id', () => {
      expect(labelElement.id.match(/vaadin-custom-field-label-[0-9]*/).length).to.equal(1);
    });
  });

  describe('focused', () => {
    it('should set focused attribute on input focusin', () => {
      customField.inputs[0].dispatchEvent(new CustomEvent('focusin', { composed: true, bubbles: true }));
      expect(customField.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on input focusout', () => {
      customField.inputs[0].dispatchEvent(new CustomEvent('focusin', { composed: true, bubbles: true }));
      customField.inputs[0].dispatchEvent(new CustomEvent('focusout', { composed: true, bubbles: true }));
      expect(customField.hasAttribute('focused')).to.be.false;
    });
  });

  describe('errorMessage', () => {
    it('setting errorMessage updates has-error-message attribute', () => {
      customField.errorMessage = 'foo';
      expect(customField.hasAttribute('has-error-message')).to.be.true;
    });

    it('setting errorMessage to empty string does not update has-error-message attribute', () => {
      customField.errorMessage = '';
      expect(customField.hasAttribute('has-error-message')).to.be.false;
    });

    it('setting errorMessage to null does not update has-error-message attribute', () => {
      customField.errorMessage = null;
      expect(customField.hasAttribute('has-error-message')).to.be.false;
    });
  });

  describe('aria-describedby', () => {
    it('when helperText is set', () => {
      customField.helperText = 'helper text';
      expect(customField.getAttribute('aria-describedby')).to.include(customField.__helperTextId);
    });

    it('when errorMessage is set and field is invalid', () => {
      customField.errorMessage = 'error message';
      customField.invalid = true;
      expect(customField.getAttribute('aria-describedby')).to.include(customField.__errorId);
    });

    it('when helperText and errorMessage are set and field is invalid', () => {
      customField.helperText = 'helper text';
      customField.errorMessage = 'error message';
      customField.invalid = true;
      expect(customField.getAttribute('aria-describedby')).to.include(customField.__helperTextId);
      expect(customField.getAttribute('aria-describedby')).to.include(customField.__errorId);
    });

    it('when helperText and errorMessage are set but field is not invalid', () => {
      customField.helperText = 'helper text';
      customField.errorMessage = 'error message';
      expect(customField.getAttribute('aria-describedby')).to.include(customField.__helperTextId);
      expect(customField.getAttribute('aria-describedby')).to.not.include(customField.__errorId);
    });
  });
});
