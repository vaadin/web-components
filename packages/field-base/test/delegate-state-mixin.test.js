import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DelegateStateMixin } from '../src/delegate-state-mixin.js';

customElements.define(
  'delegate-state-mixin-polymer-element',
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

    static get template() {
      return legacyHtml`<input id="input" />`;
    }

    ready() {
      super.ready();

      this.stateTarget = this.$.input;
    }
  }
);

customElements.define(
  'delegate-state-mixin-lit-element',
  class extends DelegateStateMixin(PolylitMixin(LitElement)) {
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

    render() {
      return html`<input id="input" />`;
    }

    ready() {
      super.ready();

      this.stateTarget = this.$.input;
    }
  }
);

const runTests = (baseClass) => {
  const tag = `delegate-state-mixin-${baseClass}-element`;

  const updateComplete = () => (baseClass === 'lit' ? element.updateComplete : Promise.resolve());

  let element, target;

  describe('title attribute', () => {
    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await updateComplete();
        target = element.stateTarget;
      });

      it('should delegate title attribute to the target', async () => {
        expect(target.hasAttribute('title')).to.be.false;

        element.setAttribute('title', 'foo');
        await updateComplete();
        expect(target.getAttribute('title')).to.equal('foo');
      });
    });

    describe('initially set', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} title="foo"></${tag}>`);
        await updateComplete();
        target = element.stateTarget;
      });

      it('should delegate title attribute to the target', async () => {
        expect(target.getAttribute('title')).to.equal('foo');

        element.removeAttribute('title');
        await updateComplete();
        expect(target.hasAttribute('title')).to.be.false;
      });
    });
  });

  describe('invalid attribute', () => {
    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await updateComplete();
        target = element.stateTarget;
      });

      it('should delegate invalid attribute to the target', async () => {
        expect(target.hasAttribute('invalid')).to.be.false;

        element.toggleAttribute('invalid', true);
        await updateComplete();
        expect(target.hasAttribute('invalid')).to.be.true;
      });

      it('should delegate aria-invalid attribute to the target', async () => {
        expect(target.hasAttribute('aria-invalid')).to.be.false;

        element.toggleAttribute('invalid', true);
        await updateComplete();
        expect(target.hasAttribute('aria-invalid')).to.be.true;
      });
    });

    describe('initially set', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} invalid></${tag}>`);
        await updateComplete();
        target = element.stateTarget;
      });

      it('should delegate invalid attribute to the target', async () => {
        expect(target.hasAttribute('invalid')).to.be.true;

        element.removeAttribute('invalid');
        await updateComplete();
        expect(target.hasAttribute('invalid')).to.be.false;
      });

      it('should delegate aria-invalid attribute to the target', async () => {
        expect(target.hasAttribute('aria-invalid')).to.be.true;

        element.removeAttribute('invalid');
        await updateComplete();
        expect(target.hasAttribute('aria-invalid')).to.be.false;
      });
    });
  });

  describe('indeterminate property', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
      target = element.stateTarget;
    });

    it('should delegate indeterminate property to the target', async () => {
      expect(target.indeterminate).to.be.true;

      target.indeterminate = false;
      await updateComplete();
      expect(target.indeterminate).to.be.false;
    });
  });
};

describe('DelegateStateMixin + Polymer', () => {
  runTests('polymer');
});

describe('DelegateStateMixin + Lit', () => {
  runTests('lit');
});
