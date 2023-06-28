import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/notification';
import '@vaadin/tooltip';

describe('notification and tooltip', () => {
  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <vaadin-notification></vaadin-notification>
        <div id="target"></div>
        <vaadin-tooltip for="target" text="Tooltip"></vaadin-tooltip>
      </div>
    `);
    const notification = wrapper.querySelector('vaadin-notification');
    notification.opened = true;
    const tooltip = wrapper.querySelector('vaadin-tooltip');
    tooltip.manual = true;
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
