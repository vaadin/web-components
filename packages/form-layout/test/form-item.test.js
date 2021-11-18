import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@polymer/polymer/lib/elements/custom-style.js';
import '../vaadin-form-item.js';

describe('form-item', () => {
  let item, label, input;

  beforeEach(() => {
    item = fixtureSync(`
      <vaadin-form-item>
        <label slot="label">Label</label>
        <input>
      </vaadin-form-item>
    `);
    label = item.querySelector('label');
    input = item.querySelector('input');
  });

  describe('basic features', () => {
    let labelSlot, inputSlot;

    beforeEach(() => {
      labelSlot = item.shadowRoot.querySelector('slot[name="label"]');
      inputSlot = item.shadowRoot.querySelector('slot:not([name])');
    });

    it('should have slots', () => {
      expect(labelSlot).to.be.ok;
      expect(inputSlot).to.be.ok;
    });

    it('should distribute label', () => {
      expect(labelSlot.assignedNodes()).to.contain(label);
    });

    it('should distribute input', () => {
      expect(inputSlot.assignedNodes()).to.contain(input);
    });
  });

  describe('label positioning', () => {
    it('should be aside by default', () => {
      const labelRect = label.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      expect(labelRect.top).to.be.below(inputRect.bottom);
      expect(labelRect.right).to.be.below(inputRect.left);
    });

    it('should be on top when label-position="top" attribute is set', () => {
      item.setAttribute('label-position', 'top');

      const labelRect = label.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      expect(labelRect.bottom).to.be.at.most(inputRect.top);
      expect(labelRect.right).to.be.above(inputRect.left);
    });

    it('should be in a horizontal flex layout by default', () => {
      expect(getComputedStyle(item).getPropertyValue('flex-direction')).to.equal('row');
      expect(getComputedStyle(item).getPropertyValue('align-items')).to.equal('baseline');
    });

    it('should be in a vertical flex layout when label-position="top" attribute is set', () => {
      item.setAttribute('label-position', 'top');

      expect(getComputedStyle(item).getPropertyValue('flex-direction')).to.equal('column');
      expect(getComputedStyle(item).getPropertyValue('align-items')).to.equal('stretch');
    });
  });

  describe('label click', () => {
    it('should focus input', () => {
      const spy = sinon.spy(input, 'focus');
      label.click();
      expect(spy.called).to.be.true;
    });

    it('should click input', () => {
      const spy = sinon.spy(input, 'click');
      label.click();
      expect(spy.called).to.be.true;
    });
  });

  describe('input width', () => {
    let testInput;

    before(() => {
      testInput = document.createElement('input');
      document.body.appendChild(testInput);
    });

    after(() => {
      document.body.removeChild(testInput);
    });

    beforeEach(() => {
      item.style.width = '100%';
    });

    it('should not change input width by default', () => {
      expect(input.getBoundingClientRect().width).to.be.closeTo(testInput.getBoundingClientRect().width, 10);
    });

    it('should stretch input using .full-width', () => {
      input.classList.add('full-width');
      expect(input.getBoundingClientRect().width).to.be.above(testInput.getBoundingClientRect().width + 10);

      item.setAttribute('label-position', 'top');
      expect(input.getBoundingClientRect().width).to.be.above(testInput.getBoundingClientRect().width + 10);
    });

    it('should stretch input using .full-width when label-position="top" is set', () => {
      input.classList.add('full-width');
      item.setAttribute('label-position', 'top');
      expect(input.getBoundingClientRect().width).to.be.above(testInput.getBoundingClientRect().width + 10);
    });
  });

  describe('required input', () => {
    beforeEach(async () => {
      input.required = true;
      await nextFrame();
    });

    it('should add the required attribute when input is set required', () => {
      expect(item.hasAttribute('required')).to.be.true;
    });

    it('should not add the required attribute when a removed input is set required', async () => {
      input.required = false;
      input.remove();
      await nextFrame();
      input.required = true;
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.false;
    });

    it('should not add the required attribute when input is replaced by a non-field', async () => {
      input.remove();
      const nonField = document.createElement('non-field');
      nonField.required = true;
      item.appendChild(nonField);
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.false;
    });

    it('should not remove the required attribute when a non-field is added', async () => {
      const nonField = document.createElement('non-field');
      item.appendChild(nonField);
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.true;
    });

    it('should remove the required attribute when input is set not required', async () => {
      input.required = false;
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.false;
    });

    it('should remove the required attribute when input is removed', async () => {
      input.remove();
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.false;
    });

    it('should remove the required attribute when another input is added', async () => {
      const otherInput = document.createElement('input');
      item.appendChild(otherInput);
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.false;
    });

    it('should remove the invalid attribute when input is set not required', async () => {
      item.setAttribute('invalid', '');
      input.required = false;
      await nextFrame();
      expect(item.hasAttribute('invalid')).to.be.false;
    });

    it('should remove the invalid attribute when input is removed', async () => {
      item.setAttribute('invalid', '');
      input.remove();
      await nextFrame();
      expect(item.hasAttribute('invalid')).to.be.false;
    });

    it('should remove the invalid attribute when another input is added', async () => {
      item.setAttribute('invalid', '');
      const otherInput = document.createElement('input');
      item.appendChild(otherInput);
      await nextFrame();
      expect(item.hasAttribute('invalid')).to.be.false;
    });

    ['change', 'blur'].forEach((event) => {
      it(`should add the invalid attribute on field ${event}`, () => {
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.true;
      });

      it(`should remove the invalid attribute on field ${event}`, () => {
        input.value = 'foo';
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });

      it(`should not react to ${event} after the input is set not required`, async () => {
        input.required = false;
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });

      it(`should not react to ${event} after the input is removed`, async () => {
        input.remove();
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });

      it(`should not react to ${event} after another input is added`, async () => {
        const otherInput = document.createElement('input');
        item.appendChild(otherInput);
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });
    });
  });
});
