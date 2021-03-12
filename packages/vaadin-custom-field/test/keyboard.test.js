import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, aTimeout } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../vaadin-custom-field.js';

class XWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-custom-field id="field">
        <slot name="input-1">
          <input type="text" />
        </slot>
        <slot name="input-2">
          <input type="text" />
        </slot>
        <slot name="input-3">
          <input type="text" />
        </slot>
      </vaadin-custom-field>
    `;
  }
}

customElements.define('x-wrapper', XWrapper);

describe('keyboard navigation', () => {
  let customField;

  function tab(target) {
    keyDownOn(target, 9, [], 'Tab');
  }

  function shiftTab(target) {
    keyDownOn(target, 9, 'shift', 'Tab');
  }

  describe('default', () => {
    beforeEach(() => {
      customField = fixtureSync(`
        <vaadin-custom-field>
          <input type="text">
          <input type="text">
          <input type="number">
          <input type="number">
        </vaadin-custom-field>
      `);
    });

    describe('internal-tab event', () => {
      let spy;

      beforeEach(() => {
        spy = sinon.spy();
        customField.addEventListener('internal-tab', spy);
      });

      it('should fire on Tab', () => {
        for (let i = 0; i < 3; i++) {
          tab(customField.inputs[i]);
        }
        expect(spy.callCount).to.equal(3);
      });

      it('should not fire on Tab from the last input', () => {
        tab(customField.inputs[3]);
        expect(spy.called).to.be.false;
      });

      it('should fire on Shift Tab', () => {
        for (let i = 3; i > 0; i--) {
          shiftTab(customField.inputs[i]);
        }
        expect(spy.callCount).to.equal(3);
      });

      it('should not fire on Shift Tab from the first input', () => {
        shiftTab(customField.inputs[0]);
        expect(spy.called).to.be.false;
      });
    });

    describe('value change', () => {
      it('should update the value on Tab from the last input', () => {
        customField.inputs[3].value = 1;
        tab(customField.inputs[3]);
        expect(customField.value).to.equal('\t\t\t1');
      });

      it('should update the value on Shift Tab from the first input', () => {
        customField.inputs[0].value = 1;
        shiftTab(customField.inputs[0]);
        expect(customField.value).to.equal('1\t\t\t');
      });
    });

    describe('wrapping slots', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = fixtureSync(`<x-wrapper></x-wrapper>`);
        customField = wrapper.$.field;
      });

      const isChrome = window.chrome || /HeadlessChrome/.test(window.navigator.userAgent);
      // Skip this test on any platform apart from Chrome
      (isChrome ? it : it.skip)('should properly set tabindex on Shift Tab for wrapping slots', async () => {
        for (let i = 2; i > -1; i--) {
          const input = customField.inputs[i];
          expect(input.parentElement.hasAttribute('tabindex')).to.be.false;
          shiftTab(input);
          expect(input.parentElement.getAttribute('tabindex')).to.equal('-1');
        }

        await aTimeout();
        expect(customField.inputs.filter((input) => input.hasAttribute('tabindex')).length).to.equal(0);
      });
    });
  });
});
