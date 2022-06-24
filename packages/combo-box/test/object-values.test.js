import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getFirstItem, getViewportItems, selectItem } from './helpers.js';

describe('object values', () => {
  let comboBox, input;

  describe('label and value paths', () => {
    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
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

      comboBox.open();
    });

    it('it should change combo-box value when value path changes', () => {
      selectItem(comboBox, 0);
      comboBox.itemValuePath = 'custom';
      expect(comboBox.value).to.be.equal('bazs');
    });

    it('should use the default label property on input field', () => {
      selectItem(comboBox, 0);

      expect(input.value).to.eql('foo');
    });

    it('should use the default label property in overlay items', async () => {
      await aTimeout(1);
      expect(getFirstItem(comboBox).textContent).to.contain('foo');
    });

    it('should use the provided label property', () => {
      comboBox.itemLabelPath = 'custom';

      comboBox.value = 'bar';

      expect(input.value).to.eql('bazs');
    });

    it('should use the default value property', () => {
      selectItem(comboBox, 0);

      expect(comboBox.value).to.eql('bar');
    });

    it('should use the provided value property', () => {
      comboBox.itemValuePath = 'custom';

      selectItem(comboBox, 1);

      expect(comboBox.value).to.eql('bashcsdfsa');
    });

    it('should use toString if provided label and value paths are not found', () => {
      comboBox.items[0].toString = () => 'default';
      comboBox.itemValuePath = 'not.found';
      comboBox.itemLabelPath = 'not.found';

      selectItem(comboBox, 0);

      expect(input.value).to.eql('default');
      expect(comboBox.value).to.eql('default');
    });

    it('should refresh labels if the label path is changed', () => {
      selectItem(comboBox, 0);

      comboBox.itemLabelPath = 'custom';
      comboBox.opened = true;

      expect(input.value).to.eql('bazs');
      expect(getViewportItems(comboBox)[0].label).to.eql('bazs');
    });

    it('should use toString if default label and value paths are not found', () => {
      comboBox.items = [{}, {}];
      comboBox.items[0].toString = () => 'default';

      selectItem(comboBox, 0);

      expect(input.value).to.eql('default');
      expect(comboBox.value).to.eql('default');
    });

    it('should use toString if provided label property is null', () => {
      comboBox.items = [{ custom: null }];
      comboBox.items[0].toString = () => 'default';
      comboBox.itemLabelPath = 'custom';

      selectItem(comboBox, 0);

      expect(input.value).to.eql('default');
    });

    it('should set the selected item when open', () => {
      comboBox.value = 'bar';

      expect(comboBox.selectedItem).to.eql(comboBox.items[0]);
      expect(input.value).to.eql('foo');
    });

    it('should set the selected item when closed', () => {
      comboBox.opened = false;

      comboBox.value = 'bar';

      expect(comboBox.selectedItem).to.eql(comboBox.items[0]);
      expect(comboBox.inputElement.value).to.eql('foo');
    });

    it('should set the value', () => {
      selectItem(comboBox, 0);

      expect(input.value).to.eql('foo');
      expect(comboBox.value).to.eql('bar');
    });

    it('should set the value even if the value is zero (number)', () => {
      selectItem(comboBox, 2);

      expect(input.value).to.eql('zero');
      expect(comboBox.value).to.eql(0);
    });

    it('should set the value even if the value is false (boolean)', () => {
      selectItem(comboBox, 3);

      expect(input.value).to.eql('false');
      expect(comboBox.value).to.eql(false);
    });

    it('should set the value even if the value is an empty string', () => {
      selectItem(comboBox, 4);

      expect(input.value).to.eql('empty string');
      expect(comboBox.value).to.eql('');
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });

    it('should distinguish between 0 (number) and "0" (string) values', () => {
      selectItem(comboBox, 2);
      expect(input.value).to.eql('zero');
      expect(comboBox.value).to.eql(0);

      selectItem(comboBox, 5);
      expect(input.value).to.eql('zero as a string');
      expect(comboBox.value).to.eql('0');
    });

    it('should set the input value from item label if item is found', () => {
      comboBox.value = 'bar';

      expect(input.value).to.eql('foo');
    });

    it('should select first of duplicate values', () => {
      comboBox.value = 'duplicate';

      expect(comboBox.selectedItem).to.eql(comboBox.items[6]);
    });

    it('should select correct duplicate value', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('selected-item-changed', spy);

      selectItem(comboBox, 7);

      expect(comboBox.selectedItem).to.eql(comboBox.items[7]);
      expect(comboBox.value).to.eql('duplicate');
      expect(input.value).to.eql('duplicate value 2');
      expect(spy.callCount).to.eql(1);
    });

    it('should select correct with missing value', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('selected-item-changed', spy);

      selectItem(comboBox, 9);

      expect(comboBox.selectedItem).to.eql(comboBox.items[9]);
      expect(comboBox.value).to.eql(comboBox.items[9].toString());
      expect(input.value).to.eql('missing value 2');
      expect(spy.callCount).to.eql(1);
    });

    describe('custom values are not allowed', () => {
      beforeEach(() => {
        comboBox.allowCustomValue = false;
      });

      it('should clear the input value if item is not found', () => {
        comboBox.value = 'bar';

        comboBox.value = 'not found';

        expect(input.value).to.empty;
      });
    });

    describe('custom values are allowed', () => {
      beforeEach(() => {
        comboBox.allowCustomValue = true;
      });

      it('should set the value as bind value if item is not found', () => {
        comboBox.value = 'not found';

        expect(input.value).to.eql('not found');
      });

      it('should set input value using provided itemLabelPath', () => {
        comboBox.itemLabelPath = 'custom';

        comboBox.value = 'bar';

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

    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      input = comboBox.inputElement;
      comboBox.itemValuePath = undefined;
      comboBox.itemLabelPath = undefined;
      comboBox.items = [{}, {}];
      comboBox.open();
    });

    it('should use toString if provided label and value paths are undefined and then log error', () => {
      comboBox.items[0].toString = () => 'default';

      selectItem(comboBox, 0);

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
