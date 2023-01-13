import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { DelegateStateMixin } from '../src/delegate-state-mixin.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass](
    'delegate-state-mixin',
    '<input id="input">',
    (Base) =>
      class extends DelegateStateMixin(Base) {
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

        ready() {
          super.ready();

          this.stateTarget = this.$.input;
        }
      },
  );

  let element, target;

  describe('title attribute', () => {
    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        target = element.stateTarget;
      });

      it('should delegate title attribute to the target', async () => {
        expect(target.hasAttribute('title')).to.be.false;

        element.setAttribute('title', 'foo');
        await nextFrame();
        expect(target.getAttribute('title')).to.equal('foo');
      });
    });

    describe('initially set', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} title="foo"></${tag}>`);
        await nextRender();
        target = element.stateTarget;
      });

      it('should delegate title attribute to the target', async () => {
        expect(target.getAttribute('title')).to.equal('foo');

        element.removeAttribute('title');
        await nextFrame();
        expect(target.hasAttribute('title')).to.be.false;
      });
    });
  });

  describe('invalid attribute', () => {
    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        target = element.stateTarget;
      });

      it('should delegate invalid attribute to the target', async () => {
        expect(target.hasAttribute('invalid')).to.be.false;

        element.toggleAttribute('invalid', true);
        await nextFrame();
        expect(target.hasAttribute('invalid')).to.be.true;
      });

      it('should delegate aria-invalid attribute to the target', async () => {
        expect(target.hasAttribute('aria-invalid')).to.be.false;

        element.toggleAttribute('invalid', true);
        await nextFrame();
        expect(target.hasAttribute('aria-invalid')).to.be.true;
      });
    });

    describe('initially set', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} invalid></${tag}>`);
        await nextRender();
        target = element.stateTarget;
      });

      it('should delegate invalid attribute to the target', async () => {
        expect(target.hasAttribute('invalid')).to.be.true;

        element.removeAttribute('invalid');
        await nextFrame();
        expect(target.hasAttribute('invalid')).to.be.false;
      });

      it('should delegate aria-invalid attribute to the target', async () => {
        expect(target.hasAttribute('aria-invalid')).to.be.true;

        element.removeAttribute('invalid');
        await nextFrame();
        expect(target.hasAttribute('aria-invalid')).to.be.false;
      });
    });
  });

  describe('indeterminate property', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      target = element.stateTarget;
    });

    it('should delegate indeterminate property to the target', async () => {
      expect(target.indeterminate).to.be.true;

      target.indeterminate = false;
      await nextFrame();
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
