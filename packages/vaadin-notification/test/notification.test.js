import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import '../vaadin-notification.js';

describe('vaadin-notification', () => {
  let notification;

  beforeEach(() => {
    notification = fixtureSync(`
      <vaadin-notification duration="20">
        <template>
          Your work has been <strong>saved</strong>
        </template>
      </vaadin-notification>
    `);

    // Force sync card attaching and removal instead of waiting for the animation
    sinon.stub(notification, '_animatedAppendNotificationCard').callsFake(() => notification._appendNotificationCard());
    sinon.stub(notification, '_animatedRemoveNotificationCard').callsFake(() => notification._removeNotificationCard());

    notification.open();
  });

  afterEach(() => {
    // Close to stop all pending timers.
    notification.close();
    // delete singleton reference, so as it's created in next test
    delete notification.constructor._container;
  });

  describe('vaadin-notification-container', () => {
    it('should be in the body when notification opens', () => {
      expect(document.body.querySelectorAll('vaadin-notification-container').length).to.be.equal(1);
    });

    it('should not be in the body when notifications close', () => {
      notification.close();
      notification._removeNotificationCard();
      expect(document.body.querySelectorAll('vaadin-notification-container').length).to.be.equal(0);
    });

    it('should not be in the body when notification reopens', () => {
      notification.close();
      notification._removeNotificationCard();
      notification.open();
      expect(document.body.querySelectorAll('vaadin-notification-container').length).to.be.equal(1);
    });

    it('should be visible after opening', () => {
      var isVisible = (elem) => !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      expect(isVisible(document.body.querySelector('vaadin-notification-container'))).to.be.true;
    });

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    (iOS ? describe : describe.skip)('iOS incorrect viewport height workaround', () => {
      let container;

      beforeEach(() => {
        container = document.body.querySelector('vaadin-notification-container');
      });

      it('should set value to bottom when landscape and clientHeight > innerHeight', () => {
        // NOTE(web-padawan): have to use stubs to emulate the landscape mode.
        const clientHeight = sinon.stub(document.documentElement, 'clientHeight').get(() => 200);
        const innerHeight = sinon.stub(window, 'innerHeight').get(() => 175);
        const innerWidth = sinon.stub(window, 'innerWidth').get(() => 300);

        expect(getComputedStyle(container).getPropertyValue('bottom')).to.equal('0px');
        container._detectIosNavbar();

        expect(getComputedStyle(container).getPropertyValue('bottom')).to.not.equal('0px');

        clientHeight.restore();
        innerHeight.restore();
        innerWidth.restore();
      });

      it('should apply the workaround on open', () => {
        container.opened = false;
        sinon.spy(container, '_detectIosNavbar');
        container.opened = true;
        expect(container._detectIosNavbar.called).to.be.true;
        container._detectIosNavbar.restore();
      });

      it('should apply the workaround on resize', () => {
        sinon.spy(container, '_detectIosNavbar');
        window.dispatchEvent(new CustomEvent('resize'));
        expect(container._detectIosNavbar.called).to.be.true;
        container._detectIosNavbar.restore();
      });
    });
  });

  describe('a11y', () => {
    it('notification card should have the `alert` role', () => {
      expect(notification._card.getAttribute('role')).to.be.equal('alert');
    });

    it('notification card should have `aria-live="polite"`', () => {
      expect(notification._card.getAttribute('aria-live')).to.be.equal('polite');
    });

    it('notification card should have correct `aria-label`', () => {
      expect(notification._card.getAttribute('aria-label')).to.be.equal('Your work has been saved');
    });
  });

  describe('methods', () => {
    it('should close the notification when close() is executed', () => {
      expect(notification.opened).to.be.true;
      notification.close();
      expect(notification.opened).to.be.false;
    });

    it('should open the notification when open() is executed', () => {
      notification.close();
      notification.open();
      expect(notification.opened).to.be.true;
    });
  });

  describe('duration', () => {
    it('should close the notification after duration', async () => {
      await aTimeout(20);
      expect(notification.opened).to.be.false;
    });

    it('should reconfigure the close timer if duration changes', async () => {
      notification.duration = 10;
      await aTimeout(10);
      expect(notification.opened).to.be.false;
    });

    [undefined, null, NaN, 0].forEach((timeout) => {
      it(`should not close the notification if duration is ${timeout}`, async () => {
        notification.duration = timeout;
        await aTimeout(1);
        expect(notification.opened).to.be.true;
      });
    });
  });
});
