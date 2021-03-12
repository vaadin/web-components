import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../vaadin-notification.js';

registerStyles(
  'vaadin-notification-card',
  css`
    :host {
      width: 200px;
      background: lightgrey;
      animation: none !important;
    }
  `,
  { moduleId: 'vaadin-notification-card-multiple-theme' }
);

describe('multiple notification', () => {
  let wrapper, notifications, container, regions;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-notification opened position="top-stretch"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="top-start"><template>Notification 1</template></vaadin-notification>
        <vaadin-notification opened position="top-center"><template>Notification 1</template></vaadin-notification>
        <vaadin-notification opened position="top-end"><template>Notification 1</template></vaadin-notification>
        <vaadin-notification opened position="middle"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-start"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-center"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-end"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-stretch"><template>Notification</template></vaadin-notification>

        <vaadin-notification opened position="top-stretch"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="top-start"><template>Notification 2</template></vaadin-notification>
        <vaadin-notification opened position="top-center"><template>Notification 2</template></vaadin-notification>
        <vaadin-notification opened position="top-end"><template>Notification 2</template></vaadin-notification>
        <vaadin-notification opened position="middle"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-start"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-center"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-end"><template>Notification</template></vaadin-notification>
        <vaadin-notification opened position="bottom-stretch"><template>Notification</template></vaadin-notification>
      </div>
    `);
    notifications = Array.from(wrapper.children);
    container = notifications[0]._container;
    // Object.values is unsupported in old browsers
    regions = Array.from(container.shadowRoot.querySelectorAll('[region]'));
    // To ensure computed styles are applied.
    await aTimeout();
  });

  afterEach(() => {
    // Close everything to stop all pending timers.
    notifications.forEach((el) => {
      el.close();
      el._removeNotificationCard();
    });
    // delete singleton reference, so as it's created in next test
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
        'bottom-stretch'
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
    it('content should ignore pointer events', () => {
      expect(getComputedStyle(container)['pointer-events']).to.equal('none');
    });

    it('notification should respond to pointer events', () => {
      notifications.forEach((e) => {
        const overlay = e._card.shadowRoot.querySelector('[part="overlay"]');
        expect(getComputedStyle(overlay)['pointer-events']).to.be.equal('auto');
      });
    });

    it('host should have flex-direction column', () => {
      expect(getComputedStyle(container).flexDirection).to.equal('column');
    });

    it('host should have align items stretch', () => {
      expect(getComputedStyle(container).alignItems).to.equal('stretch');
    });

    it('host should have align items stretch', () => {
      expect(getComputedStyle(container).alignItems).to.equal('stretch');
    });

    it('all region groups and host should be flex containers', () => {
      const groups = Array.from(container.shadowRoot.querySelectorAll('[region-group]'));
      groups.push(container);
      groups.forEach((el) => {
        expect(getComputedStyle(el).display).to.equal('flex');
      });
    });

    it('all regions should be block containers', () => {
      regions.forEach((el) => {
        expect(getComputedStyle(el).display).to.equal('block');
      });
    });

    it('all region groups should have flex-direction row', () => {
      [
        container.shadowRoot.querySelector('[region-group="top"]'),
        container.shadowRoot.querySelector('[region-group="bottom"]')
      ].forEach((el) => {
        expect(getComputedStyle(el).flexDirection).to.equal('row');
      });
    });

    it('all region groups should have equal flex stretching', () => {
      [
        container.shadowRoot.querySelector('[region-group="top"]'),
        container.shadowRoot.querySelector('[region-group="bottom"]')
      ].forEach((el) => {
        expect(getComputedStyle(el).flexGrow).to.equal('1');
        expect(parseFloat(getComputedStyle(el).flexBasis)).to.equal(0);
      });
    });

    it('all grouped regions should have equal flex stretching', () => {
      Array.from(container.shadowRoot.querySelectorAll('[region-group] > [region]')).forEach((el) => {
        expect(getComputedStyle(el).flexGrow).to.equal('1');
        expect(parseFloat(getComputedStyle(el).flexBasis)).to.equal(0);
      });
    });

    it('middle region should not have flex stretching', () => {
      const middleRegion = container.shadowRoot.querySelector('[region="middle"]');
      expect(getComputedStyle(middleRegion).flexGrow).to.equal('0');
      expect(getComputedStyle(middleRegion).flexBasis).to.equal('auto');
    });

    it('top region group should align regions to start', () => {
      const topRegion = container.shadowRoot.querySelector('[region-group="top"]');
      expect(getComputedStyle(topRegion).alignItems).to.equal('flex-start');
    });

    it('bottom region group should align regions to end', () => {
      const bottomRegion = container.shadowRoot.querySelector('[region-group="bottom"]');
      expect(getComputedStyle(bottomRegion).alignItems).to.equal('flex-end');
    });
  });
});
