import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CheckedMixin } from '../src/checked-mixin.js';
import { DelegateFocusMixin } from '../src/delegate-focus-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'checked-mixin-polymer-element',
  class extends CheckedMixin(DelegateFocusMixin(ControllerMixin(PolymerElement))) {
    static get template() {
      return legacyHtml`
        <div>
          <slot></slot>
          <slot name="input"></slot>
        </div>
      `;
    }

    constructor() {
      super();
      this._setType('checkbox');
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
        })
      );
    }
  }
);

customElements.define(
  'checked-mixin-lit-element',
  class extends CheckedMixin(DelegateFocusMixin(PolylitMixin(LitElement))) {
    render() {
      return html`
        <div>
          <slot></slot>
          <slot name="input"></slot>
        </div>
      `;
    }

    constructor() {
      super();
      this._setType('checkbox');
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
        })
      );
    }
  }
);

const runTests = (baseClass) => {
  const tag = `checked-mixin-${baseClass}-element`;

  const updateComplete = () => (baseClass === 'lit' ? element.updateComplete : Promise.resolve());

  let element, input, link;

  describe('default', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag}>
          I accept <a href="#">the terms and conditions</a>
        </<${tag}>
      `);
      await updateComplete();
      link = element.querySelector('a');
      input = element.querySelector('[slot=input]');
    });

    it('should set checked property to false by default', () => {
      expect(element.checked).to.be.false;
    });

    it('should not have checked attribute by default', () => {
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should reflect checked property to the attribute', async () => {
      element.checked = true;
      await updateComplete();
      expect(element.hasAttribute('checked')).to.be.true;

      element.checked = false;
      await updateComplete();
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should toggle checked property on change', () => {
      input.checked = true;
      fire(input, 'change');
      expect(element.checked).to.be.true;

      input.checked = false;
      fire(input, 'change');
      expect(element.checked).to.be.false;
    });

    it('should toggle checked property on click', () => {
      input.click();
      expect(element.checked).to.be.true;

      input.click();
      expect(element.checked).to.be.false;
    });

    it('should not toggle checked property when clicked a link', () => {
      link.click();
      expect(element.checked).to.be.false;
    });

    it('should not toggle checked property when disabled', async () => {
      element.disabled = true;
      await updateComplete();
      input.click();
      expect(element.checked).to.be.false;
    });
  });

  describe('delegation', () => {
    describe('checked property', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} checked></${tag}>`);
        await updateComplete();
        input = element.querySelector('[slot=input]');
      });

      it('should delegate checked property to the input', async () => {
        expect(input.checked).to.be.true;

        element.checked = false;
        await updateComplete();
        expect(input.checked).to.be.false;
      });
    });
  });
};

describe('CheckedMixin + Polymer', () => {
  runTests('polymer');
});

describe('CheckedMixin + Lit', () => {
  runTests('lit');
});
