import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout, makeSoloTouchEvent, mousedown } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-password-field.js';

describe('password-field', () => {
  let passwordField, input, revealButton;

  beforeEach(() => {
    passwordField = fixtureSync('<vaadin-password-field></vaadin-password-field>');
    input = passwordField.inputElement;
    revealButton = passwordField.querySelector('[slot=reveal]');
  });

  it('should reveal the password on reveal button click', () => {
    revealButton.click();
    expect(input.type).to.equal('text');

    revealButton.click();
    expect(input.type).to.equal('password');
  });

  it('should hide the password on field focusout', () => {
    passwordField.focus();
    revealButton.click();
    expect(input.type).to.equal('text');

    focusout(passwordField);
    expect(input.type).to.equal('password');
  });

  it('should not hide the password when focus moves to reveal button', () => {
    passwordField.focus();
    revealButton.click();

    focusout(passwordField, revealButton);
    expect(input.type).to.equal('text');
  });

  it('should not hide the password when focus moves back to the input', () => {
    revealButton.focus();
    revealButton.click();

    focusout(revealButton, input);
    expect(input.type).to.equal('text');
  });

  it('should prevent touchend event on reveal button', () => {
    const event1 = makeSoloTouchEvent('touchend', null, revealButton);
    expect(event1.defaultPrevented).to.be.true;
    expect(input.type).to.equal('text');

    const event2 = makeSoloTouchEvent('touchend', null, revealButton);
    expect(event2.defaultPrevented).to.be.true;
    expect(input.type).to.equal('password');
  });

  it('should focus the input on reveal button touchend', () => {
    const spy = sinon.spy(input, 'focus');

    makeSoloTouchEvent('touchend', null, revealButton);

    expect(spy.calledOnce).to.be.true;
  });

  it('should toggle aria-pressed attribute on reveal button click', () => {
    revealButton.click();
    expect(revealButton.getAttribute('aria-pressed')).to.equal('true');

    revealButton.click();
    expect(revealButton.getAttribute('aria-pressed')).to.equal('false');
  });

  describe('focus-ring', () => {
    let button;

    before(() => {
      button = document.createElement('button');
      button.textContent = 'Button';
    });

    after(() => {
      button.remove();
    });

    describe('Tab', () => {
      before(() => {
        document.body.insertBefore(button, document.body.firstChild);
        button.focus();
      });

      it('should set focus-ring attribute when focusing the input with Tab', async () => {
        await sendKeys({ press: 'Tab' });

        expect(passwordField.hasAttribute('focus-ring')).to.be.true;
      });

      it('should remove focus-ring attribute when focusing reveal button', async () => {
        // Focus the input element
        input.focus();

        // Tab to the reveal button
        await sendKeys({ press: 'Tab' });

        expect(passwordField.hasAttribute('focus-ring')).to.be.false;
      });
    });

    describe('Shift Tab', () => {
      before(() => {
        document.body.appendChild(button);
        button.focus();
      });

      it('should not set focus-ring attribute when focusing reveal button with Shift Tab', async () => {
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        expect(passwordField.hasAttribute('focus-ring')).to.be.false;
      });

      it('should set focus-ring attribute when focusing the input with Shift Tab', async () => {
        // Focus the reveal button
        revealButton.focus();

        // Shift+Tab to the input element
        await sendKeys({ down: 'Shift' });
        await sendKeys({ press: 'Tab' });
        await sendKeys({ up: 'Shift' });

        expect(passwordField.hasAttribute('focus-ring')).to.be.true;
      });
    });

    describe('mousedown', () => {
      it('should not set focus-ring attribute when focusing on mousedown', () => {
        // Reset FocusMixin flag
        mousedown(passwordField);
        passwordField.focus();
        expect(passwordField.hasAttribute('focus-ring')).to.be.false;
      });
    });
  });

  describe('revealButtonHidden', () => {
    let revealPart;

    beforeEach(() => {
      revealPart = passwordField.shadowRoot.querySelector('[part="reveal-button"]');
      passwordField.revealButtonHidden = true;
    });

    it('should hide reveal part when revealButtonHidden is set to true', () => {
      expect(revealPart.hidden).to.be.true;
    });

    it('should set tabindex to -1 when revealButtonHidden set to true', () => {
      expect(revealButton.tabIndex).to.equal(-1);
    });

    it('should set aria-hidden attribute when revealButtonHidden set to true', () => {
      expect(revealButton.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should show reveal part when revealButtonHidden is set to false', () => {
      passwordField.revealButtonHidden = false;
      expect(revealPart.hidden).to.be.false;
    });

    it('should reset tabindex when revealButtonHidden is set to false', () => {
      passwordField.revealButtonHidden = false;
      expect(revealButton.tabIndex).to.equal(0);
    });

    it('should remove aria-hidden attribute when revealButtonHidden set to false', () => {
      passwordField.revealButtonHidden = false;
      expect(revealButton.hasAttribute('aria-hidden')).to.be.false;
    });
  });

  describe('validation', () => {
    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      passwordField.addEventListener('validated', validatedSpy);
      passwordField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      passwordField.addEventListener('validated', validatedSpy);
      passwordField.required = true;
      passwordField.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });
});

describe('invalid', () => {
  let field;

  beforeEach(() => {
    field = fixtureSync('<vaadin-password-field invalid></vaadin-password-field>');
  });

  it('should not remove "invalid" state when ready', () => {
    expect(field.invalid).to.be.true;
  });
});

describe('invalid with value', () => {
  let field;

  beforeEach(() => {
    field = fixtureSync('<vaadin-password-field invalid value="123456"></vaadin-password-field>');
  });

  it('should not remove "invalid" state when ready', () => {
    expect(field.invalid).to.be.true;
  });
});

describe('disabled', () => {
  let passwordField;
  let revealButton;

  beforeEach(() => {
    passwordField = fixtureSync('<vaadin-password-field disabled></vaadin-password-field>');
    revealButton = passwordField.querySelector('[slot=reveal]');
  });

  describe('reveal button focus', () => {
    let focusInput;

    async function shiftTab() {
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
    }

    beforeEach(() => {
      focusInput = fixtureSync('<input>');
      // Move focus to the input after the field so we can shift-tab to the reveal button in tests
      focusInput.focus();
    });

    it('should not focus the reveal button of an initially disabled password field', async () => {
      await shiftTab();
      expect(document.activeElement).not.to.equal(revealButton);
    });

    it('should focus the reveal button of an enabled password field', async () => {
      passwordField.disabled = false;
      await shiftTab();
      expect(document.activeElement).to.equal(revealButton);
    });

    it('should not focus the reveal button of a dynamically disabled password field', async () => {
      passwordField.disabled = false;
      passwordField.disabled = true;
      await shiftTab();
      expect(document.activeElement).not.to.equal(revealButton);
    });
  });

  describe('tabindex', () => {
    it('should restore button tabindex when field is re-enabled', () => {
      passwordField.disabled = false;
      expect(revealButton.tabIndex).to.equal(0);
    });

    it('should restore input tabindex when field is re-enabled', () => {
      passwordField.disabled = false;
      expect(passwordField.inputElement.tabIndex).to.equal(0);
    });
  });
});

describe('i18n', () => {
  let passwordField, revealButton;

  describe('default', () => {
    beforeEach(() => {
      passwordField = fixtureSync('<vaadin-password-field></vaadin-password-field>');
      revealButton = passwordField.querySelector('[slot=reveal]');
    });

    it('should set default accessible label to reveal button', () => {
      expect(revealButton.getAttribute('aria-label')).to.equal('Show password');
    });

    it('should translate accessible label when setting new i18n object', () => {
      passwordField.i18n = { reveal: 'Näytä salasana' };
      expect(revealButton.getAttribute('aria-label')).to.equal('Näytä salasana');
    });
  });

  describe('set before attach', () => {
    beforeEach(() => {
      passwordField = document.createElement('vaadin-password-field');
    });

    afterEach(() => {
      passwordField.remove();
    });

    it('should not override i18n object set before attaching to the DOM', () => {
      passwordField.i18n = { reveal: 'Näytä salasana' };
      document.body.appendChild(passwordField);

      revealButton = passwordField.querySelector('[slot=reveal]');
      expect(revealButton.getAttribute('aria-label')).to.equal('Näytä salasana');
    });
  });
});
