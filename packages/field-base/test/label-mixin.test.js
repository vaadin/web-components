import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LabelMixin } from '../src/label-mixin.js';

customElements.define(
  'label-mixin-element',
  class extends LabelMixin(PolymerElement) {
    static get template() {
      return html`<slot name="label"></slot>`;
    }
  }
);

describe('label-mixin', () => {
  let element, label;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<label-mixin-element></label-mixin-element>`);
      label = element.querySelector('[slot=label]');
    });

    it('should create a label element', () => {
      expect(label).to.be.an.instanceof(HTMLLabelElement);
    });

    it('should set slot on the label', () => {
      expect(label.getAttribute('slot')).to.equal('label');
    });

    it('should set id on the label element', () => {
      const idRegex = /^label-label-mixin-element-\d$/;
      expect(label.getAttribute('id')).to.match(idRegex);
    });

    it('should update label content on attribute change', () => {
      element.setAttribute('label', 'Email');
      expect(label.textContent).to.equal('Email');
    });

    it('should update label content on property change', () => {
      element.label = 'Email';
      expect(label.textContent).to.equal('Email');
    });

    it('should not set has-label attribute by default', () => {
      expect(element.hasAttribute('has-label')).to.be.false;
    });

    it('should toggle has-label attribute on attribute change', () => {
      element.setAttribute('label', 'Email');
      expect(element.hasAttribute('has-label')).to.be.true;

      element.removeAttribute('label');
      expect(element.hasAttribute('has-label')).to.be.false;
    });

    it('should toggle has-label attribute on property change', () => {
      element.label = 'Email';
      expect(element.hasAttribute('has-label')).to.be.true;

      element.label = '';
      expect(element.hasAttribute('has-label')).to.be.false;
    });
  });

  describe('slotted', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <label-mixin-element>
          <label slot="label"><div>Custom</div></label>
        </label-mixin-element>
      `);
      label = element.querySelector('label');
    });

    it('should set id on the slotted label element', () => {
      const idRegex = /^label-label-mixin-element-\d$/;
      expect(label.getAttribute('id')).to.match(idRegex);
    });

    it('should set has-label attribute', () => {
      expect(element.hasAttribute('has-label')).to.be.true;
    });

    it('should remove has-label attribute when label content is only whitespaces', async () => {
      label.textContent = ' ';
      await nextFrame();
      expect(element.hasAttribute('has-label')).to.be.false;
    });

    it('should remove has-label attribute when label content is empty', async () => {
      label.textContent = '';
      await nextFrame();
      expect(element.hasAttribute('has-label')).to.be.false;
    });

    it('should not remove has-label attribute when label children are empty', async () => {
      label.firstChild.textContent = '';
      await nextFrame();
      expect(element.hasAttribute('has-label')).to.be.true;
    });

    it('should update slotted label content on property change', () => {
      element.label = 'Email';
      expect(label.textContent).to.equal('Email');
    });
  });
});
