import { expect } from '@esm-bundle/chai';
import { fixtureSync, isFirefox, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-radio-group.js';

describe('keyboard navigation', () => {
  let group, buttons;

  beforeEach(async () => {
    group = fixtureSync(`
      <vaadin-radio-group>
        <vaadin-radio-button label="Button 1" value="1"></vaadin-radio-button>
        <vaadin-radio-button label="Button 2" value="2"></vaadin-radio-button>
        <vaadin-radio-button label="Button 3" value="3"></vaadin-radio-button>
      </vaadin-radio-group>
    `);
    await nextFrame();
    buttons = [...group.querySelectorAll('vaadin-radio-button')];
  });

  describe('Tab', () => {
    // There is a bug in the Playwright Firefox build that causes all the radio buttons
    // to be available for focus when no radio button has been selected yet.
    (isFirefox ? it.skip : it)('should leave focusable only the first button by default', async () => {
      // Focus on the 1st radio button.
      await sendKeys({ press: 'Tab' });
      expect(buttons[0].hasAttribute('focused')).to.be.true;
      expect(buttons[1].hasAttribute('focused')).to.be.false;
      expect(buttons[2].hasAttribute('focused')).to.be.false;

      // Move focus out of the group.
      await sendKeys({ press: 'Tab' });
      expect(buttons[0].hasAttribute('focused')).to.be.false;
      expect(buttons[1].hasAttribute('focused')).to.be.false;
      expect(buttons[2].hasAttribute('focused')).to.be.false;
    });

    it('should leave focusable only the checked radio button', async () => {
      buttons[1].checked = true;

      // Focus on the 2nd radio button.
      await sendKeys({ press: 'Tab' });
      expect(buttons[0].hasAttribute('focused')).to.be.false;
      expect(buttons[1].hasAttribute('focused')).to.be.true;
      expect(buttons[2].hasAttribute('focused')).to.be.false;

      // Move focus out of the group.
      await sendKeys({ press: 'Tab' });
      expect(buttons[0].hasAttribute('focused')).to.be.false;
      expect(buttons[1].hasAttribute('focused')).to.be.false;
      expect(buttons[2].hasAttribute('focused')).to.be.false;
    });
  });

  describe('arrows', () => {
    it('should select next radio button on ArrowDown when unchecked', async () => {
      buttons[0].focus();
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.true;
      expect(buttons[2].checked).to.be.false;
    });

    it('should select next radio button on ArrowDown when checked', async () => {
      buttons[0].checked = true;
      buttons[0].focus();
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.true;
      expect(buttons[2].checked).to.be.false;
    });

    it('should select prev radio button on ArrowUp when checked', async () => {
      buttons[1].checked = true;
      buttons[1].focus();
      await sendKeys({ press: 'ArrowUp' });

      expect(buttons[0].checked).to.be.true;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.false;
    });

    it('should skip disabled button and check the next one instead on ArrowDown', async () => {
      buttons[0].checked = true;
      buttons[0].focus();
      buttons[1].disabled = true;
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.true;
    });

    it('should set focus-ring attribute when selecting next radio', async () => {
      buttons[1].checked = true;
      buttons[1].focus();
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].hasAttribute('focus-ring')).to.be.false;
      expect(buttons[1].hasAttribute('focus-ring')).to.be.false;
      expect(buttons[2].hasAttribute('focus-ring')).to.be.true;
    });

    it('should set focus-ring attribute when selecting prev radio', async () => {
      buttons[1].checked = true;
      buttons[1].focus();
      await sendKeys({ press: 'ArrowUp' });

      expect(buttons[0].hasAttribute('focus-ring')).to.be.true;
      expect(buttons[1].hasAttribute('focus-ring')).to.be.false;
      expect(buttons[2].hasAttribute('focus-ring')).to.be.false;
    });

    it('should select last radio button on ArrowUp on first button', async () => {
      buttons[0].checked = true;
      buttons[0].focus();
      await sendKeys({ press: 'ArrowUp' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.true;
    });

    it('should select first radio button on ArrowDown on last button', async () => {
      buttons[2].checked = true;
      buttons[2].focus();
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].checked).to.be.true;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.false;
    });

    it('should select next radio button on ArrowRight when checked', async () => {
      buttons[0].checked = true;
      buttons[0].focus();
      await sendKeys({ press: 'ArrowRight' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.true;
      expect(buttons[2].checked).to.be.false;
    });

    it('should select prev radio button on ArrowLeft when checked', async () => {
      buttons[1].checked = true;
      buttons[1].focus();
      await sendKeys({ press: 'ArrowLeft' });

      expect(buttons[0].checked).to.be.true;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.false;
    });

    it('should skip disabled button and check the next one instead on ArrowRight', async () => {
      buttons[0].checked = true;
      buttons[0].focus();
      buttons[1].disabled = true;
      await sendKeys({ press: 'ArrowRight' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.true;
    });

    it('should select last radio button on ArrowLeft on first button', async () => {
      buttons[0].checked = true;
      buttons[0].focus();
      await sendKeys({ press: 'ArrowLeft' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.true;
    });

    it('should select first radio button on ArrowRight on last button', async () => {
      buttons[2].checked = true;
      buttons[2].focus();
      await sendKeys({ press: 'ArrowRight' });

      expect(buttons[0].checked).to.be.true;
      expect(buttons[1].checked).to.be.false;
      expect(buttons[2].checked).to.be.false;
    });

    it('should not select radio button with keyboard when the group is disabled', async () => {
      buttons[1].checked = true;
      buttons[1].focus();
      group.disabled = true;
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.true;
      expect(buttons[2].checked).to.be.false;
    });

    it('should not check radio button with keyboard when the group is readonly', async () => {
      buttons[1].checked = true;
      buttons[1].focus();
      group.readonly = true;
      await sendKeys({ press: 'ArrowDown' });

      expect(buttons[0].checked).to.be.false;
      expect(buttons[1].checked).to.be.true;
      expect(buttons[2].checked).to.be.false;
    });

    // FIXME: update DirMixin to support Lit
    describe.skip('RTL mode', () => {
      beforeEach(() => {
        document.documentElement.setAttribute('dir', 'rtl');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('should select prev radio button on ArrowRight when checked', async () => {
        buttons[2].checked = true;
        buttons[2].focus();
        await sendKeys({ press: 'ArrowRight' });

        expect(buttons[0].checked).to.be.false;
        expect(buttons[1].checked).to.be.true;
        expect(buttons[2].checked).to.be.false;
      });

      it('should select next radio button on ArrowLeft when checked', async () => {
        buttons[0].checked = true;
        buttons[0].focus();
        await sendKeys({ press: 'ArrowLeft' });

        expect(buttons[0].checked).to.be.false;
        expect(buttons[1].checked).to.be.true;
        expect(buttons[2].checked).to.be.false;
      });
    });
  });
});
