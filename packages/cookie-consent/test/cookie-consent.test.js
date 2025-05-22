import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, keyboardEventFor } from '@vaadin/testing-helpers';
import '../src/vaadin-cookie-consent.js';

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

  describe('cookie consent window', () => {
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

    it('should have alert role', () => {
      const popup = document.querySelector('[aria-label="cookieconsent"]');
      expect(popup.getAttribute('role')).to.equal('alert');
    });

    it('should close window on detach', async () => {
      expect(ccWindow.isConnected).to.be.true;
      consent.remove();
      await aTimeout(50);
      expect(ccWindow.isConnected).to.be.false;
    });

    it('should remove styles on detach', async () => {
      expect(consent._css.isConnected).to.be.true;
      consent.remove();
      await aTimeout(50);
      expect(consent._css.isConnected).to.be.false;
    });

    it('should only have one active window after reattach', async () => {
      const parent = consent.parentNode;
      consent.remove();
      parent.appendChild(consent);

      await aTimeout(50);

      expect(document.querySelectorAll('.cc-window').length).to.be.equal(1);
    });
  });

  describe('custom properties', () => {
    let consent;

    function getOverlay() {
      return document.querySelector('.cc-window');
    }

    function getOverlayContent() {
      const ccWindow = getOverlay();
      const message = ccWindow.querySelector('.cc-message');
      const dismiss = ccWindow.querySelector('.cc-dismiss');
      const link = ccWindow.querySelector('.cc-link');

      return {
        message,
        dismiss,
        link,
      };
    }

    async function waitUntilOpened() {
      // By default the cookie consent dialog has a 20 ms delay after it
      // is initialized and before it starts the fade-in animation.
      await aTimeout(50);
    }

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

      await waitUntilOpened();
    });

    it('should display static custom text', () => {
      const { message, dismiss, link } = getOverlayContent();

      expect(message.textContent).to.be.equal('custom-message custom-learn-more');
      expect(dismiss.textContent).to.be.equal('custom-dismiss');
      expect(link.textContent).to.be.equal('custom-learn-more');
      expect(link.href).to.be.equal('https://example.com/');
    });

    it('should display dynamically changed text', async () => {
      consent.message = 'custom-message2';
      consent.dismiss = 'custom-dismiss2';
      consent.learnMore = 'custom-learn-more2';
      consent.learnMoreLink = 'https://example2.com/';

      await waitUntilOpened();

      const { message, dismiss, link } = getOverlayContent();

      expect(message.textContent).to.be.equal('custom-message2 custom-learn-more2');
      expect(dismiss.textContent).to.be.equal('custom-dismiss2');
      expect(link.textContent).to.be.equal('custom-learn-more2');
      expect(link.href).to.be.equal('https://example2.com/');
    });

    it('should change position', async () => {
      expect(getOverlay().getBoundingClientRect().top).to.be.equal(0);

      consent.position = 'bottom';

      await waitUntilOpened();

      expect(getOverlay().getBoundingClientRect().top).not.to.be.equal(0);
      expect(getOverlay().getBoundingClientRect().bottom).to.be.closeTo(window.innerHeight, 1);
    });

    it('should change cookie name', async () => {
      // Change cookie name and dismiss
      consent.cookieName = 'custom-cookie-name';
      await waitUntilOpened();
      getOverlay().querySelector('.cc-dismiss').click();

      // Change cookie name
      consent.cookieName = 'custom-cookie-name2';
      await waitUntilOpened();
      // The constent should show
      expect(getOverlay().offsetHeight).to.be.greaterThan(0);

      // Change the cookie name back to the original one
      consent.cookieName = 'custom-cookie-name';
      await waitUntilOpened();
      // The constent should not show
      expect(getOverlay().offsetHeight).to.be.equal(0);
    });

    it('should only have one active window after change', async () => {
      consent.message = 'custom-message2';
      consent.dismiss = 'custom-dismiss2';

      await waitUntilOpened();

      expect(document.querySelectorAll('.cc-window').length).to.be.equal(1);
    });

    it('should have alert role after change', () => {
      consent.message = 'custom-message2';

      const popup = document.querySelector('[aria-label="cookieconsent"]');
      expect(popup.getAttribute('role')).to.equal('alert');
    });

    it('should close on Space key after change', async () => {
      consent.cookieName = 'custom-cookie-name-foo';
      await waitUntilOpened();

      const event = keyboardEventFor('keydown', 32, [], ' ');
      getOverlay().querySelector('.cc-dismiss').dispatchEvent(event);
      await waitUntilOpened();
      expect(getOverlay().offsetHeight).to.be.equal(0);
    });
  });

  describe('accessibility', () => {
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

    it('learn more link should not have role', () => {
      const link = ccWindow.querySelector('.cc-link');
      expect(link.hasAttribute('role')).to.be.false;
    });

    it('learn more link should not have aria-label', () => {
      const link = ccWindow.querySelector('.cc-link');
      expect(link.hasAttribute('aria-label')).to.be.false;
    });

    it('dismiss link should not have aria-label', () => {
      const link = ccWindow.querySelector('.cc-dismiss');
      expect(link.hasAttribute('aria-label')).to.be.false;
    });
  });
});
