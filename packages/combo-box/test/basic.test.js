import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getFirstItem, getViewportItems } from './helpers.js';

describe('Properties', () => {
  let comboBox, overlay, input;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
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

    it('should set focused index on items set', () => {
      comboBox.value = 'bar';

      comboBox.items = ['foo', 'bar'];

      expect(comboBox._focusedIndex).to.eql(1);
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

    it('should support preventInvalidInput property', () => {
      comboBox.pattern = '[0-9]*';
      comboBox.preventInvalidInput = true;
      input.value = 'foo';
      input.dispatchEvent(new CustomEvent('input'));
      expect(comboBox.value).to.equal('');
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

      expect(input.value).to.eql('foo');
    });

    it('should set value after setting a custom input value', () => {
      comboBox.open();
      input.value = 'foo';
      input.dispatchEvent(new CustomEvent('input'));
      comboBox.close();

      expect(comboBox.value).to.eql('foo');
    });

    it('should keep custom value after entering label matching to an item, blurring that item and closing overlay', () => {
      comboBox.items = ['a', 'b'];

      comboBox.open();
      input.value = 'foo';
      input.dispatchEvent(new CustomEvent('input'));
      comboBox.close();

      comboBox.open();
      input.value = 'a';
      input.dispatchEvent(new CustomEvent('input'));
      comboBox._focusedIndex = -1;
      comboBox.close();

      expect(comboBox.value).to.eql('foo');
      expect(input.value).to.eql('foo');
    });

    describe('custom-value-set event', () => {
      beforeEach(() => (comboBox.items = ['a', 'b']));

      it('should be fired when custom value is set', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        input.value = 'foo';
        input.dispatchEvent(new CustomEvent('input'));
        comboBox.close();

        expect(spy.callCount).to.eql(1);
      });

      it('should not be fired when custom values are not allowed', () => {
        comboBox.allowCustomValue = false;

        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        input.value = 'foo';
        input.dispatchEvent(new CustomEvent('input'));
        comboBox.close();

        expect(spy.callCount).to.eql(0);
      });

      it('should be fired when combo-box is read-only', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.readonly = true;
        input.value = 'foo';
        comboBox.focus();
        focusout(comboBox);

        expect(spy.called).to.be.false;
      });

      it('should be cancelable', () => {
        comboBox.addEventListener('custom-value-set', (e) => e.preventDefault());

        comboBox.open();
        input.value = 'foo';
        input.dispatchEvent(new CustomEvent('input'));
        comboBox.close();
        expect(comboBox.value).to.be.empty;
      });

      it('should not be fired when clicking an item', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        input.value = 'a';
        getFirstItem(comboBox).click();
        expect(spy.called).to.be.false;
      });

      it('should not be fired when existing item is entered and overlay is closed', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        input.value = 'a';
        comboBox.close();
        input.blur();
        expect(spy.called).to.be.false;
      });

      it('should not fire when the custom value equals the label of the selected item', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);
        comboBox.selectedItem = {
          label: 'foo',
          value: 'bar',
        };

        comboBox.open();
        input.value = 'foo';
        comboBox.close();

        expect(spy.called).to.be.false;
      });

      it('should fire when the custom value equals the value of the selected item', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);
        comboBox.selectedItem = {
          label: 'foo',
          value: 'bar',
        };

        comboBox.open();
        input.value = 'bar';
        comboBox.close();

        expect(spy.calledOnce).to.be.true;
      });

      it('should not fire twice when the custom value set listener causes blur', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        // Emulate opening the overlay that causes blur
        comboBox.addEventListener('custom-value-set', () => {
          comboBox.blur();
        });

        comboBox.open();
        input.value = 'foo';
        input.dispatchEvent(new CustomEvent('input'));
        comboBox.close();

        expect(spy.calledOnce).to.be.true;
      });

      it('should fire twice when another custom value is committed by the user', () => {
        const spy = sinon.spy();
        comboBox.addEventListener('custom-value-set', spy);

        comboBox.open();
        input.value = 'foo';
        input.dispatchEvent(new CustomEvent('input'));
        comboBox.close();

        input.value = 'bar';
        input.dispatchEvent(new CustomEvent('input'));
        focusout(input);

        expect(spy.calledTwice).to.be.true;
      });
    });
  });

  describe('label property', () => {
    it('should have undefined by default', () => {
      expect(comboBox.label).to.be.undefined;
    });

    it('should be set label element text content', () => {
      comboBox.label = 'Label';
      expect(comboBox.querySelector('[slot="label"]').textContent).to.eql('Label');
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

    it('should be null after clearing the value', () => {
      comboBox.value = 'foo';

      comboBox._clear();

      expect(comboBox.selectedItem).to.be.null;
    });

    it('should not open the overlay after clearing the value', () => {
      comboBox.value = 'foo';

      comboBox._clear();

      expect(overlay.opened).not.to.be.true;
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

    it('should focus on required indicator click', () => {
      comboBox.required = true;
      comboBox.autoOpenDisabled = true;
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

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box>
        <div slot="prefix">foo</div>
        <div slot="helper">bar</div>
      </vaadin-combo-box>
    `);
  });

  it('should expose the prefix slot', () => {
    const slot = comboBox.shadowRoot.querySelector('slot[name="prefix"]');
    expect(slot.assignedNodes()[0].textContent).to.eql('foo');
  });

  it('should expose the helper slot', () => {
    const slot = comboBox.shadowRoot.querySelector('slot[name="helper"]');
    expect(slot.assignedNodes()[0].textContent).to.eql('bar');
  });
});

describe('theme attribute', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-combo-box theme="foo"></vaadin-combo-box>');
  });

  it('should propagate theme attribute to overlay', () => {
    expect(comboBox.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to item', () => {
    comboBox.items = ['bar', 'baz'];
    comboBox.open();
    expect(getFirstItem(comboBox).getAttribute('theme')).to.equal('foo');
  });
});

describe('clear button', () => {
  let comboBox, clearButton;

  describe('default', () => {
    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    });

    it('should not have clear button visible by default', () => {
      expect(comboBox.clearButtonVisible).to.be.false;
    });
  });

  describe('visible', () => {
    beforeEach(() => {
      comboBox = fixtureSync('<vaadin-combo-box clear-button-visible></vaadin-combo-box>');
      clearButton = comboBox.$.clearButton;
    });

    it('should reflect clear-button-visible attribute to property', () => {
      expect(comboBox.clearButtonVisible).to.be.true;
    });

    it('should hide clear button should when disabled', () => {
      comboBox.disabled = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should hide clear button when readonly', () => {
      comboBox.readonly = true;
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

  it('should set value to the input when added to the DOM', () => {
    comboBox.items = ['a', 'b'];
    comboBox.value = 'a';
    document.body.appendChild(comboBox);
    expect(comboBox.inputElement.value).to.equal('a');
  });
});

describe('pre-opened', () => {
  it('should not throw error when adding a pre-opened combo-box', () => {
    expect(() => fixtureSync(`<vaadin-combo-box opened items="[0]"></vaadin-combo-box>`)).to.not.throw(Error);
  });

  it('should have overlay with correct width', () => {
    const comboBox = fixtureSync(`<vaadin-combo-box opened items="[0]"></vaadin-combo-box>`);
    const expectedOverlayWidth = comboBox.clientWidth;
    const actualOverlayWidth = comboBox.$.overlay.$.content.clientWidth;
    expect(actualOverlayWidth).to.eq(expectedOverlayWidth);
  });
});
