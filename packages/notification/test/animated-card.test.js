import { expect } from '@vaadin/chai-plugins';
import { emulateMedia } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-notification.js';
import { shouldAnimate } from '@vaadin/overlay/src/vaadin-overlay-utils.js';

// This file deliberately does not import `not-animated-styles.css`, so that it covers the
// animation the card has by default.
describe('animated notification card', () => {
  let notification, card;

  // Longer than the closing animation, which runs for twice the animation duration
  const animationTimeout = 700;

  beforeEach(async () => {
    notification = fixtureSync('<vaadin-notification duration="-1"></vaadin-notification>');
    notification.renderer = (root) => {
      root.textContent = 'Notification';
    };
    await nextRender();
    card = notification._card;
  });

  afterEach(async () => {
    notification.opened = false;
    await aTimeout(animationTimeout);
  });

  it('should animate the card by default', () => {
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
    await aTimeout(animationTimeout);

    notification.close();

    expect(card.hasAttribute('closing')).to.be.true;
    expect(card.parentNode).to.be.ok;
  });

  it('should remove the card and fire closed when the closing animation ends', async () => {
    notification.opened = true;
    await aTimeout(animationTimeout);

    const closedSpy = sinon.spy();
    notification.addEventListener('closed', closedSpy);

    notification.close();
    await oneEvent(notification, 'closed');

    expect(card.parentNode).to.be.not.ok;
    expect(closedSpy).to.be.calledOnce;
  });

  describe('prefers-reduced-motion', () => {
    before(async () => {
      await emulateMedia({ reducedMotion: 'reduce' });
    });

    after(async () => {
      await emulateMedia({ reducedMotion: 'no-preference' });
    });

    it('should not animate the height of the card', () => {
      notification.opened = true;

      // The card still reports its state, but nothing moves
      const { animationName, transitionDuration } = getComputedStyle(card);
      expect(animationName).to.equal('--no-op');
      expect(transitionDuration).to.equal('0s');
    });
  });

  it('should not limit the height of a card that is not animating', async () => {
    notification.renderer = (root) => {
      root.textContent = 'Notification. '.repeat(400);
    };
    notification.opened = true;
    await aTimeout(animationTimeout);

    // A resting card must not be cut off, however tall its content is
    expect(getComputedStyle(card).maxHeight).to.equal('none');
    expect(card.getBoundingClientRect().height).to.be.above(400);
  });
});
