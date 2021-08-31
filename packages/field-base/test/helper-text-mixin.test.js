import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { HelperTextMixin } from '../src/helper-text-mixin.js';

customElements.define(
  'helper-text-mixin-element',
  class extends HelperTextMixin(PolymerElement) {
    static get template() {
      return html`<slot name="helper"></slot>`;
    }
  }
);

describe('helper-text-mixin', () => {
  let element, helper;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<helper-text-mixin-element></helper-text-mixin-element>`);
      helper = element.querySelector('[slot=helper]');
    });

    it('should create a helper element', () => {
      expect(helper).to.be.an.instanceof(HTMLDivElement);
    });

    it('should set slot on the helper', () => {
      expect(helper.getAttribute('slot')).to.equal('helper');
    });

    it('should set id on the helper element', () => {
      const idRegex = /^helper-helper-text-mixin-element-\d+$/;
      expect(helper.getAttribute('id')).to.match(idRegex);
    });

    it('should update helper content on attribute change', () => {
      element.setAttribute('helper-text', '3 digits');
      expect(helper.textContent).to.equal('3 digits');
    });

    it('should update helper content on property change', () => {
      element.helperText = '3 digits';
      expect(helper.textContent).to.equal('3 digits');
    });

    it('should not set has-helper attribute with no helper', () => {
      expect(element.hasAttribute('has-helper')).to.be.false;
    });

    it('should set has-helper attribute when attribute is set', () => {
      element.setAttribute('helper-text', '3 digits');
      expect(element.hasAttribute('has-helper')).to.be.true;
    });

    it('should set has-helper attribute when property is set', () => {
      element.helperText = '3 digits';
      expect(element.hasAttribute('has-helper')).to.be.true;
    });
  });

  describe('attribute', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <helper-text-mixin-element
          helper-text="3 digits"
        ></helper-text-mixin-element>
      `);
      helper = element.querySelector('[slot=helper]');
    });

    it('should set helper text content from attribute', () => {
      expect(helper.textContent).to.equal('3 digits');
    });
  });

  describe('slotted', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <helper-text-mixin-element>
          <div slot="helper">Custom</div>
        </helper-text-mixin-element>
      `);
      helper = element.querySelector('[slot=helper]');
    });

    it('should return slotted helper content as a helperText', () => {
      expect(element.helperText).to.equal('Custom');
    });

    it('should set id on the slotted helper element', () => {
      const idRegex = /^helper-helper-text-mixin-element-\d+$/;
      expect(helper.getAttribute('id')).to.match(idRegex);
    });

    it('should set has-helper attribute with slotted helper', () => {
      expect(element.hasAttribute('has-helper')).to.be.true;
    });

    it('should update slotted helper content on property change', () => {
      element.helperText = '3 digits';
      expect(helper.textContent).to.equal('3 digits');
    });
  });

  describe('lazy', () => {
    describe('DOM manipulations', () => {
      let defaultHelper;

      beforeEach(async () => {
        element = fixtureSync('<helper-text-mixin-element></helper-text-mixin-element>');
        await nextFrame();
        defaultHelper = element._helperNode;
        helper = document.createElement('div');
        helper.setAttribute('slot', 'helper');
        helper.textContent = 'Lazy';
      });

      it('should return lazy helper content as a helperText using appendChild', async () => {
        element.appendChild(helper);
        await nextFrame();
        expect(element.helperText).to.equal('Lazy');
      });

      it('should return lazy helper content as a helperText using insertBefore', async () => {
        element.insertBefore(helper, defaultHelper);
        await nextFrame();
        expect(element.helperText).to.equal('Lazy');
      });

      it('should return lazy helper content as a helperText using replaceChild', async () => {
        element.replaceChild(helper, defaultHelper);
        await nextFrame();
        expect(element.helperText).to.equal('Lazy');
      });

      it('should remove the default helper from the element when using appendChild', async () => {
        element.appendChild(helper);
        await nextFrame();
        expect(defaultHelper.parentNode).to.be.null;
      });

      it('should remove the default helper from the element when using insertBefore', async () => {
        element.insertBefore(helper, defaultHelper);
        await nextFrame();
        expect(defaultHelper.parentNode).to.be.null;
      });

      it('should support replacing lazy helper with a new one using appendChild', async () => {
        element.appendChild(helper);
        await nextFrame();

        const div = document.createElement('div');
        div.setAttribute('slot', 'helper');
        div.textContent = 'New';
        element.appendChild(div);
        await nextFrame();
        expect(element.helperText).to.equal('New');
      });

      it('should support replacing lazy helper with a new one using insertBefore', async () => {
        element.appendChild(helper);
        await nextFrame();

        const div = document.createElement('div');
        div.setAttribute('slot', 'helper');
        div.textContent = 'New';
        element.insertBefore(div, helper);
        await nextFrame();
        expect(element.helperText).to.equal('New');
      });

      it('should support replacing lazy helper with a new one using replaceChild', async () => {
        element.appendChild(helper);
        await nextFrame();

        const div = document.createElement('div');
        div.setAttribute('slot', 'helper');
        div.textContent = 'New';
        element.replaceChild(div, helper);
        await nextFrame();
        expect(element.helperText).to.equal('New');
      });
    });

    describe('ID attribute', () => {
      const idRegex = /^helper-helper-text-mixin-element-\d+$/;

      beforeEach(async () => {
        element = fixtureSync('<helper-text-mixin-element></helper-text-mixin-element>');
        await nextFrame();
        helper = document.createElement('div');
        helper.setAttribute('slot', 'helper');
        helper.textContent = 'Lazy';
      });

      it('should set id on the lazily added helper element', async () => {
        element.appendChild(helper);
        await nextFrame();
        expect(helper.getAttribute('id')).to.match(idRegex);
      });

      it('should not override custom id on the lazily added helper', async () => {
        helper.id = 'helper-component';
        element.appendChild(helper);
        await nextFrame();
        expect(helper.getAttribute('id')).to.equal('helper-component');
      });

      it('should restore default id if the custom helper id is removed', async () => {
        helper.id = 'helper-component';
        element.appendChild(helper);
        await nextFrame();
        helper.removeAttribute('id');
        await nextFrame();
        expect(helper.getAttribute('id')).to.match(idRegex);
      });
    });

    describe('attributes', () => {
      beforeEach(async () => {
        element = fixtureSync('<helper-text-mixin-element></helper-text-mixin-element>');
        await nextFrame();
        helper = document.createElement('div');
        helper.setAttribute('slot', 'helper');
        helper.textContent = 'Lazy';
        element.appendChild(helper);
        await nextFrame();
      });

      it('should store a reference to the lazily added helper', () => {
        expect(element._helperNode).to.equal(helper);
      });

      it('should set has-helper attribute with lazy helper', () => {
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should update lazy helper content on property change', () => {
        element.helperText = '3 digits';
        expect(helper.textContent).to.equal('3 digits');
      });
    });
  });
});
