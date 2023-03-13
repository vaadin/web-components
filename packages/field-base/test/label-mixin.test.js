import { expect } from '@esm-bundle/chai';
import { defineLit, definePolymer, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LabelMixin } from '../src/label-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'label-mixin',
    '<slot name="label"></slot>',
    (Base) => class extends LabelMixin(baseMixin(Base)) {},
  );

  let element, label;

  const ID_REGEX = new RegExp(`^label-${tag}-\\d+$`, 'u');

  describe('default', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      label = element.querySelector('[slot=label]');
    });

    it('should create a label element', () => {
      expect(label).to.be.an.instanceof(HTMLLabelElement);
    });

    it('should set slot on the label', () => {
      expect(label.getAttribute('slot')).to.equal('label');
    });

    describe('label property', () => {
      it('should be undefined by default', () => {
        expect(element.label).to.be.undefined;
      });

      it('should reflect label attribute to the property', async () => {
        element.setAttribute('label', 'Email');
        await nextFrame();
        expect(element.label).to.equal('Email');

        element.removeAttribute('label');
        await nextFrame();
        expect(element.label).to.equal(null);
      });

      it('should update label content on property change', async () => {
        element.label = 'Email';
        await nextFrame();
        expect(label.textContent).to.equal('Email');
      });
    });

    describe('has-label attribute', () => {
      it('should not set the attribute by default', () => {
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should toggle the attribute on label property change', async () => {
        element.label = 'Email';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.true;

        element.label = null;
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should not set the attribute when label is only whitespaces', async () => {
        element.label = ' ';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.false;
      });

      it('should not set the attribute when label is empty', async () => {
        element.label = '';
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.false;
      });
    });
  });

  describe('unique id', () => {
    let label1, label2;

    beforeEach(async () => {
      const element1 = fixtureSync(`<${tag} error-message="Error 1"></${tag}>`);
      const element2 = fixtureSync(`<${tag} error-message="Error 2"></${tag}>`);
      await nextRender();
      label1 = element1.querySelector('label');
      label2 = element2.querySelector('label');
    });

    it('should set a unique id on the label element', () => {
      expect(label1.id).to.not.equal(label2.id);
      expect(label1.id).to.match(ID_REGEX);
      expect(label2.id).to.match(ID_REGEX);
    });
  });

  describe('slotted', () => {
    describe('basic', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <label slot="label">Custom</label>
          </${tag}>
        `);
        await nextRender();
        label = element.querySelector('label');
      });

      it('should set id on the slotted label element', () => {
        expect(label.id).to.match(ID_REGEX);
      });

      it('should not update slotted label content on property change', async () => {
        element.label = 'Email';
        await nextFrame();
        expect(label.textContent).to.equal('Custom');
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

      it('should attach default label when removing the custom label', async () => {
        element.label = 'Fallback';
        element.removeChild(label);
        await nextFrame();
        expect(element._labelNode.textContent).to.equal('Fallback');
      });
    });

    describe('empty text node', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <label slot="label"> </label>
          </${tag}>
        `);
        await nextRender();
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
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <label slot="label"><div>Label</div></label>
          </${tag}>
        `);
        await nextRender();
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
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <label slot="label"><div></div></label>
          </${tag}>
        `);
        await nextRender();
        label = element.querySelector('label');
      });

      it('should add has-label attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });
    });
  });

  describe('lazy', () => {
    describe('DOM manipulations', () => {
      let lazyLabel;

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        element.label = 'Default label';
        await nextFrame();
        label = element._labelNode;
        lazyLabel = document.createElement('label');
        lazyLabel.setAttribute('slot', 'label');
        lazyLabel.textContent = 'Lazy';
      });

      it('should handle lazy label added using appendChild', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();
        expect(element._labelNode).to.equal(lazyLabel);
      });

      it('should handle lazy label added using insertBefore', async () => {
        element.insertBefore(lazyLabel, label);
        await nextFrame();
        expect(element._labelNode).to.equal(lazyLabel);
      });

      it('should handle lazy label added using replaceChild', async () => {
        element.replaceChild(lazyLabel, label);
        await nextFrame();
        expect(element._labelNode).to.equal(lazyLabel);
      });

      it('should remove the default label from the element when using appendChild', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();
        expect(label.parentNode).to.be.null;
      });

      it('should remove the default label from the element when using insertBefore', async () => {
        element.insertBefore(lazyLabel, label);
        await nextFrame();
        expect(label.parentNode).to.be.null;
      });

      it('should support replacing lazy label with a new one using appendChild', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();

        const newLabel = document.createElement('label');
        newLabel.setAttribute('slot', 'label');
        newLabel.textContent = 'New';
        element.appendChild(newLabel);

        await nextFrame();
        expect(element._labelNode).to.equal(newLabel);
      });

      it('should support replacing lazy label with a new one using insertBefore', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();

        const newLabel = document.createElement('label');
        newLabel.setAttribute('slot', 'label');
        newLabel.textContent = 'New';
        element.insertBefore(newLabel, lazyLabel);

        await nextFrame();
        expect(element._labelNode).to.equal(newLabel);
      });

      it('should support replacing lazy label with a new one using replaceChild', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();

        const newLabel = document.createElement('label');
        newLabel.setAttribute('slot', 'label');
        newLabel.textContent = 'New';
        element.replaceChild(newLabel, lazyLabel);

        await nextFrame();
        expect(element._labelNode).to.equal(newLabel);
      });

      it('should support adding lazy label after removing the default one', async () => {
        element.removeChild(label);
        await nextFrame();

        element.appendChild(lazyLabel);
        await nextFrame();

        expect(element._labelNode).to.equal(lazyLabel);
      });

      it('should restore the default label when removing the lazy label', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();

        element.removeChild(lazyLabel);
        await nextFrame();
        expect(element._labelNode).to.equal(label);
      });

      it('should keep has-label attribute when the default label is restored', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();

        element.removeChild(lazyLabel);
        await nextFrame();
        expect(element.hasAttribute('has-label')).to.be.true;
      });

      it('should remove has-label attribute when label is set to empty', async () => {
        element.appendChild(lazyLabel);
        await nextFrame();

        element.label = '';

        element.removeChild(lazyLabel);
        await nextFrame();

        expect(element.hasAttribute('has-label')).to.be.false;
      });
    });
  });
};

describe('LabelMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('LabelMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
