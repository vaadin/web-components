import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '../src/controller-mixin.js';
import { SlotController } from '../src/slot-controller.js';

customElements.define(
  'slot-controller-element',
  class extends ControllerMixin(PolymerElement) {
    static get template() {
      return html`
        <slot name="foo"></slot>
        <slot></slot>
      `;
    }
  }
);

describe('slot-controller', () => {
  let element, child, controller;

  describe('named slot', () => {
    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element></slot-controller-element>');
        controller = new SlotController(element, 'foo', () => {
          const div = document.createElement('div');
          div.textContent = 'foo';
          return div;
        });
        element.addController(controller);
        child = element.querySelector('[slot="foo"]');
      });

      it('should append an element to named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('foo');
      });

      it('should store a reference to named slot child', () => {
        expect(controller.node).to.equal(child);
      });

      it('should get a reference to named slot child', () => {
        expect(controller.getSlotChild('foo')).to.equal(child);
      });
    });

    describe('custom content', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <slot-controller-element>
            <div slot="foo">bar</div>
          </slot-controller-element>
        `);
        // Get element reference before adding the controller
        child = element.querySelector('[slot="foo"]');
        controller = new SlotController(element, 'foo', () => {
          const div = document.createElement('div');
          div.textContent = 'foo';
          return div;
        });
        element.addController(controller);
      });

      it('should not override an element passed to named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('bar');
      });

      it('should store a reference to the custom slot child', () => {
        expect(controller.node).to.equal(child);
      });

      it('should get a reference to named slot child', () => {
        expect(controller.getSlotChild('foo')).to.equal(child);
      });
    });
  });

  describe('un-named slot', () => {
    describe('default content', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element></slot-controller-element>');
        controller = new SlotController(element, '', () => {
          const div = document.createElement('div');
          div.textContent = 'bar';
          return div;
        });
        element.addController(controller);
        child = element.querySelector(':not([slot])');
      });

      it('should append an element to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('bar');
      });

      it('should store a reference to un-named slot child', () => {
        expect(controller.node).to.equal(child);
      });

      it('should get a reference to un-named slot child', () => {
        expect(controller.getSlotChild('')).to.equal(child);
      });
    });

    describe('custom element', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <slot-controller-element>
            <div>baz</div>
          </slot-controller-element>
        `);
        // Get element reference before adding the controller
        child = element.querySelector(':not([slot])');
        controller = new SlotController(element, '', () => {
          const div = document.createElement('div');
          div.textContent = 'bar';
          return div;
        });
        element.addController(controller);
      });

      it('should not override an element passed to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('baz');
      });

      it('should store a reference to element passed to un-named slot', () => {
        expect(controller.node).to.equal(child);
      });

      it('should get a reference to element passed to un-named slot', () => {
        expect(controller.getSlotChild('')).to.equal(child);
      });
    });

    describe('custom text node', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element>baz</slot-controller-element>');
        controller = new SlotController(element, '', () => {
          const div = document.createElement('div');
          div.textContent = 'bar';
          return div;
        });
        element.addController(controller);
        // Check last child to ensure no custom node is added.
        child = element.lastChild;
      });

      it('should not override a text node passed to un-named slot', () => {
        expect(child).to.be.ok;
        expect(child.textContent).to.equal('baz');
      });

      it('should store a reference to the slotted text node', () => {
        expect(controller.node).to.equal(child);
      });

      it('should get a reference to the slotted text node', () => {
        expect(controller.getSlotChild('')).to.equal(child);
      });
    });

    describe('empty text node', () => {
      beforeEach(() => {
        element = fixtureSync('<slot-controller-element> </slot-controller-element>');
        child = element.firstChild;
      });

      it('should override an empty text node passed to un-named slot', () => {
        controller = new SlotController(element, '', () => {
          const div = document.createElement('div');
          div.textContent = 'bar';
          return div;
        });
        element.addController(controller);
      });
    });
  });
});
