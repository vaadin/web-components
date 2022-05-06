import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-notification.js';

describe('renderer', () => {
  describe('basic', () => {
    let notification;
    let rendererContent;

    beforeEach(() => {
      rendererContent = document.createElement('p');
      rendererContent.textContent = 'renderer-content';

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
      // Delete singleton reference, so as it's created in next test
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

    it('should run renderers when requesting content update', () => {
      notification.renderer = sinon.spy();
      notification.opened = true;

      expect(notification.renderer.calledOnce).to.be.true;

      notification.requestContentUpdate();

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
          const generatedContent = document.createTextNode(`rendered-${i}`);
          root.appendChild(generatedContent);
        };
        notification.opened = true;
        expect(notification._card.textContent.trim()).to.equal(`rendered-${i}`);
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

    it('should clear the notification card when removing the renderer', () => {
      notification.opened = true;
      notification.renderer = (root) => {
        root.innerHTML = 'foo';
      };

      expect(notification._card.textContent).to.equal('foo');

      notification.renderer = null;

      expect(notification._card.textContent).to.equal('');
    });
  });

  describe('set before connected', () => {
    let notification;

    beforeEach(() => {
      notification = document.createElement('vaadin-notification');
    });

    afterEach(() => {
      document.body.removeChild(notification);
    });

    it('should not throw when the renderer is set before adding to DOM', () => {
      expect(() => {
        notification.renderer = () => {};
        document.body.appendChild(notification);
      }).to.not.throw(Error);
    });
  });
});
