import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-notification.js';

describe('multiple notification', () => {
  let wrapper, notifications, container;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-notification opened position="top-stretch"></vaadin-notification>
        <vaadin-notification opened position="top-start" suffix=" 1"></vaadin-notification>
        <vaadin-notification opened position="top-center" suffix=" 1"></vaadin-notification>
        <vaadin-notification opened position="top-end" suffix=" 1"></vaadin-notification>
        <vaadin-notification opened position="middle"></vaadin-notification>
        <vaadin-notification opened position="bottom-start"></vaadin-notification>
        <vaadin-notification opened position="bottom-center"></vaadin-notification>
        <vaadin-notification opened position="bottom-end"></vaadin-notification>
        <vaadin-notification opened position="bottom-stretch"></vaadin-notification>

        <vaadin-notification opened position="top-stretch"></vaadin-notification>
        <vaadin-notification opened position="top-start" suffix=" 2"></vaadin-notification>
        <vaadin-notification opened position="top-center" suffix=" 2"></vaadin-notification>
        <vaadin-notification opened position="top-end" suffix=" 2"></vaadin-notification>
        <vaadin-notification opened position="middle"></vaadin-notification>
        <vaadin-notification opened position="bottom-start"></vaadin-notification>
        <vaadin-notification opened position="bottom-center"></vaadin-notification>
        <vaadin-notification opened position="bottom-end"></vaadin-notification>
        <vaadin-notification opened position="bottom-stretch"></vaadin-notification>
      </div>
    `);
    notifications = Array.from(wrapper.children);
    notifications.forEach((notification) => {
      notification.renderer = (root) => {
        root.textContent = `Notification${notification.getAttribute('suffix') || ''}`;
      };
    });

    container = notifications[0]._container;
    // To ensure computed styles are applied.
    await aTimeout();
  });

  afterEach(() => {
    // Close everything to stop all pending timers.
    notifications.forEach((el) => {
      el.close();
      el._removeNotificationCard();
    });
    // Delete singleton reference, so as it's created in next test
    delete notifications[0].constructor._container;
  });

  describe('vaadin-notification-container', () => {
    it('should be only one instance of vaadin-notification-container in the dom', () => {
      expect(document.body.querySelectorAll('vaadin-notification-container').length).to.be.equal(1);
    });

    it('container should be a singleton', () => {
      expect(notifications[0]._container).to.be.equal(notifications[1]._container);
    });
  });

  describe('regions', () => {
    it('should have a named slot per notification region', () => {
      [
        'top-stretch',
        'top-start',
        'top-center',
        'top-end',
        'middle',
        'bottom-start',
        'bottom-center',
        'bottom-end',
        'bottom-stretch',
      ].forEach((regionName) => {
        const region = container.shadowRoot.querySelector(`[region="${regionName}"]`);
        expect(region).to.not.be.null;
        expect(region.firstElementChild.localName).to.equal('slot');
        expect(region.firstElementChild.getAttribute('name')).to.equal(regionName);
      });
    });

    it('should insert notifications in the correct region', () => {
      notifications.forEach((n) => {
        expect(n._card.slot).to.equal(n.position);
      });
    });

    it('should move notification if position changes', () => {
      const e = notifications[0];
      expect(e._card.slot).to.equal('top-stretch');

      e.position = 'bottom-stretch';
      expect(e._card.slot).to.equal('bottom-stretch');
    });

    it('should not move notification and display a warning message on invalid orientation', () => {
      sinon.stub(console, 'warn');

      const e = notifications[1];
      const initialRegion = e._card.parentNode;
      e.position = 'foo';
      expect(e._card.parentNode).to.be.equal(initialRegion);
      expect(console.warn.calledOnce).to.be.true;

      console.warn.restore();
    });

    it('should remove notification from the region when it is closed', async () => {
      const n = notifications[1];
      n.close();
      await aTimeout();
      expect(n._card.parentNode).not.to.be.ok;
    });

    it('should stack top notifications on top of each other', () => {
      ['top-start', 'top-center', 'top-end'].forEach((regionName) => {
        const notifications = Array.from(container.querySelectorAll(`vaadin-notification-card[slot="${regionName}"]`));
        expect(notifications[0].offsetTop).to.be.below(notifications[1].offsetTop);
        expect(notifications[0].innerText.trim()).to.be.equal('Notification 2');
        expect(notifications[1].innerText.trim()).to.be.equal('Notification 1');
      });
    });
  });

  describe('styles', () => {
    it('container should ignore pointer events', () => {
      expect(getComputedStyle(container)['pointer-events']).to.equal('none');
    });

    it('notification should respond to pointer events', () => {
      notifications.forEach((e) => {
        const overlay = e._card.shadowRoot.querySelector('[part="overlay"]');
        expect(getComputedStyle(overlay)['pointer-events']).to.be.equal('auto');
      });
    });
  });
});
