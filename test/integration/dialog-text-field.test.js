import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '@vaadin/dialog';
import '@vaadin/text-field';

const fieldsMarkup = `
  <vaadin-text-field label="First"></vaadin-text-field>
  <vaadin-text-field label="Second" autofocus></vaadin-text-field>
`;

describe('text-field with autofocus in dialog', () => {
  let dialog;

  function getField(index) {
    return dialog.querySelectorAll('vaadin-text-field')[index];
  }

  async function close() {
    dialog.opened = false;
    await nextRender();
  }

  afterEach(async () => {
    await close();
  });

  describe('slotted children', () => {
    let button;

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <button>Open</button>
          <vaadin-dialog>${fieldsMarkup}</vaadin-dialog>
        </div>
      `);
      [button, dialog] = wrapper.children;
      button.addEventListener('click', () => {
        dialog.opened = true;
      });
      // Let the fields run their own autofocus while the dialog is closed
      await nextRender();
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should focus the field with autofocus without focus-ring when opened with mouse', async () => {
      const opened = oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
      await sendMouseToElement({ type: 'click', element: button });
      await opened;
      expect(document.activeElement).to.equal(getField(1).inputElement);
      expect(getField(1).hasAttribute('focus-ring')).to.be.false;
    });

    it('should focus the field with autofocus with focus-ring when opened with keyboard', async () => {
      button.focus();
      const opened = oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Enter' });
      await opened;
      expect(document.activeElement).to.equal(getField(1).inputElement);
      expect(getField(1).hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('renderer', () => {
    beforeEach(async () => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      dialog.renderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = fieldsMarkup;
        }
      };
      await nextRender();
    });

    async function open() {
      const opened = oneEvent(dialog.$.overlay, 'vaadin-overlay-open');
      dialog.opened = true;
      await opened;
    }

    it('should focus the field with autofocus again when re-opened', async () => {
      await open();
      await close();
      await open();
      expect(document.activeElement).to.equal(getField(1).inputElement);
    });
  });
});
