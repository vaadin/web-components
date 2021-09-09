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

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<slot-label-mixin-element>Label</slot-label-mixin-element>`);
    });

    it('should render the label', () => {
      expect(element._labelNode.textContent).to.equal('Label');
    });

    it('should set has-label attribute on the element', () => {
      expect(element.hasAttribute('has-label')).to.be.true;
    });

    describe('label property change', () => {
      beforeEach(() => {
        element.label = 'New Label';
      });

      it('should render the new label from the property', () => {
        expect(element._labelNode.textContent).to.equal('New Label');
      });

      it('should set has-label attribute on the element', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });
  });

  describe('label property', () => {
    beforeEach(() => {
      element = fixtureSync(`<slot-label-mixin-element label="Label"></slot-label-mixin-element>`);
    });

    it('should render the label', () => {
      expect(element._labelNode.textContent).to.equal('Label');
    });

    describe('slot change', () => {
      beforeEach(async () => {
        const label = document.createTextNode('New Label');
        element.appendChild(label);
        await nextFrame();
      });

      it('should render the new label from the slot', () => {
        expect(element._labelNode.textContent).to.equal('New Label');
      });

      it('should set has-label attribute on the element', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });
  });
});
