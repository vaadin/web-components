import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@polymer/polymer/lib/elements/custom-style.js';
import '@vaadin/custom-field';
import '@vaadin/text-field';
import '../vaadin-form-item.js';

describe('form-item', () => {
  let item, label, input;

  describe('basic features', () => {
    let labelSlot, inputSlot;

    beforeEach(() => {
      item = fixtureSync(`
        <vaadin-form-item>
          <label slot="label">Label</label>
          <input>
        </vaadin-form-item>
      `);
      label = item.querySelector('label');
      input = item.querySelector('input');
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

  describe('unique label id', () => {
    let label1, label2;

    beforeEach(async () => {
      const item1 = fixtureSync(`<vaadin-form-item><label slot="label">Label</label></vaadin-form-item>`);
      const item2 = fixtureSync(`<vaadin-form-item><label slot="label">Label</label></vaadin-form-item>`);
      label1 = item1.querySelector('label');
      label2 = item2.querySelector('label');
      await nextFrame();
    });

    it('should set a unique id on the label element', () => {
      const ID_REGEX = /^label-vaadin-form-item-\d+$/u;
      expect(label1.id).to.not.equal(label2.id);
      expect(label1.id).to.match(ID_REGEX);
      expect(label2.id).to.match(ID_REGEX);
    });
  });

  describe('label', () => {
    let labelId;

    beforeEach(async () => {
      item = fixtureSync(`
        <vaadin-form-item>
          <label slot="label">Label</label>
          <input>
        </vaadin-form-item>
      `);
      await nextFrame();
      input = item.querySelector('input');
      label = item.querySelector('label');
      labelId = label.id;
    });

    it('should focus input on label click', () => {
      const spy = sinon.spy(input, 'focus');
      label.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should click input on label click', () => {
      const spy = sinon.spy(input, 'click');
      label.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should set id to the new label element when using replaceChild', async () => {
      const newLabel = document.createElement('label');
      newLabel.slot = 'label';
      item.replaceChild(newLabel, label);
      await nextFrame();
      expect(newLabel.id).to.equal(input.getAttribute('aria-labelledby'));
    });

    it('should not set id to the new label element when using appendChild', async () => {
      const newLabel = document.createElement('label');
      newLabel.slot = 'label';
      item.appendChild(newLabel);
      await nextFrame();
      expect(label.id).to.equal(labelId);
      expect(newLabel.id).to.be.empty;
    });

    it('should set id to the new label element when using insertBefore', async () => {
      const newLabel = document.createElement('label');
      newLabel.slot = 'label';
      item.insertBefore(newLabel, label);
      await nextFrame();
      expect(newLabel.id).to.equal(input.getAttribute('aria-labelledby'));
    });

    it('should not overwrite a custom label id', async () => {
      const newLabel = document.createElement('label');
      newLabel.id = 'custom-label-id';
      newLabel.slot = 'label';
      item.replaceChild(newLabel, label);
      await nextFrame();
      expect(newLabel.id).to.equal('custom-label-id');
    });

    it('should bind the input with a custom label id ', async () => {
      const newLabel = document.createElement('label');
      newLabel.id = 'custom-label-id';
      newLabel.slot = 'label';
      item.replaceChild(newLabel, label);
      await nextFrame();
      expect(input.getAttribute('aria-labelledby')).to.equal(newLabel.id);
    });

    it('should not remove id from a label', async () => {
      const newLabel = document.createElement('label');
      newLabel.id = 'custom-label-id';
      newLabel.slot = 'label';
      item.replaceChild(newLabel, label);
      await nextFrame();
      item.replaceChild(label, newLabel);
      await nextFrame();
      expect(newLabel.id).to.equal('custom-label-id');
    });
  });

  describe('aria-labelledby', () => {
    describe('input', () => {
      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-form-item>
            <label slot="label">Label</label>
            <input aria-labelledby="custom-id">
          </vaadin-form-item>
        `);
        label = item.querySelector('label');
        input = item.querySelector('input');
        await nextFrame();
      });

      it('should link the label to the input', () => {
        expect(input.getAttribute('aria-labelledby')).to.equal(`custom-id ${label.id}`);
      });

      it('should link the label to the new input when using replaceChild', async () => {
        const newInput = document.createElement('input');
        item.replaceChild(newInput, input);
        await nextFrame();
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id');
        expect(newInput.getAttribute('aria-labelledby')).to.equal(label.id);
      });

      it('should link the label to the new input when using insertBefore', async () => {
        const newInput = document.createElement('input');
        item.insertBefore(newInput, input);
        await nextFrame();
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id');
        expect(newInput.getAttribute('aria-labelledby')).to.equal(label.id);
      });

      it('should not link the label to the new input when using appendChild', async () => {
        const newInput = document.createElement('input');
        item.appendChild(newInput);
        await nextFrame();
        expect(input.getAttribute('aria-labelledby')).to.equal(`custom-id ${label.id}`);
        expect(newInput.hasAttribute('aria-labelledby')).to.be.false;
      });

      it('should unlink the label from the input when removing the label element', async () => {
        label.remove();
        await nextFrame();
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id');
      });
    });

    describe('input without label', () => {
      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-form-item>
            <input aria-labelledby="custom-id">
          </vaadin-form-item>
        `);
        input = item.querySelector('input');
        await nextFrame();
      });

      it('should not link the label to the input when no label', () => {
        expect(input.getAttribute('aria-labelledby')).to.equal('custom-id');
      });

      it('should link the label to the input once a label element is added', async () => {
        const label = document.createElement('label');
        label.slot = 'label';
        item.appendChild(label);
        await nextFrame();
        expect(input.getAttribute('aria-labelledby')).to.equal(`custom-id ${label.id}`);
      });
    });

    describe('field', () => {
      let field, fieldInput;

      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-form-item>
            <label slot="label">Label</label>
            <vaadin-text-field>
              <input slot="input" aria-labelledby="custom-id">
            </vaadin-text-field>
          </vaadin-form-item>
        `);
        label = item.querySelector(':scope > label');
        field = item.querySelector(':scope > vaadin-text-field');
        fieldInput = field.querySelector(':scope > input');
        await nextFrame();
      });

      it('should link the label to the field input', () => {
        expect(fieldInput.getAttribute('aria-labelledby')).to.include('custom-id');
        expect(fieldInput.getAttribute('aria-labelledby')).to.include(label.id);
      });
    });

    describe('field group', () => {
      let field;

      beforeEach(async () => {
        item = fixtureSync(`
          <vaadin-form-item>
            <label slot="label">Label</label>
            <vaadin-custom-field aria-labelledby="custom-id"></vaadin-custom-field>
          </vaadin-form-item>
        `);
        label = item.querySelector(':scope > label');
        field = item.querySelector(':scope > vaadin-custom-field');
        await nextFrame();
      });

      it('should link the label to the field group', () => {
        expect(field.getAttribute('aria-labelledby')).to.include('custom-id');
        expect(field.getAttribute('aria-labelledby')).to.include(label.id);
      });
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
      item = fixtureSync(`
        <vaadin-form-item>
          <label slot="label">Label</label>
          <input>
        </vaadin-form-item>
      `);
      label = item.querySelector('label');
      input = item.querySelector('input');
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
      item = fixtureSync(`
        <vaadin-form-item>
          <label slot="label">Label</label>
          <input>
        </vaadin-form-item>
      `);
      label = item.querySelector('label');
      input = item.querySelector('input');
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
      const nonField = document.createElement('non-field');
      nonField.required = true;
      item.replaceChild(nonField, input);
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

    it('should not remove the required attribute when another input is added', async () => {
      const otherInput = document.createElement('input');
      item.appendChild(otherInput);
      await nextFrame();
      expect(item.hasAttribute('required')).to.be.true;
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

      it(`should stop listening for ${event} after the input is set not required`, async () => {
        input.required = false;
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });

      it(`should stop listening for ${event} on the input when removing it`, async () => {
        input.remove();
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });

      it(`should stop listening for ${event} on the input when replacing it with another one`, async () => {
        const otherInput = document.createElement('input');
        item.replaceChild(otherInput, input);
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.false;
      });

      it(`should keep listening for ${event} on the old input when adding a new one`, async () => {
        const otherInput = document.createElement('input');
        item.appendChild(otherInput);
        await nextFrame();
        input.dispatchEvent(new CustomEvent(event));
        expect(item.hasAttribute('invalid')).to.be.true;
      });
    });
  });

  describe('warnings', () => {
    let stub;

    beforeEach(() => {
      stub = sinon.stub(console, 'warn');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should not warn when a single field is placed to an item', async () => {
      fixtureSync(`
        <vaadin-form-item>
          <input />
        </vaadin-form-item>
      `);
      await nextFrame();

      expect(stub.calledOnce).to.be.false;
    });

    it('should warn when multiple fields are placed to an item initially', async () => {
      fixtureSync(`
        <vaadin-form-item>
          <input />
          <input />
        </vaadin-form-item>
      `);
      await nextFrame();

      expect(stub.calledOnce).to.be.true;
      expect(stub.args[0][0]).to.include(
        'WARNING: Since Vaadin 23, placing multiple fields directly to a <vaadin-form-item> is deprecated.',
      );
    });

    it('should warn when multiple fields are placed to an item dynamically', async () => {
      const item = fixtureSync(`
        <vaadin-form-item>
          <input />
        </vaadin-form-item>
      `);
      await nextFrame();

      const input = document.createElement('input');
      item.appendChild(input);
      await nextFrame();

      expect(stub.calledOnce).to.be.true;
      expect(stub.args[0][0]).to.include(
        'WARNING: Since Vaadin 23, placing multiple fields directly to a <vaadin-form-item> is deprecated.',
      );
    });
  });
});
