import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { SlotLabelMixin } from '../src/slot-label-mixin.js';

customElements.define(
  'slot-label-mixin-element',
  class extends SlotLabelMixin(PolymerElement) {
    static get template() {
      return html`
        <div>
          <slot name="label"></slot>
          <slot id="default"></slot>
        </div>
      `;
    }

    /** @protected */
    get _sourceSlot() {
      return this.$.default;
    }
  }
);

describe('slot-label-mixin', () => {
  let element;

  describe('slot label', () => {
    beforeEach(() => {
      element = fixtureSync(`<slot-label-mixin-element>Slot Label</slot-label-mixin-element>`);
    });

    it('should display the slot label', () => {
      expect(element._labelNode.textContent).to.equal('Slot Label');
    });

    it('should set has-label attribute', () => {
      expect(element.hasAttribute('has-label')).to.be.true;
    });

    describe('overriden with label property', () => {
      beforeEach(() => {
        element.label = 'Label Property';
      });

      it('should display the label property', () => {
        expect(element._labelNode.textContent).to.equal('Label Property');
      });

      it('should keep has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });
  });

  describe('label property', () => {
    beforeEach(() => {
      element = fixtureSync(`<slot-label-mixin-element label="Label Property"></slot-label-mixin-element>`);
    });

    it('should display the label property', () => {
      expect(element._labelNode.textContent).to.equal('Label Property');
    });

    describe('overriden with slot label', () => {
      beforeEach(async () => {
        const label = document.createTextNode('Slot Label');
        element.appendChild(label);
        await nextFrame();
      });

      it('should display the slot label', () => {
        expect(element._labelNode.textContent).to.equal('Slot Label');
      });

      it('should keep has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });
  });

  describe('label property and slot label', () => {
    beforeEach(() => {
      element = fixtureSync(`<slot-label-mixin-element label="Label Property">Slot Label</slot-label-mixin-element>`);
    });

    it('should display the slot label', () => {
      expect(element._labelNode.textContent).to.equal('Slot Label');
    });

    it('should set has-label attribute', () => {
      expect(element.hasAttribute('has-label')).to.be.true;
    });
  });
});
