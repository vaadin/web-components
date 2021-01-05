import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import { createItems, enter, flushGrid, getCellEditor, getContainerCell } from './helpers.js';
import '../vaadin-grid-pro.js';
import '../vaadin-grid-pro-edit-column.js';

function clickOverlay(element) {
  const focusout = new CustomEvent('focusout', { bubbles: true, composed: true });
  element.dispatchEvent(focusout);

  const focusin = new CustomEvent('focusin', { bubbles: true, composed: true });
  element.$.overlay.dispatchEvent(focusin);
}

const fixtures = {
  default: `
    <vaadin-dialog opened>
      <template>
        <vaadin-grid-pro id="grid">
          <vaadin-grid-column path="name" header="First Name"></vaadin-grid-column>
          <vaadin-grid-pro-edit-column path="date" header="Date"></vaadin-grid-pro-edit-column>
        </vaadin-grid-pro>
        <vaadin-text-field></vaadin-text-field>
      </template>
    </vaadin-dialog>
  `,
  template: `
    <vaadin-dialog opened>
      <template>
        <vaadin-grid-pro id="grid">
          <vaadin-grid-column path="name" header="First Name"></vaadin-grid-column>
          <vaadin-grid-pro-edit-column path="date" header="Date">
            <template class="editor">
              <div>
                <vaadin-date-picker></vaadin-date-picker>
              </div>
            </template>
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-pro>
        <vaadin-text-field></vaadin-text-field>
      </template>
    </vaadin-dialog>
  `
};

['default', 'template'].forEach((type) => {
  describe(type, () => {
    let dialog, grid, dateCell;

    beforeEach(() => {
      dialog = fixtureSync(fixtures[type]);
      grid = dialog.$.overlay.querySelector('vaadin-grid-pro');
      grid.items = createItems();
      grid.style.width = '100px'; // column default min width is 100px
      flushGrid(grid);

      dateCell = getContainerCell(grid.$.items, 0, 1);

      if (type === 'default') {
        grid.querySelector('[path="date"]').editModeRenderer = function (root) {
          root.innerHTML = '';
          const inputWrapper = document.createElement('div');
          const datePicker = document.createElement('vaadin-date-picker');
          inputWrapper.appendChild(datePicker);
          root.appendChild(inputWrapper);
        };
      }
    });

    it('should not stop editing when focusing input related overlay', () => {
      enter(dateCell);
      const datePicker = getCellEditor(dateCell).querySelector('vaadin-date-picker');
      datePicker.click();

      clickOverlay(datePicker);
      grid._debouncerStopEdit && grid._debouncerStopEdit.flush();

      expect(getCellEditor(dateCell)).to.be.ok;
    });

    it('should stop editing on outside click from input related overlay', () => {
      enter(dateCell);
      const datePicker = getCellEditor(dateCell).querySelector('vaadin-date-picker');
      datePicker.click();

      clickOverlay(datePicker);
      document.body.click();
      grid._debouncerStopEdit && grid._debouncerStopEdit.flush();

      expect(getCellEditor(dateCell)).not.to.be.ok;
    });

    it('should stop editing when focusing overlay containing grid', () => {
      enter(dateCell);
      const datePicker = getCellEditor(dateCell).querySelector('vaadin-date-picker');

      // Mimic clicking the dialog overlay
      const evt = new CustomEvent('focusout', { bubbles: true, composed: true });
      datePicker.dispatchEvent(evt);

      const focusin = new CustomEvent('focusin', { bubbles: true, composed: true });
      dialog.$.overlay.dispatchEvent(focusin);
      grid._debouncerStopEdit && grid._debouncerStopEdit.flush();

      expect(getCellEditor(dateCell)).to.be.not.ok;
    });
  });
});
