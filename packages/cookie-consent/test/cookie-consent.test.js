import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, keyboardEventFor } from '@vaadin/testing-helpers';
import '../vaadin-cookie-consent.js';

describe('vaadin-cookie-consent', () => {
  describe('custom element definition', () => {
    let consent, tagName;

    beforeEach(() => {
      consent = fixtureSync('<vaadin-cookie-consent></vaadin-cookie-consent>');
      tagName = consent.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('host element', () => {
    let consent;

    beforeEach(() => {
      consent = fixtureSync('<vaadin-cookie-consent></vaadin-cookie-consent>');
    });

    it('should enforce display: none to hide the host element', () => {
      consent.style.display = 'block';
      expect(getComputedStyle(consent).display).to.equal('none');
    });
  });

  describe('cooke consent window', () => {
    let consent, ccWindow;

    beforeEach(async () => {
      consent = fixtureSync('<vaadin-cookie-consent></vaadin-cookie-consent>');

      // Force cookie consent to appear.
      consent._show();

      // By default the cookie consent dialog has a 20 ms delay after it
      // is initialized and before it starts the fade-in animation.
      await aTimeout(50);

      ccWindow = document.querySelector('.cc-window');
    });

    it('should be in the DOM by default', () => {
      expect(ccWindow).to.be.ok;
    });

    it('should be visible by default', () => {
      expect(ccWindow.classList.contains('cc-invisible')).to.be.false;
      const opacity = getComputedStyle(ccWindow).opacity;
      expect(Number(opacity)).to.be.greaterThan(0);
    });

    it('should close on Space key', async () => {
      const event = keyboardEventFor('keydown', 32, [], ' ');
      ccWindow.querySelector('.cc-dismiss').dispatchEvent(event);
      await aTimeout(50);
      expect(ccWindow.classList.contains('cc-invisible')).to.be.true;
      const opacity = getComputedStyle(ccWindow).opacity;
      expect(Number(opacity)).to.be.lessThan(1);
    });

    it('should close on Enter key', async () => {
      const event = keyboardEventFor('keydown', 13, [], 'Enter');
      ccWindow.querySelector('.cc-dismiss').dispatchEvent(event);
      await aTimeout(50);
      expect(ccWindow.classList.contains('cc-invisible')).to.be.true;
      const opacity = getComputedStyle(ccWindow).opacity;
      expect(Number(opacity)).to.be.lessThan(1);
    });

    it('should display default text', () => {
      const message = ccWindow.querySelector('.cc-message');
      const dismiss = ccWindow.querySelector('.cc-dismiss');
      const link = ccWindow.querySelector('.cc-link');

      expect(message.textContent).to.equal(
        'This website uses cookies to ensure you get the best experience. Learn more',
      );
      expect(dismiss.textContent).to.be.equal('Got it!');
      expect(link.textContent).to.be.equal('Learn more');
      expect(link.href).to.be.equal('https://cookiesandyou.com/');
    });
  });

  describe('custom texts', () => {
    let consent, ccWindow;

    beforeEach(async () => {
      consent = fixtureSync(`
        <vaadin-cookie-consent
          cookie-name="changetextscookie3"
          message="custom-message"
          dismiss="custom-dismiss"
          learn-more="custom-learn-more"
          learn-more-link="https://example.com/"
        ></vaadin-cookie-consent>
      `);

      // Force cookie consent to appear.
      consent._show();

      // By default the cookie consent dialog has a 20 ms delay after it
      // is initialized and before it starts the fade-in animation.
      await aTimeout(50);

      ccWindow = document.querySelector('.cc-window');
    });

    it('should display default text', () => {
      const message = ccWindow.querySelector('.cc-message');
      const dismiss = ccWindow.querySelector('.cc-dismiss');
      const link = ccWindow.querySelector('.cc-link');

      expect(message.textContent).to.be.equal('custom-message custom-learn-more');
      expect(dismiss.textContent).to.be.equal('custom-dismiss');
      expect(link.textContent).to.be.equal('custom-learn-more');
      expect(link.href).to.be.equal('https://example.com/');
    });
  });
});
