import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, focusout, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { clickItem, setInputValue } from './helpers.js';

describe('events', () => {
  let comboBox;

  describe('custom-value-set event', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.allowCustomValue = true;
      comboBox.items = ['a', 'b'];
      await nextRender();
      comboBox.inputElement.focus();
    });

    it('should be fired when custom value is set', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();

      expect(spy.callCount).to.eql(1);
    });

    it('should not be fired when custom values are not allowed', () => {
      comboBox.allowCustomValue = false;

      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();

      expect(spy.callCount).to.eql(0);
    });

    it('should not be fired when combo-box is read-only', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.readonly = true;
      setInputValue(comboBox, 'foo');
      comboBox.focus();
      focusout(comboBox);

      expect(spy.called).to.be.false;
    });

    it('should be cancelable', () => {
      comboBox.addEventListener('custom-value-set', (e) => e.preventDefault());

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();
      expect(comboBox.value).to.be.empty;
    });

    it('should not be fired when clicking an item', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      setInputValue(comboBox, 'a');
      clickItem(comboBox, 0);
      expect(spy.called).to.be.false;
    });

    it('should not be fired when existing item is entered and overlay is closed', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      setInputValue(comboBox, 'a');
      outsideClick();
      expect(spy.called).to.be.false;
    });

    it('should not be fired when the custom value equals the label of the selected item', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      comboBox.selectedItem = {
        label: 'foo',
        value: 'bar',
      };

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();

      expect(spy.called).to.be.false;
    });

    it('should be fired when the custom value equals the value of the selected item', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      comboBox.selectedItem = {
        label: 'foo',
        value: 'bar',
      };

      comboBox.open();
      setInputValue(comboBox, 'bar');
      outsideClick();

      expect(spy.calledOnce).to.be.true;
    });

    it('should not be fired twice when the custom value set listener causes blur', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      // Emulate opening the overlay that causes blur
      comboBox.addEventListener('custom-value-set', () => {
        comboBox.blur();
      });

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();

      expect(spy.calledOnce).to.be.true;
    });

    it('should be fired twice when another custom value is committed by the user', () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();

      comboBox.inputElement.focus();
      setInputValue(comboBox, 'bar');
      outsideClick();
      focusout(comboBox.inputElement);

      expect(spy.calledTwice).to.be.true;
    });
  });
});
