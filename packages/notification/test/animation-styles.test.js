import { expect } from '@vaadin/chai-plugins';
import { emulateMedia } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-notification.js';
import { shouldAnimate } from '@vaadin/overlay/src/vaadin-overlay-utils.js';

// Covers the animation that the notification card has out of the box, so this file deliberately
// does not import `not-animated-styles.css`. The animation lifecycle of the mixin is covered by
// `animation.test.js`, which brings an animation of its own instead.
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

  it('should use the default animation duration and delay', () => {
    const style = getComputedStyle(card);

    expect(style.getPropertyValue('--vaadin-overlay-animation-duration')).to.equal('0.3s');
    expect(style.getPropertyValue('--vaadin-overlay-animation-delay')).to.equal('0.1s');
  });

  describe('shortened animation', () => {
    beforeEach(() => {
      // These tests only assert that the animation is applied, so they do not need to wait for
      // the default duration. The properties are set on the card, since it is not a descendant
      // of the notification element.
      card.style.setProperty('--vaadin-overlay-animation-duration', '50ms');
      card.style.setProperty('--vaadin-overlay-animation-delay', '0s');
    });

    it('should animate the card', () => {
      notification.opened = true;

      expect(shouldAnimate(card)).to.be.true;
    });

    it('should run the overlay animations on the card', () => {
      notification.opened = true;

      const names = card.shadowRoot
        .querySelector('[part="overlay"]')
        .getAnimations()
        .map((animation) => animation.animationName);
      expect(names).to.include('--fade');
      expect(names).to.include('--transform');
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

    it('should not limit the height of a card that is not animating', async () => {
      notification.renderer = (root) => {
        root.textContent = 'Notification. '.repeat(400);
      };
      notification.opened = true;
      await oneEvent(card, 'animationend');

      // A card that has finished opening must not be cut off, however tall its content is
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

      // The height animation this suppresses only exists where `interpolate-size` is unsupported,
      // so this is a real assertion in Firefox and Safari and a no-op in Chromium.
      it('should not animate the height of the card', () => {
        notification.opened = true;

        const { animationName, transitionDuration } = getComputedStyle(card);
        expect(animationName).to.equal('--no-op');
        expect(transitionDuration).to.equal('0s');
      });
    });
  });
});
