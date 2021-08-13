import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getViewportItems } from './helpers.js';

describe('Properties', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
  });

  describe('direction attribute', () => {
    it('should preserve and propagate dir to the dropdown overlay', () => {
      comboBox.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('dir', 'rtl');
      comboBox.items = ['foo', 'bar'];
      comboBox.open();
      expect(comboBox.$.overlay.$.dropdown.$.overlay.getAttribute('dir')).to.eql('ltr');
      document.documentElement.removeAttribute('dir');
    });
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

    it('should set focused index on items set', () => {
      comboBox.value = 'bar';

      comboBox.items = ['foo', 'bar'];

      expect(comboBox._focusedIndex).to.eql(1);
    });

    it('should set focused index on mutation', () => {
      comboBox.value = 'baz';
      comboBox.items = ['foo', 'bar'];

      comboBox.push('items', 'baz');

      expect(comboBox._focusedIndex).to.eql(2);
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
      expect(comboBox.inputElement.value).to.eql('foo');
    });

    it('should be able to be set before object items', () => {
      const item = { label: 'foo', value: 1 };
      comboBox.value = 1;

      comboBox.items = [item];

      expect(comboBox.selectedItem).to.eql(item);
      expect(comboBox.inputElement.value).to.eql('foo');
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
    it('should work with the allowed pattern', () => {
      comboBox.pattern = '[0-9]*';
      comboBox.allowCustomValue = true;
      comboBox.value = 'foo';
      expect(comboBox.validate()).to.be.false;
    });
  });

  describe('has-value attribute', () => {
    it('should be updated when setting the value', () => {
      comboBox.value = 'foo';
      expect(comboBox.hasAttribute('has-value')).to.be.true;
    });
  });

  describe('allowCustomValue property', () => {
    beforeEach(() => {
      comboBox.items = [];
      comboBox.allowCustomValue = true;
    });

    it('should set bind value after setting value property', () => {
      comboBox.value = 'foo';

      expect(comboBox.inputElement.value).to.eql('foo');
    });

    it('should set value after setting a custom input value', () => {
      comboBox.open();
      comboBox.inputElement.value = 'foo';
      comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
      comboBox.close();

      expect(comboBox.value).to.eql('foo');
    });

    it('should keep custom value after entering label matching to an item, blurring that item and closing overlay', () => {
      comboBox.items = ['a', 'b'];

      comboBox.open();
      comboBox.inputElement.value = 'foo';
      comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
      comboBox.close();

      comboBox.open();
      comboBox.inputElement.value = 'a';
      comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
      comboBox._focusedIndex = -1;
      comboBox.close();

      expect(comboBox.value).to.eql('foo');
      expect(comboBox.inputElement.value).to.eql('foo');
    });

    describe('`custom-value-set` event', () => {
      beforeEach(() => (comboBox.items = ['a', 'b']));

      it('should be fired when custom value is set', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        comboBox.inputElement.value = 'foo';
        comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
        comboBox.close();

        expect(spy.callCount).to.eql(1);
      });

      it('should not be fired when custom values are not allowed', () => {
        comboBox.allowCustomValue = false;

        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        comboBox.inputElement.value = 'foo';
        comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
        comboBox.close();

        expect(spy.callCount).to.eql(0);
      });

      it('should be cancelable', () => {
        comboBox.addEventListener('custom-value-set', (e) => e.preventDefault());

        comboBox.open();
        comboBox.inputElement.value = 'foo';
        comboBox.inputElement.dispatchEvent(new CustomEvent('input'));
        comboBox.close();
        expect(comboBox.value).to.be.empty;
      });

      it('should not be fired when clicking an item', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        comboBox.inputElement.value = 'a';
        comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item').click();
        expect(spy.called).to.be.false;
      });

      it('should not be fired when existing item is entered and overlay is closed', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        comboBox.inputElement.value = 'a';
        comboBox.close();
        comboBox.inputElement.blur();
        expect(spy.called).to.be.false;
      });
    });
  });

  describe('label property', () => {
    it('should have undefined by default', () => {
      expect(comboBox.label).to.be.undefined;
    });

    it('should be bound to label element', () => {
      comboBox.label = 'This is LABEL';
      expect(comboBox.$.input.root.querySelector('label').innerHTML).to.eql('This is LABEL');
    });
  });

  describe('selectedItem property', () => {
    beforeEach(() => (comboBox.items = ['foo']));

    it('should have null by default', () => {
      expect(comboBox.selectedItem).to.be.undefined;
    });

    it('should set value and input', () => {
      comboBox.selectedItem = 'foo';

      expect(comboBox.value).to.eql('foo');
      expect(comboBox.inputElement.value).to.eql('foo');
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

    it('should be null after clearing the value', () => {
      comboBox.value = 'foo';

      comboBox._clear();

      expect(comboBox.selectedItem).to.be.null;
    });

    it('should not open the overlay after clearing the value', () => {
      comboBox.open();
      comboBox.close();

      const overlayElement = comboBox.$.overlay.$.dropdown.$.overlay;
      comboBox.value = 'foo';

      comboBox._clear();

      expect(overlayElement.opened).not.to.be.true;
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

    describe('touch devices', () => {
      beforeEach(() => {
        comboBox.open();
        comboBox.close();
      });

      it('should blur the input on touchend', () => {
        comboBox.focus();

        const spy = sinon.spy(comboBox.inputElement, 'blur');
        comboBox.$.overlay.$.dropdown.$.overlay.dispatchEvent(new CustomEvent('touchend'));
        expect(spy.callCount).to.eql(1);
      });

      it('should blur the input on touchmove', () => {
        comboBox.focus();

        const spy = sinon.spy(comboBox.inputElement, 'blur');
        comboBox.$.overlay.$.dropdown.$.overlay.dispatchEvent(new CustomEvent('touchmove'));
        expect(spy.callCount).to.eql(1);
      });

      it('should not blur the input on touchstart', () => {
        comboBox.focus();

        const spy = sinon.spy(comboBox.inputElement, 'blur');
        comboBox.$.overlay.$.dropdown.$.overlay.dispatchEvent(new CustomEvent('touchstart'));
        expect(spy.callCount).to.eql(0);
      });
    });
  });

  describe('clear button', () => {
    it('should not have clear-button-visible by default', () => {
      expect(comboBox.clearButtonVisible).to.equal(false);
      expect(comboBox.inputElement.clearButtonVisible).to.equal(false);
    });
  });

  describe('helper text', () => {
    it('should display the helper text when provided', () => {
      comboBox.helperText = 'Foo';
      expect(comboBox.inputElement.helperText).to.equal(comboBox.helperText);
    });
  });
});

describe('inside flexbox', () => {
  let container;

  beforeEach(() => {
    container = fixtureSync(`
      <div style="display: flex; flex-direction: column; width:500px;">
        <vaadin-combo-box></vaadin-combo-box>
      </div>
    `);
  });

  it('combo-box should stretch to fit the flex container', () => {
    const combobox = container.querySelector('vaadin-combo-box');
    expect(window.getComputedStyle(container).width).to.eql('500px');
    expect(window.getComputedStyle(combobox).width).to.eql('500px');
  });
});

describe('slots', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync(`
      <vaadin-combo-box>
        <div slot="prefix">foo</div>
        <div slot="helper">bar</div>
      </vaadin-combo-box>
    `);
    await nextFrame();
  });

  it('should expose the text-field prefix slot', () => {
    const slot = comboBox.inputElement.querySelector('slot[name=prefix]');
    expect(slot.assignedNodes()[0].textContent).to.eql('foo');
  });

  it('should expose the text-field helper slot', () => {
    const slot = comboBox.inputElement.querySelector('[slot="helper"]');
    expect(slot.assignedNodes()[0].textContent).to.eql('bar');
  });
});

describe('theme attribute', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box theme="foo"></vaadin-combo-box>');
  });

  it('should propagate theme attribute to text-field', () => {
    expect(comboBox.inputElement.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to overlay', () => {
    comboBox.open();
    comboBox.close();

    expect(comboBox.$.overlay.$.dropdown.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to item', () => {
    comboBox.items = ['bar', 'baz'];
    comboBox.open();
    expect(comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item').getAttribute('theme')).to.equal('foo');
  });
});

describe('clear-button-visible', () => {
  let comboBox, clearButton;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box clear-button-visible></vaadin-combo-box>');
    clearButton = comboBox.inputElement.$.clearButton;
  });

  it('should propagate clear-button-visible attribute to text-field', () => {
    expect(comboBox.clearButtonVisible).to.be.true;
    expect(comboBox.inputElement.clearButtonVisible).to.nested.true;
  });

  it('clear button should be hidden when disabled', () => {
    comboBox.disabled = true;
    expect(getComputedStyle(clearButton).display).to.equal('none');
  });

  it('clear button should be hidden when read-only', () => {
    comboBox.readonly = true;
    expect(getComputedStyle(clearButton).display).to.equal('none');
  });
});
