import { expect } from '@esm-bundle/chai';
import {
  arrowDownKeyDown,
  arrowUpKeyDown,
  aTimeout,
  click,
  escKeyDown,
  fire,
  fixtureSync,
  focusout,
  isIOS,
  nextRender,
  outsideClick,
  tap,
  touchstart,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getFirstItem, setInputValue } from './helpers.js';

describe('overlay opening', () => {
  let comboBox, overlay, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box label="Label"></vaadin-combo-box>');
    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
    overlay = comboBox.$.overlay;
  });

  describe('opening', () => {
    describe('default (auto open)', () => {
      it('should set opened to false by default', () => {
        expect(comboBox.opened).to.be.false;
      });

      it('should open by clicking label element', () => {
        comboBox.querySelector('[slot="label"]').click();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open by clicking input element', () => {
        input.click();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open by clicking toggle button', () => {
        comboBox._toggleElement.click();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open by entering input value', () => {
        setInputValue(comboBox, 'foo');

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open by clearing input value', () => {
        comboBox.value = 'foo';
        expect(comboBox.opened).to.be.false;

        setInputValue(comboBox, '');

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open with Arrow Down key', () => {
        arrowDownKeyDown(input);

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open with Arrow Up key', () => {
        arrowUpKeyDown(input);

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should open on function call', () => {
        comboBox.open();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should prevent default for the handled label element click', () => {
        const event = click(comboBox.querySelector('[slot="label"]'));
        expect(event.defaultPrevented).to.be.true;
      });

      it('should prevent default for the handled toggle button click', () => {
        const event = click(comboBox._toggleElement);
        expect(event.defaultPrevented).to.be.true;
      });
    });

    describe('auto open disabled', () => {
      beforeEach(() => {
        comboBox.autoOpenDisabled = true;
      });

      it('should not open by clicking label element when autoOpenDisabled is true', () => {
        comboBox.querySelector('[slot="label"]').click();

        expect(comboBox.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });

      it('should not open by clicking input element when autoOpenDisabled is true', () => {
        input.click();

        expect(comboBox.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });

      it('should not open by entering input value when autoOpenDisabled is true', () => {
        setInputValue(comboBox, 'foo');

        expect(comboBox.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });

      it('should not open by clearing input value when autoOpenDisabled is true', () => {
        comboBox.value = 'foo';
        expect(comboBox.opened).to.be.false;

        setInputValue(comboBox, '');

        expect(comboBox.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });

      it('should open by clicking toggle button when autoOpenDisabled is true', () => {
        comboBox._toggleElement.click();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.true;
      });

      it('should not prevent default for label click when autoOpenDisabled', () => {
        const event = click(comboBox.querySelector('[slot="label"]'));
        expect(event.defaultPrevented).to.be.false;
      });
    });

    describe('opening disallowed', () => {
      it('should not open on helper element click', () => {
        comboBox.helperText = 'Helper Text';
        comboBox.querySelector('[slot=helper]').click();

        expect(comboBox.opened).to.be.false;
      });

      it('should not open on error message element click', () => {
        comboBox.invalid = true;
        comboBox.errorMessage = 'Error message';

        comboBox.querySelector('[slot=error-message]').click();

        expect(comboBox.opened).to.be.false;
      });

      it('should not open overlay when disabled is set to true', () => {
        comboBox.disabled = true;
        comboBox.open();

        expect(comboBox.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });

      it('should not open overlay when readonly is set to true', () => {
        comboBox.readonly = true;
        comboBox.open();

        expect(comboBox.opened).to.be.false;
        expect(overlay.opened).to.be.false;
      });

      it('should not open overlay when setting items to null', () => {
        comboBox.items = null;

        comboBox.open();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.false;
      });

      it('should not open overlay when setting empty items array', () => {
        comboBox.items = [];

        comboBox.open();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.false;
      });

      it('should not open overlay when setting empty filteredItems array', () => {
        comboBox.filteredItems = [];

        comboBox.open();

        expect(comboBox.opened).to.be.true;
        expect(overlay.opened).to.be.false;
      });
    });
  });

  (isIOS ? describe : describe.skip)('after opening', () => {
    beforeEach(() => {
      comboBox.open();
    });

    it('should not set focused attribute on dropdown open', () => {
      expect(comboBox.hasAttribute('focused')).to.be.false;
    });

    it('should not refocus the input field when closed from icon', () => {
      tap(comboBox._toggleElement);
      expect(comboBox.hasAttribute('focused')).to.be.false;
    });

    it('should focus input on dropdown open after a timeout', async () => {
      await aTimeout(1);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    it('should refocus the input field when closed from icon', async () => {
      tap(comboBox._toggleElement);
      await aTimeout(1);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    it('should prevent default on overlay mousedown', () => {
      const event = fire(overlay, 'mousedown');
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('closing', () => {
    it('should close overlay on outside click', () => {
      comboBox.open();

      outsideClick();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not close when clicking on the overlay', () => {
      comboBox.open();

      click(overlay);

      expect(comboBox.opened).to.be.true;
    });

    it('should not close popup when clicking on any overlay children', () => {
      comboBox.open();

      comboBox._scroller.click();

      expect(comboBox.opened).to.be.true;
    });

    it('should close on clicking icon', () => {
      comboBox.open();

      tap(comboBox._toggleElement);

      expect(comboBox.opened).to.be.false;
    });

    it('should close the overlay when focus is lost', () => {
      comboBox.open();

      focusout(input);

      expect(comboBox.opened).to.be.false;
    });

    it('should not close the overlay when focus is moved to item', () => {
      comboBox.open();

      const item = getFirstItem(comboBox);
      focusout(input, item);

      expect(comboBox.opened).to.be.true;
    });

    it('should not close the overlay when focusing the scroll bar', () => {
      comboBox.open();

      focusout(input, overlay);

      expect(comboBox.opened).to.be.true;
    });

    describe('focus', () => {
      it('should restore focus to the input on outside click', async () => {
        comboBox.focus();
        comboBox.open();
        outsideClick();
        await aTimeout(0);
        expect(document.activeElement).to.equal(input);
      });

      it('should focus the input on outside click if not focused before opening', async () => {
        expect(document.activeElement).to.equal(document.body);
        comboBox.open();
        outsideClick();
        await aTimeout(0);
        expect(document.activeElement).to.equal(input);
      });

      it('should not remove the focused attribute when focusing the scroll bar', () => {
        comboBox.focus();
        comboBox.open();
        focusout(input, overlay);
        expect(comboBox.hasAttribute('focused')).to.be.true;
      });

      it('should keep focus-ring attribute after closing with Escape', () => {
        comboBox.focus();
        comboBox.setAttribute('focus-ring', '');
        comboBox.open();
        escKeyDown(input);
        expect(comboBox.hasAttribute('focus-ring')).to.be.true;
      });

      it('should not keep focus-ring attribute after closing with outside click', () => {
        comboBox.focus();
        comboBox.setAttribute('focus-ring', '');
        comboBox.open();
        outsideClick();
        expect(comboBox.hasAttribute('focus-ring')).to.be.false;
        // FIXME: see https://github.com/vaadin/web-components/issues/4148
        // expect(comboBox.hasAttribute('focus-ring')).to.be.true;
      });
    });

    describe('virtual keyboard', () => {
      it('should disable virtual keyboard on close', () => {
        comboBox.open();
        comboBox.close();
        expect(input.inputMode).to.equal('none');
      });

      it('should re-enable virtual keyboard on touchstart', () => {
        comboBox.open();
        comboBox.close();
        touchstart(comboBox);
        expect(input.inputMode).to.equal('');
      });

      it('should re-enable virtual keyboard on blur', async () => {
        comboBox.open();
        comboBox.close();
        await aTimeout(0);
        await sendKeys({ press: 'Tab' });
        expect(input.inputMode).to.equal('');
      });
    });

    describe('filtered items are empty', () => {
      it('should close the dropdown on non-existent values', () => {
        comboBox.open();

        // Existent value
        setInputValue(comboBox, 'foo');
        expect(overlay.opened).to.be.true;
        expect(comboBox.opened).to.be.true;

        // Non-existent value
        setInputValue(comboBox, 'qux');
        expect(overlay.opened).to.be.false;
        expect(comboBox.opened).to.be.true;
      });

      it('should not commit value the input on dropdown closing', () => {
        comboBox.open();

        setInputValue(comboBox, 'qux');
        expect(input.value).to.equal('qux');
        expect(comboBox.value).to.be.empty;

        focusout(input);
        expect(input.value).to.be.empty;
      });
    });
  });
});
