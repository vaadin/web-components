import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@open-wc/testing-helpers';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../vaadin-notification.js';

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
  { moduleId: 'vaadin-notification-card-animation-theme' }
);

describe('animated notifications', () => {
  let wrapper, notifications, container;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-notification position="bottom-center">
          <template>Notification</template>
        </vaadin-notification>
        <vaadin-notification position="middle">
          <template>Notification</template>
        </vaadin-notification>
      </div>
    `);
    notifications = Array.from(wrapper.children);
    container = notifications[0]._container;

    // Change default duration and wait for both notifications to be opened
    const duration = 20;
    notifications.forEach((elm) => {
      elm.duration = duration;
      elm.opened = true;
    });
    await aTimeout(duration);
  });

  afterEach(() => {
    notifications.forEach((n) => n.close());
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
  });
});
