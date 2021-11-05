import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
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

  const ID_REGEX = /^label-label-mixin-element-\d+$/;

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
      const id = label.getAttribute('id');
      expect(id).to.match(ID_REGEX);
      expect(id.endsWith(element.constructor._uniqueLabelId)).to.be.true;
    });

    describe('label property', () => {
      it('should be undefined by default', () => {
        expect(element.label).to.be.undefined;
      });

      it('should reflect label attribute to the property', () => {
        element.setAttribute('label', 'Email');
        expect(element.label).to.equal('Email');

        element.removeAttribute('label');
        expect(element.label).to.equal(null);
      });

      it('should update label content on property change', () => {
        element.label = 'Email';
        expect(label.textContent).to.equal('Email');
      });
    });

    describe('has-label attribute', () => {
      it('should not set the attribute by default', () => {
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should toggle the attribute on label property change', () => {
        element.label = 'Email';
        expect(element.hasAttribute('has-label')).to.be.true;

        element.label = null;
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should not set the attribute when label is only whitespaces', () => {
        element.label = ' ';
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should not set the attribute when label is empty', () => {
        element.label = '';
        expect(element.hasAttribute('has-label')).to.be.false;
      });
    });
  });

  describe('slotted', () => {
    describe('basic', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <label-mixin-element>
            <label slot="label">Custom</label>
          </label-mixin-element>
        `);
        label = element.querySelector('label');
      });

      it('should set id on the slotted label element', () => {
        const id = label.getAttribute('id');
        expect(id).to.match(ID_REGEX);
        expect(id.endsWith(element.constructor._uniqueLabelId)).to.be.true;
      });

      it('should update slotted label content on property change', () => {
        element.label = 'Email';
        expect(label.textContent).to.equal('Email');
      });

      it('should add has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });

      it('should remove has-label attribute when label content is whitespace string', async () => {
        label.textContent = ' ';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should remove has-label attribute when label content is empty', async () => {
        label.textContent = '';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.false;
      });
    });

    describe('empty text node', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <label-mixin-element>
            <label slot="label"> </label>
          </label-mixin-element>
        `);
        label = element.querySelector('label');
      });

      it('should not add has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should add has-label attribute when mutating a child text node', async () => {
        label.childNodes[0].textContent = 'Label';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });

    describe('element node', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <label-mixin-element>
            <label slot="label"><div>Label</div></label>
          </label-mixin-element>
        `);
        label = element.querySelector('label');
      });

      it('should add has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });

      it('should not remove has-label attribute when label children are empty', async () => {
        label.firstChild.textContent = '';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });

    describe('empty element node', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <label-mixin-element>
            <label slot="label"><div></div></label>
          </label-mixin-element>
        `);
        label = element.querySelector('label');
      });

      it('should add has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });
  });
});
