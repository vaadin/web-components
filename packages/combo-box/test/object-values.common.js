import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { clickItem, flushComboBox, getFirstItem, getViewportItems } from './helpers.js';

describe('object values', () => {
  let comboBox, input;

  describe('label and value paths', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      input = comboBox.inputElement;

      comboBox.items = [
        { label: 'foo', custom: 'bazs', value: 'bar' },
        { label: 'baz', custom: 'bashcsdfsa', value: 'qux' },
        { label: 'zero', custom: 'zero-custom', value: 0 },
        { label: 'false', custom: 'false-custom', value: false },
        { label: 'empty string', custom: 'empty-string-custom', value: '' },
        { label: 'zero as a string', custom: 'zero-string-custom', value: '0' },
        { label: 'duplicate value 1', value: 'duplicate' },
        { label: 'duplicate value 2', value: 'duplicate' },
        { label: 'missing value 1' },
        { label: 'missing value 2' },
      ];
      await nextUpdate(comboBox);

      comboBox.open();
      await nextUpdate(comboBox);
      await nextRender();

      // FIXME: needed with Lit
      flushComboBox(comboBox);
    });

    it('should change combo-box value when value path changes', async () => {
      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      comboBox.itemValuePath = 'custom';
      await nextUpdate(comboBox);

      expect(comboBox.value).to.be.equal('bazs');
    });

    it('should use the default label property on input field', async () => {
      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('foo');
    });

    it('should use the default label property in overlay items', () => {
      expect(getFirstItem(comboBox).textContent).to.contain('foo');
    });

    it('should use the provided label property', async () => {
      comboBox.itemLabelPath = 'custom';
      await nextUpdate(comboBox);

      comboBox.value = 'bar';
      await nextUpdate(comboBox);

      expect(input.value).to.eql('bazs');
    });

    it('should use the default value property', async () => {
      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(comboBox.value).to.eql('bar');
    });

    it('should use the provided value property', async () => {
      comboBox.itemValuePath = 'custom';
      await nextUpdate(comboBox);

      clickItem(comboBox, 1);
      await nextUpdate(comboBox);

      expect(comboBox.value).to.eql('bashcsdfsa');
    });

    it('should use toString if provided label and value paths are not found', async () => {
      comboBox.items[0].toString = () => 'default';
      comboBox.itemValuePath = 'not.found';
      comboBox.itemLabelPath = 'not.found';
      await nextUpdate(comboBox);

      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('default');
      expect(comboBox.value).to.eql('default');
    });

    it('should refresh labels if the label path is changed', async () => {
      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      comboBox.itemLabelPath = 'custom';
      await nextUpdate(comboBox);

      comboBox.opened = true;
      await nextUpdate(comboBox);

      expect(input.value).to.eql('bazs');
      expect(getViewportItems(comboBox)[0].label).to.eql('bazs');
    });

    it('should use toString if default label and value paths are not found', async () => {
      comboBox.items = [{}, {}];
      comboBox.items[0].toString = () => 'default';
      await nextUpdate(comboBox);

      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('default');
      expect(comboBox.value).to.eql('default');
    });

    it('should use toString if provided label property is null', async () => {
      comboBox.items = [{ custom: null }];
      comboBox.items[0].toString = () => 'default';
      comboBox.itemLabelPath = 'custom';
      await nextUpdate(comboBox);

      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('default');
    });

    it('should set the selected item when open', async () => {
      comboBox.value = 'bar';
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql(comboBox.items[0]);
      expect(input.value).to.eql('foo');
    });

    it('should set the selected item when closed', async () => {
      comboBox.opened = false;
      await nextUpdate(comboBox);

      comboBox.value = 'bar';
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql(comboBox.items[0]);
      expect(comboBox.inputElement.value).to.eql('foo');
    });

    it('should set the value', async () => {
      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('foo');
      expect(comboBox.value).to.eql('bar');
    });

    it('should set the value even if the value is zero (number)', async () => {
      clickItem(comboBox, 2);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('zero');
      expect(comboBox.value).to.eql(0);
    });

    it('should set the value even if the value is false (boolean)', async () => {
      clickItem(comboBox, 3);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('false');
      expect(comboBox.value).to.eql(false);
    });

    it('should set the value even if the value is an empty string', async () => {
      clickItem(comboBox, 4);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('empty string');
      expect(comboBox.value).to.eql('');
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should distinguish between 0 (number) and "0" (string) values', async () => {
      clickItem(comboBox, 2);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('zero');
      expect(comboBox.value).to.eql(0);

      comboBox.open();
      await nextUpdate(comboBox);

      clickItem(comboBox, 5);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('zero as a string');
      expect(comboBox.value).to.eql('0');
    });

    it('should set the input value from item label if item is found', async () => {
      comboBox.value = 'bar';
      await nextUpdate(comboBox);

      expect(input.value).to.eql('foo');
    });

    it('should select first of duplicate values', async () => {
      comboBox.value = 'duplicate';
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql(comboBox.items[6]);
    });

    it('should select correct duplicate value', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('selected-item-changed', spy);

      clickItem(comboBox, 7);
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql(comboBox.items[7]);
      expect(comboBox.value).to.eql('duplicate');
      expect(input.value).to.eql('duplicate value 2');
      expect(spy.callCount).to.eql(1);
    });

    it('should select correct with missing value', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('selected-item-changed', spy);

      clickItem(comboBox, 9);
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql(comboBox.items[9]);
      expect(comboBox.value).to.eql(comboBox.items[9].toString());
      expect(input.value).to.eql('missing value 2');
      expect(spy.callCount).to.eql(1);
    });

    describe('custom values are not allowed', () => {
      beforeEach(async () => {
        comboBox.allowCustomValue = false;
        await nextUpdate(comboBox);
      });

      it('should clear the input value if item is not found', async () => {
        comboBox.value = 'bar';
        await nextUpdate(comboBox);

        comboBox.value = 'not found';
        await nextUpdate(comboBox);

        expect(input.value).to.empty;
      });
    });

    describe('custom values are allowed', () => {
      beforeEach(async () => {
        comboBox.allowCustomValue = true;
        await nextUpdate(comboBox);
      });

      it('should set the value as bind value if item is not found', async () => {
        comboBox.value = 'not found';
        await nextUpdate(comboBox);

        expect(input.value).to.eql('not found');
      });

      it('should set input value using provided itemLabelPath', async () => {
        comboBox.itemLabelPath = 'custom';
        await nextUpdate(comboBox);

        comboBox.value = 'bar';
        await nextUpdate(comboBox);

        expect(input.value).to.equal('bazs');
      });
    });
  });

  describe('label and value paths are undefined', () => {
    before(() => {
      sinon.stub(console, 'error');
    });

    after(() => {
      console.error.restore();
    });

    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
      input = comboBox.inputElement;
      comboBox.itemValuePath = undefined;
      comboBox.itemLabelPath = undefined;
      comboBox.items = [{}, {}];
      await nextUpdate(comboBox);
      comboBox.open();
      await nextUpdate(comboBox);
    });

    it('should use toString if provided label and value paths are undefined and then log error', async () => {
      comboBox.items[0].toString = () => 'default';

      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(input.value).to.eql('default');
      expect(comboBox.value).to.eql('default');
      expect(console.error.called).to.be.true;
    });

    it('should open the dropdown if provided label and value paths are undefined', () => {
      const overlay = comboBox.$.overlay;
      expect(window.getComputedStyle(overlay).display).not.to.eql('none');
    });
  });
});
