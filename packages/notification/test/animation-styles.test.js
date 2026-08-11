import { expect } from '@vaadin/chai-plugins';
import { emulateMedia } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-notification.js';
import { shouldAnimate } from '@vaadin/overlay/src/vaadin-overlay-utils.js';

// Do not import `not-animated-styles.css` to verify default animations.

describe('notification card animation styles', () => {
  let notification, card;

  beforeEach(async () => {
    notification = fixtureSync('<vaadin-notification duration="-1"></vaadin-notification>');
    notification.renderer = (root) => {
      root.textContent = 'Notification';
    };
    await nextRender();
    card = notification._card;
  });

  afterEach(async () => {
    if (notification.opened) {
      notification.opened = false;
      await oneEvent(notification, 'closed');
    }
  });

  describe('default', () => {
    it('should use the default animation duration and delay', () => {
      const style = getComputedStyle(card);

      expect(style.getPropertyValue('--vaadin-overlay-animation-duration')).to.equal('0.3s');
      expect(style.getPropertyValue('--vaadin-overlay-animation-delay')).to.equal('0s');
    });
  });

  describe('custom', () => {
    let overlay;

    beforeEach(() => {
      card.style.setProperty('--vaadin-overlay-animation-duration', '50ms');
      card.style.setProperty('--vaadin-overlay-animation-delay', '0s');
      overlay = card.shadowRoot.querySelector('[part="overlay"]');
    });

    it('should animate the card', () => {
      notification.opened = true;

      expect(shouldAnimate(card)).to.be.true;
    });

    it('should run the overlay animations on the card', () => {
      notification.opened = true;

      const animations = overlay.getAnimations().map((animation) => animation.animationName);
      expect(animations).to.include('__fade');
      expect(animations).to.include('__transform');
    });

    it('should keep the card in the DOM until the closing animation ends', async () => {
      notification.opened = true;
      await oneEvent(card, 'animationend');

      notification.close();

      expect(card.hasAttribute('closing')).to.be.true;
      expect(card.parentNode).to.be.ok;
    });

    it('should remove the card and fire closed when the closing animation ends', async () => {
      notification.opened = true;
      await oneEvent(card, 'animationend');

      const closedSpy = sinon.spy();
      notification.addEventListener('closed', closedSpy);

      notification.close();
      await oneEvent(notification, 'closed');

      expect(card.parentNode).to.be.not.ok;
      expect(closedSpy).to.be.calledOnce;
    });

    it('should fill the animation of the overlay part forwards while closing', async () => {
      notification.opened = true;
      await oneEvent(card, 'animationend');

      notification.close();

      expect(getComputedStyle(overlay).animationFillMode).to.equal('both');
    });

    it('should resolve the closed state on the overlay part while closing', async () => {
      notification.opened = true;
      await oneEvent(card, 'animationend');

      notification.close();

      const style = getComputedStyle(overlay);
      expect(style.getPropertyValue('--vaadin-overlay-scale-closed').trim()).to.equal('0.98');
      expect(style.getPropertyValue('--vaadin-overlay-translate-closed').trim()).to.equal('0%');
    });

    it('should not limit the height of a card that is not animating', async () => {
      notification.renderer = (root) => {
        root.textContent = 'Notification. '.repeat(400);
      };
      notification.opened = true;
      await oneEvent(card, 'animationend');

      expect(getComputedStyle(card).maxHeight).to.equal('none');
      expect(card.getBoundingClientRect().height).to.be.above(400);
    });

    describe('prefers-reduced-motion', () => {
      before(async () => {
        await emulateMedia({ reducedMotion: 'reduce' });
      });

      after(async () => {
        await emulateMedia({ reducedMotion: 'no-preference' });
      });

      it('should not animate the height of the card, only opacity', () => {
        notification.opened = true;

        expect(getComputedStyle(card).animationName).to.equal('__fade');
      });
    });
  });
});
