import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { flushComboBox, getViewportItems, setInputValue } from './helpers.js';

describe('Properties', () => {
  let comboBox, overlay, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    overlay = comboBox.$.overlay;
    input = comboBox.inputElement;
  });

  describe('items property', () => {
    it('should have undefined by default', () => {
      expect(comboBox.items).to.be.undefined;
    });

    it('should update items list on update', async () => {
      comboBox.opened = true;
      comboBox.items = [];
      await nextUpdate(comboBox);

      comboBox.items = ['foo'];
      await nextUpdate(comboBox);

      expect(getViewportItems(comboBox).length).to.eql(1);
    });

    it('should support resetting items', async () => {
      comboBox.items = ['foo', 'bar'];
      comboBox.opened = true;
      await nextUpdate(comboBox);
      expect(getViewportItems(comboBox).length).to.eql(2);

      comboBox.items = undefined;
      await nextUpdate(comboBox);
      expect(getViewportItems(comboBox).length).to.eql(0);
    });
  });

  describe('visible item count', () => {
    it('should calculate items correctly when all items are visible', async () => {
      comboBox.items = ['foo', 'bar', 'baz', 'qux'];
      comboBox.open();
      await nextUpdate(comboBox);
      flushComboBox(comboBox);
      expect(getViewportItems(comboBox).length).to.equal(4);
      expect(getViewportItems(comboBox).pop().index).to.equal(3);
    });
  });

  describe('value property', () => {
    it('should have empty string by default', () => {
      expect(comboBox.value).to.eql('');
    });

    it('should be able to be set before items', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.items = ['foo', 'bar'];
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql('foo');
      expect(input.value).to.eql('foo');
    });

    it('should be able to be set before object items', async () => {
      const item = { label: 'foo', value: 1 };
      comboBox.value = 1;
      await nextUpdate(comboBox);

      comboBox.items = [item];
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.eql(item);
      expect(input.value).to.eql('foo');
    });

    it('should be empty string when setting invalid value multiple times', async () => {
      const spy = sinon.spy(comboBox, '_selectedItemChanged');
      comboBox.items = [];
      await nextUpdate(comboBox);
      expect(spy.callCount).to.eql(0);

      comboBox.value = 1;
      await nextUpdate(comboBox);
      expect(comboBox.value).to.eql('');
      expect(spy.callCount).to.eql(1);

      comboBox.value = 2;
      await nextUpdate(comboBox);
      expect(comboBox.value).to.eql('');
      expect(spy.callCount).to.eql(2);

      comboBox.items = ['foo'];
      await nextUpdate(comboBox);
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      expect(comboBox.value).to.eql('foo');
      expect(spy.callCount).to.eql(3);
    });
  });

  describe('pattern property', () => {
    beforeEach(() => {
      comboBox.allowCustomValue = true;
    });

    it('should work with the allowed pattern', async () => {
      comboBox.pattern = '[0-9]*';
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      expect(comboBox.validate()).to.be.false;
    });
  });

  describe('has-value attribute', () => {
    it('should be updated when setting the value', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });
  });

  describe('allowCustomValue property', () => {
    beforeEach(async () => {
      comboBox.items = [];
      comboBox.allowCustomValue = true;
      await nextUpdate(comboBox);
      input.focus();
    });

    it('should set bind value after setting value property', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);
      expect(input.value).to.eql('foo');
    });

    it('should set value after setting a custom input value', async () => {
      comboBox.open();
      await nextUpdate(comboBox);

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(comboBox.value).to.eql('foo');
    });

    it('should keep custom value after entering label matching to an item, blurring that item and closing overlay', async () => {
      comboBox.items = ['a', 'b'];
      await nextUpdate(comboBox);

      comboBox.open();
      await nextUpdate(comboBox);
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);
      outsideClick();
      await nextUpdate(comboBox);

      comboBox.open();
      await nextUpdate(comboBox);
      setInputValue(comboBox, 'a');
      await nextUpdate(comboBox);
      comboBox._focusedIndex = -1;
      outsideClick();
      await nextUpdate(comboBox);

      expect(comboBox.value).to.eql('foo');
      expect(input.value).to.eql('foo');
    });
  });

  describe('label property', () => {
    it('should have undefined by default', () => {
      expect(comboBox.label).to.be.undefined;
    });

    it('should be set label element text content', async () => {
      comboBox.label = 'Label';
      await nextUpdate(comboBox);
      expect(comboBox.querySelector('[slot="label"]').textContent).to.eql('Label');
    });
  });

  describe('selectedItem property', () => {
    beforeEach(async () => {
      comboBox.items = ['foo'];
      await nextUpdate(comboBox);
    });

    it('should have null by default', () => {
      expect(comboBox.selectedItem).to.be.undefined;
    });

    it('should set value and input', async () => {
      comboBox.selectedItem = 'foo';
      await nextUpdate(comboBox);

      expect(comboBox.value).to.eql('foo');
      expect(input.value).to.eql('foo');
    });

    it('should default back to null when value set to undefined', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.value = undefined;
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.be.null;
    });

    it('should default back to null when value is set to null', async () => {
      comboBox.value = null;
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.be.null;
    });

    it('should be null after clearing the value', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.$.clearButton.click();
      await nextUpdate(comboBox);

      expect(comboBox.selectedItem).to.be.null;
    });

    it('should not open the overlay after clearing the value', async () => {
      comboBox.value = 'foo';
      await nextUpdate(comboBox);

      comboBox.$.clearButton.click();
      await nextUpdate(comboBox);

      expect(overlay.opened).not.to.be.true;
    });

    describe('autoselect', () => {
      it('should set autoselect to false by default', () => {
        expect(comboBox.autoselect).to.be.false;
      });

      it('should not select content on focus when autoselect is false', async () => {
        const spy = sinon.spy(input, 'select');
        comboBox.value = 'foo';
        await nextUpdate(comboBox);
        input.focus();
        expect(spy.called).to.be.false;
      });

      it('should select content on focus when autoselect is true', async () => {
        const spy = sinon.spy(input, 'select');
        comboBox.value = 'foo';
        comboBox.autoselect = true;
        await nextUpdate(comboBox);
        input.focus();
        expect(spy.calledOnce).to.be.true;
      });
    });
  });

  describe('focus API', () => {
    it('should not be focused by default', () => {
      expect(comboBox.hasAttribute('focused')).to.be.false;
    });

    it('should not throw on focusout', () => {
      expect(() => comboBox.dispatchEvent(new Event('focusout'))).not.to.throw(Error);
    });

    it('should focus the input with focus method', () => {
      comboBox.focus();

      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    it('should blur the input with the blur method', () => {
      comboBox.focus();
      comboBox.blur();

      expect(comboBox.hasAttribute('focused')).to.be.false;
    });

    it('should focus on required indicator click', async () => {
      comboBox.required = true;
      comboBox.autoOpenDisabled = true;
      await nextUpdate(comboBox);
      comboBox.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    describe('touch devices', () => {
      it('should blur the input on touchend', () => {
        comboBox.focus();

        const spy = sinon.spy(input, 'blur');
        overlay.dispatchEvent(new CustomEvent('touchend'));
        expect(spy.callCount).to.eql(1);
      });

      it('should blur the input on touchmove', () => {
        comboBox.focus();

        const spy = sinon.spy(input, 'blur');
        overlay.dispatchEvent(new CustomEvent('touchmove'));
        expect(spy.callCount).to.eql(1);
      });

      it('should not blur the input on touchstart', () => {
        comboBox.focus();

        const spy = sinon.spy(input, 'blur');
        overlay.dispatchEvent(new CustomEvent('touchstart'));
        expect(spy.callCount).to.eql(0);
      });
    });
  });

  describe('dir attribute', () => {
    it('should preserve and propagate dir to the dropdown overlay', async () => {
      comboBox.setAttribute('dir', 'ltr');
      await nextUpdate(comboBox);
      document.documentElement.setAttribute('dir', 'rtl');
      comboBox.items = ['foo', 'bar'];
      comboBox.open();
      await nextUpdate(comboBox);
      expect(overlay.getAttribute('dir')).to.eql('ltr');
      document.documentElement.removeAttribute('dir');
    });
  });
});

describe('inside flexbox', () => {
  let container;

  beforeEach(async () => {
    container = fixtureSync(`
      <div style="display: flex; flex-direction: column; width:500px;">
        <vaadin-combo-box></vaadin-combo-box>
      </div>
    `);
    await nextRender();
  });

  it('combo-box should stretch to fit the flex container', () => {
    const combobox = container.querySelector('vaadin-combo-box');
    expect(window.getComputedStyle(container).width).to.eql('500px');
    expect(window.getComputedStyle(combobox).width).to.eql('500px');
  });
});

describe('clear button', () => {
  let comboBox, clearButton;

  describe('default', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      await nextRender();
    });

    it('should not have clear button visible by default', () => {
      expect(comboBox.clearButtonVisible).to.be.false;
    });
  });

  describe('visible', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box clear-button-visible></vaadin-combo-box>');
      await nextRender();
      clearButton = comboBox.$.clearButton;
    });

    it('should reflect clear-button-visible attribute to property', () => {
      expect(comboBox.clearButtonVisible).to.be.true;
    });

    it('should hide clear button should when disabled', async () => {
      comboBox.disabled = true;
      await nextUpdate(comboBox);
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should hide clear button when readonly', async () => {
      comboBox.readonly = true;
      await nextUpdate(comboBox);
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });
  });
});

