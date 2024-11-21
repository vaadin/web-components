import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/notification';
import '@vaadin/popover';
import '@vaadin/tooltip';

describe('notification and overlays', () => {
  describe('notification and tooltip', () => {
    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <vaadin-notification></vaadin-notification>
          <div id="target"></div>
          <vaadin-tooltip for="target" text="Tooltip" manual></vaadin-tooltip>
        </div>
      `);
      const notification = wrapper.querySelector('vaadin-notification');
      const tooltip = wrapper.querySelector('vaadin-tooltip');
      notification.opened = true;
      tooltip.opened = true;
      await nextRender();
    });

    it('should show tooltips above notifications', () => {
      const notificationContainer = document.querySelector('vaadin-notification-container');
      const tooltipOverlay = document.querySelector('vaadin-tooltip-overlay');

      const notificationZIndex = parseInt(getComputedStyle(notificationContainer).zIndex);
      const tooltipZIndex = parseInt(getComputedStyle(tooltipOverlay).zIndex);

      expect(tooltipZIndex).to.be.above(notificationZIndex);
    });
  });

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <vaadin-notification></vaadin-notification>
        <div id="target"></div>
        <vaadin-popover for="target" manual></vaadin-popover>
      </div>
    `);
    const notification = wrapper.querySelector('vaadin-notification');
    const popover = wrapper.querySelector('vaadin-popover');
    popover.renderer = (root) => {
      root.textContent = 'Popover content';
    };
    notification.opened = true;
    popover.opened = true;
    await nextRender();
  });

  it('should show popovers above notifications', () => {
    const notificationContainer = document.querySelector('vaadin-notification-container');
    const tooltipOverlay = document.querySelector('vaadin-popover-overlay');

    const notificationZIndex = parseInt(getComputedStyle(notificationContainer).zIndex);
    const tooltipZIndex = parseInt(getComputedStyle(tooltipOverlay).zIndex);

    expect(tooltipZIndex).to.be.above(notificationZIndex);
  });
});
