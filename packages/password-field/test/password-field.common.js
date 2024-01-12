import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, focusout, mousedown, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

describe('password-field', () => {
  let passwordField, input, revealButton;

  beforeEach(async () => {
    passwordField = fixtureSync('<vaadin-password-field></vaadin-password-field>');
    await nextRender();
    input = passwordField.inputElement;
    revealButton = passwordField.querySelector('[slot=reveal]');
  });

  it('should reveal the password on reveal button click', async () => {
    revealButton.click();
    await nextUpdate(passwordField);
    expect(input.type).to.equal('text');

    revealButton.click();
    await nextUpdate(passwordField);
    expect(input.type).to.equal('password');
  });

  it('should hide the password on field focusout', async () => {
    passwordField.focus();
    revealButton.click();
    await nextUpdate(passwordField);
    expect(input.type).to.equal('text');

    focusout(passwordField);
    await nextUpdate(passwordField);
    expect(input.type).to.equal('password');
  });

  it('should not hide the password when focus moves to reveal button', async () => {
    passwordField.focus();
    revealButton.click();
    await nextUpdate(passwordField);

    focusout(passwordField, revealButton);
    await nextUpdate(passwordField);
    expect(input.type).to.equal('text');
  });

  it('should not hide the password when focus moves back to the input', async () => {
    revealButton.focus();
    revealButton.click();
    await nextUpdate(passwordField);

    focusout(revealButton, input);
    await nextUpdate(passwordField);
    expect(input.type).to.equal('text');
  });

  it('should prevent mousedown event on reveal button', () => {
    const event = fire(revealButton, 'mousedown');
    expect(event.defaultPrevented).to.be.true;
  });

  it('should focus the input on reveal button mousedown', () => {
    const spy = sinon.spy(input, 'focus');

    fire(revealButton, 'mousedown');

    expect(spy.calledOnce).to.be.true;
  });

  it('should dispatch change event on focusout after changing the value', () => {
    const spy = sinon.spy();
    passwordField.addEventListener('change', spy);

    input.value = 'test';

    focusout(input);

    expect(spy.calledOnce).to.be.true;
  });

  it('should not dispatch change event on focusout if value is the same', () => {
    const spy = sinon.spy();
    passwordField.addEventListener('change', spy);

    focusout(input);

    expect(spy.called).to.be.false;
  });

  it('should not dispatch change event on focusout after native change', () => {
    const spy = sinon.spy();
    passwordField.addEventListener('change', spy);

    input.value = 'test';
    fire(input, 'change');

    spy.resetHistory();

    focusout(input);

    expect(spy.called).to.be.false;
  });

  it('should toggle aria-pressed attribute on reveal button click', async () => {
    revealButton.click();
    await nextUpdate(passwordField);
    expect(revealButton.getAttribute('aria-pressed')).to.equal('true');

    revealButton.click();
    await nextUpdate(passwordField);
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

    beforeEach(async () => {
      revealPart = passwordField.shadowRoot.querySelector('[part="reveal-button"]');
      passwordField.revealButtonHidden = true;
      await nextUpdate(passwordField);
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

    it('should show reveal part when revealButtonHidden is set to false', async () => {
      passwordField.revealButtonHidden = false;
      await nextUpdate(passwordField);
      expect(revealPart.hidden).to.be.false;
    });

    it('should reset tabindex when revealButtonHidden is set to false', async () => {
      passwordField.revealButtonHidden = false;
      await nextUpdate(passwordField);
      expect(revealButton.tabIndex).to.equal(0);
    });

    it('should remove aria-hidden attribute when revealButtonHidden set to false', async () => {
      passwordField.revealButtonHidden = false;
      await nextUpdate(passwordField);
      expect(revealButton.hasAttribute('aria-hidden')).to.be.false;
    });
  });
});

describe('disabled', () => {
  let passwordField;
  let revealButton;

  beforeEach(async () => {
    passwordField = fixtureSync('<vaadin-password-field disabled></vaadin-password-field>');
    await nextRender();
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
      await nextUpdate(passwordField);
      await shiftTab();
      expect(document.activeElement).to.equal(revealButton);
    });

    it('should not focus the reveal button of a dynamically disabled password field', async () => {
      passwordField.disabled = false;
      await nextUpdate(passwordField);

      passwordField.disabled = true;
      await nextUpdate(passwordField);

      await shiftTab();
      expect(document.activeElement).not.to.equal(revealButton);
    });
  });

  describe('tabindex', () => {
    it('should restore button tabindex when field is re-enabled', async () => {
      passwordField.disabled = false;
      await nextUpdate(passwordField);
      expect(revealButton.tabIndex).to.equal(0);
    });

    it('should restore input tabindex when field is re-enabled', async () => {
      passwordField.disabled = false;
      await nextUpdate(passwordField);
      expect(passwordField.inputElement.tabIndex).to.equal(0);
    });
  });
});

describe('i18n', () => {
  let passwordField, revealButton;

  describe('default', () => {
    beforeEach(async () => {
      passwordField = fixtureSync('<vaadin-password-field></vaadin-password-field>');
      await nextRender();
      revealButton = passwordField.querySelector('[slot=reveal]');
    });

    it('should set default accessible label to reveal button', () => {
      expect(revealButton.getAttribute('aria-label')).to.equal('Show password');
    });

    it('should translate accessible label when setting new i18n object', async () => {
      passwordField.i18n = { reveal: 'Näytä salasana' };
      await nextUpdate(passwordField);
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

    it('should not override i18n object set before attaching to the DOM', async () => {
      passwordField.i18n = { reveal: 'Näytä salasana' };
      document.body.appendChild(passwordField);
      await nextRender();

      revealButton = passwordField.querySelector('[slot=reveal]');
      expect(revealButton.getAttribute('aria-label')).to.equal('Näytä salasana');
    });
  });
});