describe('value set before attach', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = document.createElement('vaadin-combo-box');
  });

  afterEach(() => {
    comboBox.remove();
  });

  it('should set value to the input when added to the DOM', async () => {
    comboBox.items = ['a', 'b'];
    comboBox.value = 'a';
    document.body.appendChild(comboBox);
    await nextRender();
    expect(comboBox.inputElement.value).to.equal('a');
  });
});

describe('pre-opened', () => {
  it('should not throw error when adding a pre-opened combo-box', () => {
    expect(() => fixtureSync(`<vaadin-combo-box opened></vaadin-combo-box>`)).to.not.throw(Error);
  });

  it('should not throw error when adding a pre-opened combo-box with items', () => {
    expect(() => fixtureSync(`<vaadin-combo-box opened items="[0]"></vaadin-combo-box>`)).to.not.throw(Error);
  });

  // FIXME: throws an error, could be probably considered unsupported
  it.skip('should have overlay with correct width', () => {
    const comboBox = fixtureSync(`<vaadin-combo-box opened items="[0]"></vaadin-combo-box>`);
    const expectedOverlayWidth = comboBox.clientWidth;
    const actualOverlayWidth = comboBox.$.overlay.$.content.clientWidth;
    expect(actualOverlayWidth).to.eq(expectedOverlayWidth);
  });

  // FIXME: throws an error, could be probably considered unsupported
  it.skip('should have overlay with correct width', () => {
    const comboBox = fixtureSync(`
      <vaadin-combo-box
        opened
        items="[0]"
        style="--vaadin-combo-box-overlay-max-height: 200px"
      ></vaadin-combo-box>`);
    const scroller = comboBox.$.overlay.querySelector('vaadin-combo-box-scroller');
    expect(scroller.style.maxHeight).to.equal('200px');
  });
});
