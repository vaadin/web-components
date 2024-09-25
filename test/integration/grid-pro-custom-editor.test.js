import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, middleOfNode, nextRender } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import '@vaadin/combo-box';
import '@vaadin/date-picker';
import '@vaadin/date-time-picker';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import '@vaadin/time-picker';
import { waitForOverlayRender } from '@vaadin/date-picker/test/helpers.js';
import { flushGrid, getContainerCell } from '@vaadin/grid-pro/test/helpers.js';

describe('grid-pro custom editor', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="date" editor-type="custom" width="50px"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="status" editor-type="custom" width="50px"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="time" editor-type="custom" width="50px"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="datetime" editor-type="custom"></vaadin-grid-pro-edit-column>
      </vaadin-gri-pro>
    `);

    grid.items = [
      { date: '1984-01-13', status: 'suspended', time: '09:00' },
      { date: '1977-07-12', status: 'active', time: '09:30' },
      { date: '1976-12-14', status: 'suspended', time: '10:00' },
      { date: '1972-12-04', status: 'active', time: '10:00' },
      { date: '1978-02-03', status: 'active', time: '10:00' },
    ].map((item) => {
      return { ...item, datetime: `${item.date}T${item.time}` };
    });

    grid.querySelector('[path="date"]').editModeRenderer = (root, _, model) => {
      root.innerHTML = `
        <vaadin-date-picker value="${model.item.date}" auto-open-disabled>
        </vaadin-date-picker>
      `;
    };

    grid.querySelector('[path="status"]').editModeRenderer = (root, _, model) => {
      if (!root.firstChild) {
        const comboBox = document.createElement('vaadin-combo-box');
        comboBox.autoOpenDisabled = true;
        comboBox.items = ['active', 'suspended'];
        root.appendChild(comboBox);
      }
      root.firstChild.value = model.item.status;
    };

    grid.querySelector('[path="time"]').editModeRenderer = (root, _, model) => {
      root.innerHTML = `
        <vaadin-time-picker value="${model.item.time}" auto-open-disabled></vaadin-time-picker>
      `;
    };

    grid.querySelector('[path="datetime"]').editModeRenderer = (root, _, model) => {
      root.innerHTML = `
        <vaadin-date-time-picker value="${model.item.datetime}" auto-open-disabled>
        </vaadin-date-time-picker>
      `;
    };

    flushGrid(grid);
    await nextRender();
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('date-picker', () => {
    let cell;

    beforeEach(async () => {
      cell = getContainerCell(grid.$.items, 0, 0);
      cell.focus();

      await sendKeys({ press: 'Enter' });
    });

    it('should apply the updated date to the cell when exiting on Tab', async () => {
      await sendKeys({ type: '1/12/1984' });
      await sendKeys({ press: 'Tab' });

      expect(cell._content.textContent).to.equal('1984-01-12');
    });

    it('should apply the updated date to the cell when exiting on Enter', async () => {
      await sendKeys({ type: '1/12/1984' });
      await sendKeys({ press: 'Enter' });

      expect(cell._content.textContent).to.equal('1984-01-12');
    });

    it('should not stop editing on input click when focus is in the overlay', async () => {
      // Open the overlay
      await sendKeys({ press: 'ArrowDown' });

      const { x, y } = middleOfNode(cell._content.querySelector('input'));
      await sendMouse({ type: 'click', position: [Math.floor(x), Math.floor(y)] });

      expect(cell._content.querySelector('vaadin-date-picker')).to.be.ok;
    });

    it('should stop editing and update value when closing on outside click', async () => {
      // Open the overlay
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();

      // Move focus back to the input
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      // Change single digit to avoid calendar scroll
      const input = cell._content.querySelector('input');
      input.setSelectionRange(3, 4);

      await sendKeys({ type: '2' });

      await sendMouse({ type: 'click', position: [10, 10] });
      await nextRender();

      // TODO: closing occurs in `vaadin-overlay-outside-click` listener added on global `focusin`
      // in grid-pro. Consider replacing it with `_shouldRemoveFocus()` check on editor `focusout`
      // so that we don't stop editing on outside click, to align with the combo-box behavior.
      expect(cell._content.querySelector('vaadin-date-picker')).to.be.not.ok;
      expect(cell._content.textContent).to.equal('1984-01-12');
    });
  });

  describe('combo-box', () => {
    let cell;

    beforeEach(async () => {
      cell = getContainerCell(grid.$.items, 0, 1);
      cell.focus();

      await sendKeys({ press: 'Enter' });
    });

    it('should apply the updated value to the cell when exiting on Tab', async () => {
      await sendKeys({ type: 'active' });
      await sendKeys({ press: 'Tab' });

      expect(cell._content.textContent).to.equal('active');
    });

    it('should apply the updated value to the cell when exiting on Enter', async () => {
      await sendKeys({ type: 'active' });
      await sendKeys({ press: 'Enter' });

      expect(cell._content.textContent).to.equal('active');
    });

    it('should not stop editing and update value when closing on outside click', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ type: 'active' });

      await sendMouse({ type: 'click', position: [10, 10] });

      const editor = cell._content.querySelector('vaadin-combo-box');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('active');
    });
  });

  describe('time-picker', () => {
    let cell;

    beforeEach(async () => {
      cell = getContainerCell(grid.$.items, 0, 2);
      cell.focus();

      await sendKeys({ press: 'Enter' });
    });

    it('should apply the updated time to the cell when exiting on Tab', async () => {
      await sendKeys({ type: '10:00' });
      await sendKeys({ press: 'Tab' });

      expect(cell._content.textContent).to.equal('10:00');
    });

    it('should apply the updated value to the cell when exiting on Enter', async () => {
      await sendKeys({ type: '10:00' });
      await sendKeys({ press: 'Enter' });

      expect(cell._content.textContent).to.equal('10:00');
    });

    it('should not stop editing and update value when closing on outside click', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ type: '10:00' });

      await sendMouse({ type: 'click', position: [10, 10] });

      const editor = cell._content.querySelector('vaadin-time-picker');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('10:00');
    });
  });

  describe('date-time-picker', () => {
    let cell;

    beforeEach(async () => {
      cell = getContainerCell(grid.$.items, 0, 3);
      cell.focus();

      await sendKeys({ press: 'Enter' });
    });

    it('should stop editing and update value when closing on date-picker outside click', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();

      // Move focus back to the input
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });

      // Change single digit to avoid calendar scroll
      const input = cell._content.querySelector('input');
      input.setSelectionRange(3, 4);

      await sendKeys({ type: '2' });

      await sendMouse({ type: 'click', position: [10, 10] });
      await nextRender();

      // TODO: closing occurs in `vaadin-overlay-outside-click` listener added on global `focusin`
      // in grid-pro. Consider replacing it with `_shouldRemoveFocus()` check on editor `focusout`
      // so that we don't stop editing on outside click, to align with the combo-box behavior.
      expect(cell._content.querySelector('vaadin-date-time-picker')).to.be.not.ok;
      expect(cell._content.textContent).to.equal('1984-01-12T09:00');
    });

    it('should not stop editing and update value when closing on time-picker outside click', async () => {
      // TODO: replace with Tab and add a separate test to not stop editing on Tab
      cell._content.querySelector('vaadin-time-picker').focus();

      // Open the overlay
      await sendKeys({ press: 'ArrowDown' });

      // Select first item
      await sendKeys({ press: 'ArrowDown' });

      await sendMouse({ type: 'click', position: [10, 10] });

      const editor = cell._content.querySelector('vaadin-date-time-picker');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('1984-01-13T00:00');
    });
  });
});
