import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/dialog';
import '@vaadin/virtual-list';

describe('virtual-list in dialog', () => {
  let dialog, overlay, list;

  beforeEach(async () => {
    dialog = fixtureSync(`<vaadin-dialog theme="no-padding"></vaadin-dialog>`);
    dialog.renderer = (root) => {
      if (!root.firstChild) {
        root.$.overlay.style.width = '700px';
        root.innerHTML = `
          <vaadin-virtual-list selection-mode="multi"></vaadin-virtual-list>
        `;
        const list = root.querySelector('vaadin-virtual-list');
        list.items = [{ text: 'Hello 1' }, { text: 'Hello 2' }];
        list.renderer = (root, _list, { item }) => {
          if (!root.firstElementChild) {
            root.innerHTML = `<button>${item.text}</button>`;
          }
        };
      }
    };
    await nextRender();
    dialog.opened = true;
    overlay = dialog.$.overlay;
    await oneEvent(overlay, 'vaadin-overlay-open');
    list = overlay.querySelector('vaadin-virtual-list');
  });

  it('should close the dialog on esc', async () => {
    list.firstElementChild.focus();
    click(list.firstElementChild);
    await sendKeys({ press: 'Escape' });
    expect(dialog.opened).to.be.false;
  });

  it('should not close the dialog on esc when returning to navigation mode', async () => {
    const button = list.firstElementChild.querySelector('button');
    // Enter interaction mode by clicking a button directly
    button.focus();
    click(button);
    // Return to navigation mode
    await sendKeys({ press: 'Escape' });
    expect(dialog.opened).to.be.true;
    // Close the dialog
    await sendKeys({ press: 'Escape' });
    expect(dialog.opened).to.be.false;
  });
});
