import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, isIOS, listenOnce, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-notification.js';

describe('vaadin-notification', () => {
  let notification, container, showPopoverSpy, hidePopoverSpy;

  beforeEach(async () => {
    notification = fixtureSync(`
      <vaadin-notification duration="20"></vaadin-notification>
    `);
    container = notification._container;
    showPopoverSpy = sinon.spy(container, 'showPopover');
    hidePopoverSpy = sinon.spy(container, 'hidePopover');

    await nextFrame();

    notification.renderer = (root) => {
      root.innerHTML = `Your work has been <strong>saved</strong>`;
    };

    notification.open();
  });

  afterEach(() => {
    // Close all notifications to stop all pending timers.
    document.querySelectorAll('vaadin-notification').forEach((n) => {
      n.close();
    });
    // Delete singleton reference, so as it's created in next test
    delete notification.constructor._container;
  });

  it('should not set an ID attribute for the card', () => {
    expect(notification._card.getAttribute('id')).to.be.null;
  });

  it('should enforce display: none to hide the host element', () => {
    notification.style.display = 'block';
    expect(getComputedStyle(notification).display).to.equal('none');
  });

  it('should close on detach', async () => {
    expect(notification.opened).to.be.true;
    notification.remove();
    await aTimeout(0);
    expect(notification.opened).to.be.false;
  });

  it('should stay open after immediate reattach', async () => {
    expect(notification.opened).to.be.true;
    const parent = notification.parentNode;
    parent.appendChild(notification);
    await aTimeout(0);
    expect(notification.opened).to.be.true;
  });

  it('should dispatch closed event', async () => {
    const spy = sinon.spy();
    notification.addEventListener('closed', spy);
    notification.opened = false;
    await aTimeout(0);
    expect(spy.calledOnce).to.be.true;
  });

  it('closed event should be called after overlay is closed', async () => {
    const closedPromise = new Promise((resolve) => {
      const closedListener = () => {
        expect(notification._container.parentElement).to.be.not.ok;
        resolve();
      };
      listenOnce(notification, 'closed', closedListener);
    });
    notification.opened = false;
    await aTimeout(0);
    await closedPromise;
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

    it('should be in the body when notification reopens', () => {
      notification.close();
      notification._removeNotificationCard();
      notification.open();
      expect(document.body.querySelectorAll('vaadin-notification-container').length).to.be.equal(1);
    });

    it('should be visible after opening', () => {
      const isVisible = (elem) => !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      expect(isVisible(document.body.querySelector('vaadin-notification-container'))).to.be.true;
    });

    it('should open as native popover', () => {
      expect(container.popover).to.equal('manual');
      expect(container.opened).to.be.true;
      expect(showPopoverSpy.calledOnce).to.be.true;
    });

    it('should close native popover when notifications close', () => {
      notification.close();

      expect(container.opened).to.be.false;
      expect(hidePopoverSpy.calledOnce).to.be.true;
    });

    it('should reopen native popover when notifications open', () => {
      notification.close();
      notification._removeNotificationCard();
      notification.open();

      expect(container.opened).to.be.true;
      expect(showPopoverSpy.calledTwice).to.be.true;
    });

    it('should bring native popover to top of overlay stack when another notification opens', () => {
      showPopoverSpy.resetHistory();

      const anotherNotification = fixtureSync(`
      <vaadin-notification duration="20"></vaadin-notification>
    `);
      anotherNotification.open();

      // Bringing to front involves hiding and showing the popover again
      expect(hidePopoverSpy.calledOnce).to.be.true;
      expect(showPopoverSpy.calledOnce).to.be.true;
      expect(hidePopoverSpy.calledBefore(showPopoverSpy)).to.be.true;
    });

    (isIOS ? describe : describe.skip)('iOS incorrect viewport height workaround', () => {
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

    it('should update `aria-live` to "assertive" when assertive is set to true', () => {
      notification.assertive = true;
      expect(notification._card.getAttribute('aria-live')).to.be.equal('assertive');
    });

    it('should update `aria-live` to "polite" when assertive is set to false', () => {
      notification.assertive = true;

      notification.assertive = false;
      expect(notification._card.getAttribute('aria-live')).to.be.equal('polite');
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

  describe('theme', () => {
    it('should propagate theme attribute to card', async () => {
      notification.setAttribute('theme', 'foo');
      await nextFrame();

      expect(notification._card.getAttribute('theme')).to.equal('foo');
    });
  });
});
