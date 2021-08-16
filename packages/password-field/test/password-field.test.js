import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, focusin, focusout, tabKeyDown } from '@vaadin/testing-helpers';
import { PasswordField } from '../src/vaadin-password-field.js';

customElements.define('vaadin-password-field', PasswordField);

describe('password-field', () => {
  let passwordField, input, revealButton;

  beforeEach(() => {
    passwordField = fixtureSync('<vaadin-password-field></vaadin-password-field>');
    input = passwordField.inputElement;
    revealButton = passwordField.querySelector('[slot=reveal]');
  });

  it('should have [type=password]', () => {
    expect(input.type).to.equal('password');
  });

  it('should show reveal button by default', () => {
    expect(revealButton.hidden).to.be.false;
  });

  it('should set default accessible label to reveal button', () => {
    expect(revealButton.getAttribute('aria-label')).to.equal('Show password');
  });

  it('should translate accessible label when setting new i18n object', () => {
    passwordField.i18n = { reveal: 'Näytä salasana' };
    expect(revealButton.getAttribute('aria-label')).to.equal('Näytä salasana');
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

  it('should set focus-ring attribute when focusing the input with Tab', () => {
    tabKeyDown(document.body);
    focusin(input);

    expect(passwordField.hasAttribute('focus-ring')).to.be.true;
  });

  it('should set focus-ring attribute when focusing reveal button with Shift Tab', () => {
    tabKeyDown(document.body, ['shift']);
    focusin(revealButton);

    expect(passwordField.hasAttribute('focus-ring')).to.be.true;
  });

  it('should prevent touchend event on reveal button', () => {
    const e = new CustomEvent('touchend', { cancelable: true });

    revealButton.dispatchEvent(e);
    expect(e.defaultPrevented).to.be.true;
    expect(input.type).to.equal('text');

    revealButton.dispatchEvent(e);
    expect(e.defaultPrevented).to.be.true;
    expect(input.type).to.equal('password');
  });

  it('should focus the input on reveal button touchend', () => {
    const spy = sinon.spy(input, 'focus');

    const e = new CustomEvent('touchend', { cancelable: true });
    revealButton.dispatchEvent(e);

    expect(spy.calledOnce).to.be.true;
  });

  it('should set aria-pressed attribute on reveal button to false', () => {
    expect(revealButton.getAttribute('aria-pressed')).to.equal('false');
  });

  it('should toggle aria-pressed attribute on reveal button click', () => {
    revealButton.click();
    expect(revealButton.getAttribute('aria-pressed')).to.equal('true');

    revealButton.click();
    expect(revealButton.getAttribute('aria-pressed')).to.equal('false');
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
});
