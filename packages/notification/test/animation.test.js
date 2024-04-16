import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-notification.js';

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

  afterEach(() => {
    notifications.forEach((n) => n.close());
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

    it('should set `opening` attribute and remove later', async () => {
      notifications[1].close();
      await oneEvent(notifications[1]._card, 'animationend');
      notifications[1].open();
      expect(notifications[1]._card.hasAttribute('opening')).to.be.true;
      await oneEvent(notifications[1]._card, 'animationend');
      expect(notifications[1]._card.hasAttribute('opening')).to.be.false;
    });
  });
});
