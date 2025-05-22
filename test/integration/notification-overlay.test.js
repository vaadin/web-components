import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/notification/src/vaadin-notification.js';
import '@vaadin/popover/src/vaadin-popover.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';

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

  describe('notification and popover', () => {
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
      const popoverOverlay = document.querySelector('vaadin-popover-overlay');

      const notificationZIndex = parseInt(getComputedStyle(notificationContainer).zIndex);
      const popoverZIndex = parseInt(getComputedStyle(popoverOverlay).zIndex);

      expect(popoverZIndex).to.be.above(notificationZIndex);
    });
  });

  describe('notification and dialog', () => {
    let dialog1, dialog2, notification;

    beforeEach(async () => {
      dialog1 = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      await nextRender();

      dialog1.renderer = (root) => {
        if (!root.firstChild) {
          notification = document.createElement('vaadin-notification');
          notification.renderer = (root2) => {
            root2.textContent = 'Hello!';
          };

          dialog2 = document.createElement('vaadin-dialog');
          dialog2.renderer = (root2) => {
            if (!root2.firstChild) {
              const close = document.createElement('button');
              close.textContent = 'Close and show notification';
              close.addEventListener('click', () => {
                notification.opened = true;
                dialog2.opened = false;
              });
              root2.appendChild(close);
            }
          };

          const open = document.createElement('button');
          open.setAttribute('id', 'open');
          open.textContent = 'Open dialog 2';
          open.addEventListener('click', () => {
            dialog2.opened = true;
          });

          const show = document.createElement('button');
          show.setAttribute('id', 'show');
          show.textContent = 'Show notification';
          show.addEventListener('click', () => {
            notification.opened = true;
          });

          root.append(notification, dialog2, open, show);
        }
      };
    });

    afterEach(() => {
      notification.opened = false;
    });

    it('should remove pointer-events when closing dialog and opening notification', async () => {
      dialog1.opened = true;
      await nextRender();

      // Open dialog 2
      dialog1.$.overlay.querySelector('#open').click();
      await nextRender();
      expect(getComputedStyle(dialog1.$.overlay.$.overlay).pointerEvents).to.equal('none');

      // Close dialog 2 and show notification
      dialog2.$.overlay.querySelector('button').click();
      await nextRender();

      expect(getComputedStyle(dialog1.$.overlay.$.overlay).pointerEvents).to.equal('auto');
    });

    it('should allow closing the dialog on Escape press after opening notification', async () => {
      dialog1.opened = true;
      await nextRender();

      // Show notification
      dialog1.$.overlay.querySelector('#show').click();
      await nextRender();

      await sendKeys({ press: 'Escape' });

      expect(dialog1.opened).to.be.false;
    });
  });
});
