import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextUpdate, oneEvent, outsideClick } from '@vaadin/testing-helpers';
import '@vaadin/combo-box';
import '@vaadin/dialog';

function dispatchMouseEvent(target, type) {
  target.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true, composed: true }));
}

describe('combo-box in dialog', () => {
  let dialog, comboBox;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextUpdate(dialog);
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-combo-box></vaadin-combo-box>';
    };
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    comboBox = dialog.querySelector('vaadin-combo-box');
    comboBox.items = ['foo', 'bar'];
    comboBox.inputElement.focus();
  });

  describe('opened', () => {
    beforeEach(async () => {
      comboBox.open();
      await nextUpdate(comboBox);
    });

    it('should not close the dialog when closing combo-box on input element Escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the combo-box is closed', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });

    it('should not close the dialog when closing combo-box on outside click', () => {
      outsideClick();

      expect(comboBox.opened).to.be.false;
      expect(dialog.opened).to.be.true;
    });
  });

  describe('clear button visible', () => {
    beforeEach(() => {
      comboBox.clearButtonVisible = true;
      comboBox.value = 'foo';
    });

    it('should not close the dialog when clearing on Escape with clear button visible', async () => {
      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.true;
    });

    it('should close the dialog on subsequent Escape after the value is cleared', async () => {
      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Escape' });

      expect(dialog.opened).to.be.false;
    });
  });
});

describe('combo-box in modeless dialog', () => {
  let dialog, comboBox;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog modeless></vaadin-dialog>');
    await nextUpdate(dialog);
    dialog.renderer = (root) => {
      root.innerHTML = '<vaadin-combo-box></vaadin-combo-box>';
    };
    dialog.opened = true;
    await oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
    comboBox = dialog.querySelector('vaadin-combo-box');
    comboBox.items = ['foo', 'bar'];
    comboBox.open();
    await nextUpdate(comboBox);
  });

  it('should keep the combo-box overlay on top when interacting with it', () => {
    // The open combo-box overlay is the front-most overlay in the stack.
    expect(comboBox.$.overlay._last).to.be.true;

    // A mousedown inside the combo-box overlay bubbles up to the modeless dialog
    // overlay, but must not bring the dialog in front of its own open overlay.
    dispatchMouseEvent(comboBox.$.overlay, 'mousedown');

    expect(comboBox.$.overlay._last).to.be.true;
    expect(dialog.$.overlay._last).to.be.false;
  });
});
