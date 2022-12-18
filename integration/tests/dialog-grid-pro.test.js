import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, focusin, focusout, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/date-picker';
import '@vaadin/dialog';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import {
  createItems,
  flushGrid,
  getCellEditor,
  getContainerCell,
  outsideClick,
} from '@vaadin/grid-pro/test/helpers.js';

async function clickOverlay(element) {
  focusout(element);

  // Add a microTask in between
  await Promise.resolve();

  focusin(element.$.overlay);
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
  `,
};

['default', 'template'].forEach((type) => {
  describe(`${type} grid-pro in dialog`, () => {
    let dialog, grid, dateCell;

    beforeEach(() => {
      dialog = fixtureSync(fixtures[type]);
      grid = dialog.$.overlay.querySelector('vaadin-grid-pro');
      grid.items = createItems();
      grid.style.width = '100px'; // Column default min width is 100px
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

    it('should not stop editing when focusing input related overlay', async () => {
      enter(dateCell);
      const datePicker = getCellEditor(dateCell).querySelector('vaadin-date-picker');
      datePicker.click();

      await clickOverlay(datePicker);
      grid._debouncerStopEdit?.flush();

      await nextFrame();
      expect(getCellEditor(dateCell)).to.be.ok;
    });

    it('should stop editing on outside click from input related overlay', async () => {
      enter(dateCell);
      const datePicker = getCellEditor(dateCell).querySelector('vaadin-date-picker');
      datePicker.click();

      clickOverlay(datePicker);
      await nextFrame();

      outsideClick();

      grid._debouncerStopEdit?.flush();

      expect(getCellEditor(dateCell)).not.to.be.ok;
    });

    it('should stop editing when focusing overlay containing grid', () => {
      enter(dateCell);
      const datePicker = getCellEditor(dateCell).querySelector('vaadin-date-picker');

      // Mimic clicking the dialog overlay
      focusout(datePicker);
      focusin(dialog.$.overlay);
      grid._debouncerStopEdit?.flush();

      expect(getCellEditor(dateCell)).to.be.not.ok;
    });
  });
});
