import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { getViewportItems, setInputValue } from './helpers.js';

describe('basic features', () => {
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

    it('should update items list on update', () => {
      comboBox.opened = true;
      comboBox.items = [];
      comboBox.items = ['foo'];
      expect(getViewportItems(comboBox).length).to.eql(1);
    });

    it('should support resetting items', () => {
      comboBox.items = ['foo', 'bar'];
      comboBox.items = undefined;
      comboBox.opened = true;
      expect(getViewportItems(comboBox).length).to.eql(0);
    });
  });

  describe('visible item count', () => {
    it('should calculate items correctly when all items are visible', () => {
      comboBox.items = ['foo', 'bar', 'baz', 'qux'];
      comboBox.open();
      expect(getViewportItems(comboBox).length).to.equal(4);
      expect(getViewportItems(comboBox).pop().index).to.equal(3);
    });
  });

  describe('value property', () => {
    it('should have empty string by default', () => {
      expect(comboBox.value).to.eql('');
    });

    it('should be able to be set before items', () => {
      comboBox.value = 'foo';

      comboBox.items = ['foo', 'bar'];

      expect(comboBox.selectedItem).to.eql('foo');
      expect(input.value).to.eql('foo');
    });

    it('should be able to be set before object items', () => {
      const item = { label: 'foo', value: 1 };
      comboBox.value = 1;

      comboBox.items = [item];

      expect(comboBox.selectedItem).to.eql(item);
      expect(input.value).to.eql('foo');
    });

    it('should be empty string when setting invalid value multiple times', () => {
      const spy = sinon.spy(comboBox, '_selectedItemChanged');
      comboBox.items = [];
      expect(spy.callCount).to.eql(0);

      comboBox.value = 1;
      expect(comboBox.value).to.eql('');
      expect(spy.callCount).to.eql(1);

      comboBox.value = 2;
      expect(comboBox.value).to.eql('');
      expect(spy.callCount).to.eql(2);

      comboBox.items = ['foo'];
      comboBox.value = 'foo';
      expect(comboBox.value).to.eql('foo');
      expect(spy.callCount).to.eql(3);
    });
  });

  describe('pattern property', () => {
    beforeEach(() => {
      comboBox.allowCustomValue = true;
    });

    it('should work with the allowed pattern', () => {
      comboBox.pattern = '[0-9]*';
      comboBox.value = 'foo';
      expect(comboBox.validate()).to.be.false;
    });
  });

  describe('allowCustomValue property', () => {
    beforeEach(() => {
      comboBox.items = [];
      comboBox.allowCustomValue = true;
      input.focus();
    });

    it('should set input value after setting value property', () => {
      comboBox.value = 'foo';

      expect(input.value).to.eql('foo');
    });

    it('should set value after setting a custom input value', () => {
      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();
      expect(comboBox.value).to.eql('foo');
    });

    it('should keep custom value after entering label matching to an item, blurring that item and closing overlay', () => {
      comboBox.items = ['a', 'b'];

      comboBox.open();
      setInputValue(comboBox, 'foo');
      outsideClick();

      comboBox.open();
      setInputValue(comboBox, 'a');
      comboBox._focusedIndex = -1;
      outsideClick();

      expect(comboBox.value).to.eql('foo');
      expect(input.value).to.eql('foo');
    });
  });

  describe('selectedItem property', () => {
    beforeEach(() => {
      comboBox.items = ['foo'];
    });

    it('should have null by default', () => {
      expect(comboBox.selectedItem).to.be.undefined;
    });

    it('should set value and input', () => {
      comboBox.selectedItem = 'foo';

      expect(comboBox.value).to.eql('foo');
      expect(input.value).to.eql('foo');
    });

    it('should default back to null when value set to undefined', () => {
      comboBox.value = 'foo';

      comboBox.value = undefined;

      expect(comboBox.selectedItem).to.be.null;
    });

    it('should default back to null when value is set to null', () => {
      comboBox.value = null;

      expect(comboBox.selectedItem).to.be.null;
    });

    describe('autoselect', () => {
      it('should set autoselect to false by default', () => {
        expect(comboBox.autoselect).to.be.false;
      });

      it('should not select content on focus when autoselect is false', () => {
        const spy = sinon.spy(input, 'select');
        comboBox.value = 'foo';
        input.focus();
        expect(spy.called).to.be.false;
      });

      it('should select content on focus when autoselect is true', () => {
        const spy = sinon.spy(input, 'select');
        comboBox.value = 'foo';
        comboBox.autoselect = true;
        input.focus();
        expect(spy.calledOnce).to.be.true;
      });
    });
  });

  describe('dir attribute', () => {
    it('should preserve and propagate dir to the dropdown overlay', () => {
      comboBox.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('dir', 'rtl');
      comboBox.items = ['foo', 'bar'];
      comboBox.open();
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

  it('should have overlay with correct width', async () => {
    const comboBox = fixtureSync(`<vaadin-combo-box opened items="[0]"></vaadin-combo-box>`);
    await nextRender();
    const expectedOverlayWidth = comboBox.clientWidth;
    const actualOverlayWidth = comboBox.$.overlay.$.overlay.offsetWidth;
    expect(actualOverlayWidth).to.eq(expectedOverlayWidth);
  });

  it('should have scroller with correct max height', async () => {
    const comboBox = fixtureSync(`
      <vaadin-combo-box
        opened
        items="[0]"
        style="--vaadin-combo-box-overlay-max-height: 200px"
      ></vaadin-combo-box>`);
    await nextRender();
    const scroller = comboBox.querySelector('vaadin-combo-box-scroller');
    expect(scroller.style.maxHeight).to.equal('200px');
  });
});
