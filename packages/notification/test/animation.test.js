import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './animation-test-styles.js';
import '../src/vaadin-notification.js';

describe('animated notifications', () => {
  let wrapper, notifications, container;

  const animationDuration = 20;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-notification position="bottom-center"></vaadin-notification>
        <vaadin-notification position="middle"></vaadin-notification>
      </div>
    `);
    await nextFrame();
    notifications = Array.from(wrapper.children);
    container = notifications[0]._container;

    notifications[0]._card.style.animation = 'none';
    notifications[1]._card.style.animationDuration = `${animationDuration}ms`;

    notifications.forEach((elm) => {
      elm.duration = -1;
      elm.opened = true;
      elm.renderer = (root) => {
        root.textContent = 'Notification';
      };
    });

    // Notification 0 has no animation, it is fully opened immediately
    // Notification 1 has animation, it is fully opened after the animation ends.
    // Let's, however, start the tests while the opening animation is still running.
    await aTimeout(animationDuration / 2);
  });

  afterEach(async () => {
    notifications.forEach((n) => n.close());
    // Wait for the notification container to be removed
    while (document.querySelector('body > vaadin-notification-container')) {
      await aTimeout(1);
    }
  });

  describe('animation', () => {
    it('should remove card immediately if no animation defined', () => {
      notifications[0].close();
      expect(notifications[0]._card.parentNode).not.to.be.ok;
    });

    it('should not remove card after timeout if animation running', () => {
      notifications[1].close();
      expect(notifications[1]._card.parentNode).to.be.ok;
    });

    it('should remove card after animation', async () => {
      notifications[1].close();
      await oneEvent(notifications[1]._card, 'animationend');
      expect(notifications[1]._card.parentNode).not.to.be.ok;
    });

    it('should close the container when all active notifications disappear', async () => {
      notifications[0].close();
      notifications[1].close();
      await oneEvent(notifications[1]._card, 'animationend');
      expect(container.opened).to.be.false;
    });

    it('should set `closing` attribute and remove later', async () => {
      notifications[0].close();
      notifications[1].close();
      expect(notifications[0]._card.hasAttribute('closing')).to.be.false;
      expect(notifications[1]._card.hasAttribute('closing')).to.be.true;
      await oneEvent(notifications[1]._card, 'animationend');
      expect(notifications[0]._card.hasAttribute('closing')).to.be.false;
      expect(notifications[1]._card.hasAttribute('closing')).to.be.false;
    });

    it('should not allow pointer events on the card while closing', () => {
      notifications[1].close();

      const overlayPart = notifications[1]._card.shadowRoot.querySelector('[part="overlay"]');
      expect(getComputedStyle(overlayPart).pointerEvents).to.equal('none');
    });

    it('should not allow pointer events on the card content while closing', () => {
      const button = document.createElement('button');
      button.style.pointerEvents = 'auto';
      notifications[1]._card.appendChild(button);

      notifications[1].close();

      expect(getComputedStyle(button).pointerEvents).to.equal('none');
    });

    it('should set `opening` attribute and remove later', async () => {
      notifications[1].close();
      await oneEvent(notifications[1]._card, 'animationend');
      notifications[1].open();
      expect(notifications[1]._card.hasAttribute('opening')).to.be.true;
      await oneEvent(notifications[1]._card, 'animationend');
      expect(notifications[1]._card.hasAttribute('opening')).to.be.false;
    });

    describe('simultaneous opening and closing', () => {
      let notification, card;

      beforeEach(() => {
        // Use the animated notification for these tests
        notification = notifications[1];
        card = notification._card;
        // Close the non-animated notification as it's not relevant for these tests
        notifications[0].close();
      });

      it('should remain opened after closing and opening', async () => {
        // Simultanously close and open the animated notification
        notification.close();
        notification.open();
        await oneEvent(card, 'animationend');

        expect(notification.opened).to.be.true;
        expect(card.hasAttribute('closing')).to.be.false;
        expect(card.hasAttribute('opening')).to.be.false;
        expect(container.parentNode).to.equal(document.body);
        expect(container.contains(card)).to.be.true;
      });

      it('should remain closed after opening and closing', async () => {
        // Simultanously open and close the animated notification
        notification.close();
        notification.open();
        notification.close();
        await oneEvent(card, 'animationend');

        expect(notification.opened).to.be.false;
        expect(card.hasAttribute('closing')).to.be.false;
        expect(card.hasAttribute('opening')).to.be.false;
        expect(container.parentNode).to.not.equal(document.body);
      });
    });
  });
});

describe('notification that does not animate', () => {
  let notification, card;

  beforeEach(async () => {
    notification = fixtureSync('<vaadin-notification duration="-1"></vaadin-notification>');
    notification.renderer = (root) => {
      root.textContent = 'Notification';
    };
    await nextFrame();
    card = notification._card;
  });

  afterEach(async () => {
    notification.close();
    // Wait for the notification container to be removed
    while (document.querySelector('body > vaadin-notification-container')) {
      await aTimeout(1);
    }
  });

  it('should remove the opening attribute without waiting for animationend', () => {
    card.style.animation = 'none';
    notification.open();

    expect(card.hasAttribute('opening')).to.be.false;
  });

  it('should remove a card that is not rendered but has an animation name', () => {
    const closedSpy = sinon.spy();
    notification.addEventListener('closed', closedSpy);

    notification.open();
    // The card has an animation name from `:host([closing])`, but a card that is
    // not rendered never fires `animationend`.
    card.style.display = 'none';
    notification.close();

    expect(card.parentNode).to.be.not.ok;
    expect(closedSpy).to.be.calledOnce;
  });
});

describe('animationend from the notification content', () => {
  let notification, card;

  beforeEach(async () => {
    notification = fixtureSync('<vaadin-notification duration="-1"></vaadin-notification>');
    notification.renderer = (root) => {
      root.innerHTML = '<div>Notification</div>';
    };
    await nextFrame();
    card = notification._card;
  });

  afterEach(async () => {
    notification.opened = false;
    // Wait for the notification container to be removed
    while (document.querySelector('body > vaadin-notification-container')) {
      await aTimeout(1);
    }
  });

  // The content is in the light DOM of the card, so an animation of its own ends on the card
  function endContentAnimation() {
    card.querySelector('div').dispatchEvent(new AnimationEvent('animationend', { bubbles: true }));
  }

  it('should not clear the opening attribute', () => {
    notification.opened = true;
    expect(card.hasAttribute('opening')).to.be.true;

    endContentAnimation();

    expect(card.hasAttribute('opening')).to.be.true;
  });

  it('should not remove the card while it is closing', async () => {
    notification.opened = true;
    await oneEvent(card, 'animationend');

    const closedSpy = sinon.spy();
    notification.addEventListener('closed', closedSpy);
    notification.close();

    endContentAnimation();

    expect(card.parentNode).to.be.ok;
    expect(closedSpy).to.be.not.called;
  });
});
