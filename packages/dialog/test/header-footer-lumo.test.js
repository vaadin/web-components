import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/dialog.css';
import '../vaadin-dialog.js';

describe('slotted header and footer display in Lumo', () => {
  let dialog;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextRender();
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextRender();
  });

  ['header-content', 'footer'].forEach((slot) => {
    it(`should keep the box of a button slotted into ${slot}`, async () => {
      const button = document.createElement('button');
      button.setAttribute('slot', slot);
      button.textContent = 'OK';
      dialog.appendChild(button);
      dialog.opened = true;
      await nextRender();
      expect(getComputedStyle(button).display).to.not.equal('contents');
      expect(getComputedStyle(button).pointerEvents).to.equal('auto');
    });
  });
});
