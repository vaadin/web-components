import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { SlotMixin } from '../src/slot-mixin.js';

customElements.define(
  'slot-mixin-element',
  class extends SlotMixin(PolymerElement) {
    static get template() {
      return html`
        <slot name="foo"></slot>
        <slot></slot>
      `;
    }

    get slots() {
      return {
        foo: () => {
          const div = document.createElement('div');
          div.textContent = 'foo';
          return div;
        },
        '': () => {
          const div = document.createElement('div');
          div.textContent = 'bar';
          return div;
        },
      };
    }

    get fooChild() {
      return this._getDirectSlotChild('foo');
    }

    get barChild() {
      return this._getDirectSlotChild('');
    }
  },
);

describe('slot-mixin', () => {
  let element, child;

  describe('named slot', () => {
    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-mixin-element></slot-mixin-element>');
        child = element.querySelector('[slot="foo"]');
      });

      it('should append an element to named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('foo');
      });

      it('should store a reference to named slot child', () => {
        expect(element.fooChild).to.equal(child);
      });
    });

    describe('custom content', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <slot-mixin-element>
            <div slot="foo">bar</div>
          </slot-mixin-element>
        `);
        child = element.querySelector('[slot="foo"]');
      });

      it('should not override an element passed to named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('bar');
      });

      it('should store a reference to the custom slot child', () => {
        expect(element.fooChild).to.equal(child);
      });
    });
  });

  describe('un-named slot', () => {
    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-mixin-element></slot-mixin-element>');
        child = element.querySelector(':not([slot])');
      });

      it('should append an element to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('bar');
      });

      it('should store a reference to un-named slot child', () => {
        expect(element.barChild).to.equal(child);
      });
    });

    describe('custom element', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <slot-mixin-element>
            <div>baz</div>
          </slot-mixin-element>
        `);
        child = element.querySelector(':not([slot])');
      });

      it('should not override an element passed to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('baz');
      });

      it('should store a reference to the slotted element', () => {
        expect(element.barChild).to.equal(child);
      });
    });

    describe('custom text node', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-mixin-element>baz</slot-mixin-element>');
        // Custom text node comes first, before the "foo" content is appended.
        child = element.firstChild;
      });

      it('should not override a text node passed to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('baz');
      });

      it('should store a reference to the slotted text node', () => {
        expect(element.barChild).to.equal(child);
      });
    });

    describe('empty text node', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-mixin-element> </slot-mixin-element>');
        // Default text node comes last, after the "foo" content is appended.
        child = element.lastChild;
      });

      it('should override an empty text node passed to un-named slot', () => {
        expect(child.textContent).to.equal('bar');
      });
    });
  });
});
