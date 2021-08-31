import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { FieldAriaMixin } from '../src/field-aria-mixin.js';
import { LabelMixin } from '../src/label-mixin.js';
import { InputSlotMixin } from '../src/input-slot-mixin.js';

customElements.define(
  'field-aria-mixin-element',
  class extends FieldAriaMixin(LabelMixin(InputSlotMixin(PolymerElement))) {
    static get template() {
      return html`
        <slot name="label"></slot>
        <slot name="input"></slot>
        <slot name="error-message"></slot>
        <slot name="helper"></slot>
      `;
    }

    get _ariaTarget() {
      return this.inputElement;
    }
  }
);

customElements.define(
  'field-aria-mixin-group-element',
  class extends FieldAriaMixin(LabelMixin(PolymerElement)) {
    static get template() {
      return html`
        <slot name="label"></slot>
        <slot name="error-message"></slot>
        <slot name="helper"></slot>
      `;
    }

    get _ariaAttr() {
      return 'aria-labelledby';
    }
  }
);

describe('field-aria-mixin', () => {
  let element, label, error, helper, input;

  describe('aria-describedby', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-aria-mixin-element></field-aria-mixin-element>`);
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      helper = element.querySelector('[slot=helper]');
      input = element.querySelector('[slot=input]');
    });

    it('should only add helper text to aria-describedby when field is valid', () => {
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
      expect(aria).to.not.include(label.id);
    });

    it('should add error message to aria-describedby when field is invalid', () => {
      element.invalid = true;
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
      expect(aria).to.not.include(label.id);
    });
  });

  describe('aria-labelledby', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-aria-mixin-group-element></field-aria-mixin-group-element>`);
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      helper = element.querySelector('[slot=helper]');
    });

    it('should add label and helper text to aria-labelledby when field is valid', () => {
      const aria = element.getAttribute('aria-labelledby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
      expect(aria).to.include(label.id);
    });

    it('should add error message to aria-labelledby when field is invalid', () => {
      element.invalid = true;
      const aria = element.getAttribute('aria-labelledby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
      expect(aria).to.include(label.id);
    });
  });

  describe('custom helper', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-aria-mixin-element></field-aria-mixin-element>`);
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      input = element.querySelector('[slot=input]');
    });

    it('should handle custom id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      element.appendChild(helper);
      await nextFrame();
      expect(input.getAttribute('aria-describedby')).to.include('helper-component');
    });

    it('should handle restored id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      element.appendChild(helper);
      await nextFrame();
      helper.removeAttribute('id');
      expect(input.getAttribute('aria-describedby')).to.include(helper.id);
    });
  });
});
