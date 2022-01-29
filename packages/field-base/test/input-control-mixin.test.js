import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'input-control-mixin-polymer-element',
  class extends InputControlMixin(PolymerElement) {
    static get template() {
      return legacyHtml`
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot name="input"></slot>
        <button id="clearButton">Clear</button>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }

    get clearElement() {
      return this.$.clearButton;
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        })
      );
    }
  }
);

customElements.define(
  'input-control-mixin-lit-element',
  class extends InputControlMixin(PolylitMixin(LitElement)) {
    render() {
      return html`
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot name="input"></slot>
        <button id="clearButton">Clear</button>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }

    get clearElement() {
      return this.$.clearButton;
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        })
      );
    }
  }
);

const runTests = (baseClass) => {
  const tag = `input-control-mixin-${baseClass}-element`;

  const updateComplete = () => (baseClass === 'lit' ? element.updateComplete : Promise.resolve());

  let element, input;

  describe('clear button', () => {
    let button;

    beforeEach(async () => {
      element = fixtureSync(`<${tag} value="foo"></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
      button = element.$.clearButton;
    });

    it('should clear the field value on clear button click', async () => {
      button.click();
      await updateComplete();
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear button click', async () => {
      button.click();
      await updateComplete();
      expect(input.value).to.equal('');
    });

    it('should focus the input on clear button click', () => {
      const spy = sinon.spy(input, 'focus');
      button.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch input event on clear button click', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      button.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch change event on clear button click', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      button.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.false;
    });

    it('should call preventDefault on the button click event', () => {
      const event = new CustomEvent('click', { cancelable: true });
      button.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should reflect clearButtonVisible property to attribute', async () => {
      element.clearButtonVisible = true;
      await updateComplete();
      expect(element.hasAttribute('clear-button-visible')).to.be.true;

      element.clearButtonVisible = false;
      await updateComplete();
      expect(element.hasAttribute('clear-button-visible')).to.be.false;
    });

    it('should clear value on Esc when clearButtonVisible is true', async () => {
      element.clearButtonVisible = true;
      escKeyDown(button);
      await updateComplete();
      expect(input.value).to.equal('');
    });

    it('should not clear value on Esc when clearButtonVisible is false', () => {
      escKeyDown(button);
      expect(input.value).to.equal('foo');
    });

    it('should dispatch input event when clearing value on Esc', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      element.clearButtonVisible = true;
      escKeyDown(button);
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch change event when clearing value on Esc', () => {
      const spy = sinon.spy();
      input.addEventListener('change', spy);
      element.clearButtonVisible = true;
      escKeyDown(button);
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.false;
    });
  });

  describe('name', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} name="foo"></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate name attribute to the input', () => {
      expect(input.getAttribute('name')).to.equal('foo');
    });

    it('should propagate name property to the input', async () => {
      element.name = 'bar';
      await updateComplete();
      expect(input.getAttribute('name')).to.equal('bar');
    });
  });

  describe('title', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} title="foo"></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.getAttribute('title')).to.equal('foo');
    });

    it('should propagate title property to the input', async () => {
      element.title = 'bar';
      await updateComplete();
      expect(input.getAttribute('title')).to.equal('bar');
    });
  });

  describe('placeholder', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} placeholder="foo"></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate placeholder attribute to the input', () => {
      expect(input.placeholder).to.equal('foo');
    });

    it('should propagate placeholder property to the input', async () => {
      element.placeholder = 'bar';
      await updateComplete();
      expect(input.placeholder).to.equal('bar');
    });
  });

  describe('readonly', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} readonly></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate readonly attribute to the input', () => {
      expect(input.readOnly).to.be.true;
    });

    it('should propagate readonly property to the input', async () => {
      element.readonly = false;
      await updateComplete();
      expect(input.readOnly).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} required></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate required attribute to the input', () => {
      expect(input.required).to.be.true;
    });

    it('should propagate required property to the input', async () => {
      element.required = false;
      await updateComplete();
      expect(input.required).to.be.false;
    });
  });

  describe('invalid', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} invalid></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should not reset invalid state set with attribute', () => {
      expect(element.invalid).to.be.true;
    });

    it('should set invalid attribute on the input', () => {
      expect(input.hasAttribute('invalid')).to.be.true;
    });

    it('should set aria-invalid attribute on the input', () => {
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should remove invalid attribute when valid', async () => {
      element.invalid = false;
      await updateComplete();
      expect(input.hasAttribute('invalid')).to.be.false;
    });

    it('should remove aria-invalid attribute when valid', async () => {
      element.invalid = false;
      await updateComplete();
      expect(input.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('autoselect', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      input = element.querySelector('[slot=input]');
    });

    it('should select the input content when autoselect is set', () => {
      const spy = sinon.spy(input, 'select');
      element.autoselect = true;
      input.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });
};

describe('InputControlMixin + Polymer', () => {
  runTests('polymer');
});

describe('InputControlMixin + Lit', () => {
  runTests('lit');
});
