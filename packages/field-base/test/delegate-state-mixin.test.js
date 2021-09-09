import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { DelegateStateMixin } from '../src/delegate-state-mixin.js';

customElements.define(
  'delegate-state-mixin-element-without-target',
  class extends DelegateStateMixin(PolymerElement) {
    static get properties() {
      return {
        title: {
          type: String,
          reflectToAttribute: true
        },

        indeterminate: {
          type: Boolean,
          default: true
        }
      };
    }

    static get delegateAttrs() {
      return ['title'];
    }

    static get delegateProps() {
      return ['indeterminate'];
    }

    static get template() {
      return html`<input id="input" />`;
    }
  }
);

customElements.define(
  'delegate-state-mixin-element',
  class extends DelegateStateMixin(PolymerElement) {
    static get properties() {
      return {
        title: {
          type: String,
          reflectToAttribute: true
        },

        invalid: {
          type: Boolean,
          reflectToAttribute: true
        },

        indeterminate: {
          type: Boolean,
          value: true
        }
      };
    }

    static get delegateAttrs() {
      return ['title', 'invalid'];
    }

    static get delegateProps() {
      return ['indeterminate'];
    }

    get _delegateStateTarget() {
      return this.$.input;
    }

    static get template() {
      return html`<input id="input" />`;
    }
  }
);

describe('delegate-state-mixin', () => {
  let element, input;

  describe('without target', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');

      element = fixtureSync(
        '<delegate-state-mixin-element-without-target></delegate-state-mixin-element-without-target>'
      );
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn about no implementation for _delegateStateTarget', () => {
      expect(console.warn.calledTwice).to.be.true;
      expect(console.warn.args[0][0]).to.equal(
        `Please implement the '_delegateStateTarget' property in <delegate-state-mixin-element-without-target>`
      );
    });
  });

  describe('attributes', () => {
    describe('title', () => {
      beforeEach(() => {
        element = fixtureSync('<delegate-state-mixin-element title="foo"></delegate-state-mixin-element>');
        input = element.shadowRoot.querySelector('input');
      });

      it('should delegate title attribute to the input', () => {
        expect(input.getAttribute('title')).to.equal('foo');
      });

      it('should update title attribute on the input', () => {
        element.setAttribute('title', 'bar');
        expect(input.getAttribute('title')).to.equal('bar');
      });
    });

    describe('invalid', () => {
      beforeEach(() => {
        element = fixtureSync('<delegate-state-mixin-element invalid></delegate-state-mixin-element>');
        input = element.shadowRoot.querySelector('input');
      });

      it('should delegate invalid attribute to the input', () => {
        expect(input.hasAttribute('invalid')).to.be.true;
      });

      it('should delegate aria-invalid attribute to the input', () => {
        expect(input.getAttribute('aria-invalid')).to.equal('true');
      });

      it('should remove invalid attribute when valid', () => {
        element.removeAttribute('invalid');
        expect(input.hasAttribute('invalid')).to.be.false;
      });

      it('should remove aria-invalid attribute when valid', () => {
        element.removeAttribute('invalid');
        expect(input.hasAttribute('aria-invalid')).to.be.false;
      });
    });
  });

  describe('properties', () => {
    beforeEach(() => {
      element = fixtureSync('<delegate-state-mixin-element></delegate-state-mixin-element>');
      input = element.shadowRoot.querySelector('input');
    });

    describe('indeterminate', () => {
      it('should delegate indeterminate property to the input', () => {
        expect(input.indeterminate).to.be.true;
      });

      it('should update indeterminate property on the input', () => {
        input.indeterminate = false;
        expect(input.indeterminate).to.be.false;
      });
    });
  });
});
