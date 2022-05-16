import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DelegateStateMixin } from '../src/delegate-state-mixin.js';

customElements.define(
  'delegate-state-mixin-element',
  class extends DelegateStateMixin(PolymerElement) {
    static get properties() {
      return {
        title: {
          type: String,
          reflectToAttribute: true,
        },

        invalid: {
          type: Boolean,
          reflectToAttribute: true,
        },

        indeterminate: {
          type: Boolean,
          value: true,
        },
      };
    }

    static get delegateAttrs() {
      return ['title', 'invalid'];
    }

    static get delegateProps() {
      return ['indeterminate'];
    }

    static get template() {
      return html`<input id="input" />`;
    }

    ready() {
      super.ready();

      this.stateTarget = this.$.input;
    }
  },
);

describe('delegate-state-mixin', () => {
  let element, target;

  describe('title attribute', () => {
    describe('default', () => {
      beforeEach(() => {
        element = fixtureSync('<delegate-state-mixin-element></delegate-state-mixin-element>');
        target = element.stateTarget;
      });

      it('should delegate title attribute to the target', () => {
        expect(target.hasAttribute('title')).to.be.false;

        element.setAttribute('title', 'foo');
        expect(target.getAttribute('title')).to.equal('foo');
      });
    });

    describe('initially set', () => {
      beforeEach(() => {
        element = fixtureSync('<delegate-state-mixin-element title="foo"></delegate-state-mixin-element>');
        target = element.stateTarget;
      });

      it('should delegate title attribute to the target', () => {
        expect(target.getAttribute('title')).to.equal('foo');

        element.removeAttribute('title');
        expect(target.hasAttribute('title')).to.be.false;
      });
    });
  });

  describe('invalid attribute', () => {
    describe('default', () => {
      beforeEach(() => {
        element = fixtureSync('<delegate-state-mixin-element></delegate-state-mixin-element>');
        target = element.stateTarget;
      });

      it('should delegate invalid attribute to the target', () => {
        expect(target.hasAttribute('invalid')).to.be.false;

        element.toggleAttribute('invalid', true);
        expect(target.hasAttribute('invalid')).to.be.true;
      });

      it('should delegate aria-invalid attribute to the target', () => {
        expect(target.hasAttribute('aria-invalid')).to.be.false;

        element.toggleAttribute('invalid', true);
        expect(target.hasAttribute('aria-invalid')).to.be.true;
      });
    });

    describe('initially set', () => {
      beforeEach(() => {
        element = fixtureSync('<delegate-state-mixin-element invalid></delegate-state-mixin-element>');
        target = element.stateTarget;
      });

      it('should delegate invalid attribute to the target', () => {
        expect(target.hasAttribute('invalid')).to.be.true;

        element.removeAttribute('invalid');
        expect(target.hasAttribute('invalid')).to.be.false;
      });

      it('should delegate aria-invalid attribute to the target', () => {
        expect(target.hasAttribute('aria-invalid')).to.be.true;

        element.removeAttribute('invalid');
        expect(target.hasAttribute('aria-invalid')).to.be.false;
      });
    });
  });

  describe('indeterminate property', () => {
    beforeEach(() => {
      element = fixtureSync('<delegate-state-mixin-element></delegate-state-mixin-element>');
      target = element.stateTarget;
    });

    it('should delegate indeterminate property to the target', () => {
      expect(target.indeterminate).to.be.true;

      target.indeterminate = false;
      expect(target.indeterminate).to.be.false;
    });
  });
});
