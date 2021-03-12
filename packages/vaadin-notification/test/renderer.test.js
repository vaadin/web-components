import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import '../vaadin-notification.js';

describe('vaadin-notification', () => {
  let rendererContent;

  beforeEach(() => {
    rendererContent = document.createElement('p');
    rendererContent.textContent = 'renderer-content';
  });

  describe('without template', () => {
    let notification;

    beforeEach(() => {
      notification = fixtureSync('<vaadin-notification></vaadin-notification>');

      // Force sync card attaching and removal instead of waiting for the animation
      sinon
        .stub(notification, '_animatedAppendNotificationCard')
        .callsFake(() => notification._appendNotificationCard());
      sinon
        .stub(notification, '_animatedRemoveNotificationCard')
        .callsFake(() => notification._removeNotificationCard());

      notification.open();
    });

    afterEach(() => {
      // Close to stop all pending timers.
      notification.close();
      // delete singleton reference, so as it's created in next test
      delete notification.constructor._container;
    });

    it('should use renderer when it is defined', () => {
      notification.renderer = (root) => {
        root.appendChild(rendererContent);
      };
      notification.opened = true;
      expect(notification._card.textContent.trim()).to.equal('renderer-content');
    });

    it('renderer should receive notification when defined', () => {
      notification.renderer = (root, notification) => {
        expect(notification).to.eql(notification);
      };
    });

    it('should remove template when added after renderer', () => {
      notification.renderer = () => {};
      const template = document.createElement('template');
      expect(() => {
        notification.appendChild(template);
        notification._observer.flush();
      }).to.throw(Error);
      expect(notification._notificationTemplate).to.be.not.ok;
    });

    it('should be possible to manually invoke renderer', () => {
      notification.renderer = sinon.spy();
      notification.opened = true;
      expect(notification.renderer.calledOnce).to.be.true;
      notification.render();
      expect(notification.renderer.calledTwice).to.be.true;
    });

    it('should provide root from the previous renderer call', () => {
      notification.renderer = (root) => {
        const generatedContent = document.createTextNode('rendered');
        root.appendChild(generatedContent);
      };
      notification.opened = true;
      notification.opened = false;
      notification.opened = true;
      expect(notification._card.textContent.trim()).to.equal('renderedrendered');
    });

    it('should clear the root when renderer changed', () => {
      for (let i = 0; i < 2; i++) {
        notification.renderer = (root) => {
          const generatedContent = document.createTextNode('rendered-' + i);
          root.appendChild(generatedContent);
        };
        notification.opened = true;
        expect(notification._card.textContent.trim()).to.equal('rendered-' + i);
      }
    });

    it('should open notification when renderer is defined after notification opened', () => {
      notification.opened = true;
      notification.renderer = (root) => {
        root.appendChild(rendererContent);
      };
      const clientRect = notification._card.getBoundingClientRect();
      expect(clientRect.x).to.not.equal(0);
      expect(clientRect.y).to.not.equal(0);
      expect(clientRect.width).to.not.equal(0);
      expect(clientRect.height).to.not.equal(0);
      expect(clientRect.top).to.not.equal(0);
    });
  });

  describe('with template', () => {
    let notification;

    beforeEach(() => {
      notification = fixtureSync(`
        <vaadin-notification>
          <template>
            notification-content
          </template>
        </vaadin-notification>
      `);

      // Force sync card attaching and removal instead of waiting for the animation
      sinon
        .stub(notification, '_animatedAppendNotificationCard')
        .callsFake(() => notification._appendNotificationCard());
      sinon
        .stub(notification, '_animatedRemoveNotificationCard')
        .callsFake(() => notification._removeNotificationCard());

      notification.open();
    });

    afterEach(() => {
      // Close to stop all pending timers.
      notification.close();
      // delete singleton reference, so as it's created in next test
      delete notification.constructor._container;
    });

    it('should fallback to render content with Templatizer when renderer is not defined', () => {
      expect(notification._card.textContent.trim()).to.equal('notification-content');
    });

    it('should throw an error when setting a renderer if there is already a template', () => {
      notification._observer.flush();
      expect(() => (notification.renderer = () => {})).to.throw(Error);
    });

    it('should remove renderer when added after template', () => {
      expect(() => (notification.renderer = () => {})).to.throw(Error);
      expect(notification.renderer).to.be.not.ok;
    });
  });
});
