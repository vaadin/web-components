import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/dialog/src/vaadin-dialog.js';
import '@vaadin/notification/src/vaadin-notification.js';

describe('notification and dialog', () => {
  let dialog, dialogInput, notification, notificationInput;

  beforeEach(async () => {
    const container = fixtureSync(`
      <div>
        <vaadin-dialog></vaadin-dialog>
        <vaadin-notification></vaadin-notification>
      </div>
    `);
    dialog = container.querySelector('vaadin-dialog');
    dialog.renderer = (root) => {
      if (root.firstElementChild) {
        return;
      }
      dialogInput = document.createElement('input');
      root.append(dialogInput);
    };
    dialog.opened = true;

    notification = container.querySelector('vaadin-notification');
    notification.renderer = (root) => {
      if (root.firstElementChild) {
        return;
      }
      notificationInput = document.createElement('input');
      root.append(notificationInput);
    };
    notification.opened = true;

    await nextRender();
  });

  it('should prevent the dialog from closing when pressing Escape in the notification', async () => {
    notificationInput.focus();
    await sendKeys({ press: 'Escape' });

    expect(dialog.opened).to.be.true;
  });

  it('should allow the dialog to close when pressing Escape in the dialog', async () => {
    dialogInput.focus();
    await sendKeys({ press: 'Escape' });

    expect(dialog.opened).to.be.false;
  });

  it('should prevent the dialog from closing when clicking in the notification', () => {
    notificationInput.click();

    expect(dialog.opened).to.be.true;
  });

  it('should allow the dialog to close when clicking outside', () => {
    document.body.click();

    expect(dialog.opened).to.be.false;
  });
});
