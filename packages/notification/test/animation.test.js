import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-notification.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-notification-card',
  css`
    @keyframes test-animation {
      100% {
        opacity: 0;
      }
    }

    :host {
      width: 200px;
      background: lightgrey;
    }

    :host([slot^='bottom']) {
      animation: none !important;
    }

    :host([slot='middle'][closing]) {
      animation: test-animation 100ms;
    }
  `,
  { moduleId: 'vaadin-notification-card-animation-theme' },
);

describe('animated notifications', () => {
  let wrapper, notifications, container;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-notification position="bottom-center"></vaadin-notification>
        <vaadin-notification position="middle"></vaadin-notification>
      </div>
    `);
    notifications = Array.from(wrapper.children);
    container = notifications[0]._container;

    // Change default duration and wait for both notifications to be opened
    const duration = 20;
    notifications.forEach((elm) => {
      elm.duration = duration;
      elm.opened = true;
      elm.renderer = (root) => {
        root.textContent = 'Notification';
      };
    });
    await aTimeout(duration);
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
      expect(notifications[0]._card.parentNode).not.to.be.ok;
    });

    it('should not remove card after timeout if animation running', () => {
      expect(notifications[1]._card.parentNode).to.be.ok;
    });

    it('should remove card after animation', async () => {
      await oneEvent(notifications[1]._card, 'animationend');
      expect(notifications[1]._card.parentNode).not.to.be.ok;
    });

    it('should close the container when all active notifications disappear', async () => {
      await oneEvent(notifications[1]._card, 'animationend');
      expect(container.opened).to.be.false;
    });

    it('should set `closing` attribute and remove later', async () => {
      expect(notifications[0]._card.hasAttribute('closing')).to.be.false;
      expect(notifications[1]._card.hasAttribute('closing')).to.be.true;
      await oneEvent(notifications[1]._card, 'animationend');
      expect(notifications[0]._card.hasAttribute('closing')).to.be.false;
      expect(notifications[1]._card.hasAttribute('closing')).to.be.false;
    });

    it('should set `opening` attribute and remove later', async () => {
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
