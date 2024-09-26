import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, middleOfNode, nextRender } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import '@vaadin/combo-box';
import '@vaadin/custom-field';
import '@vaadin/date-picker';
import '@vaadin/date-time-picker';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import '@vaadin/text-field';
import '@vaadin/time-picker';
import { waitForOverlayRender } from '@vaadin/date-picker/test/helpers.js';
import { flushGrid, getContainerCell } from '@vaadin/grid-pro/test/helpers.js';

describe('grid-pro custom editor', () => {
  let grid, cell;

  function createGrid(path) {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="${path}" editor-type="custom"></vaadin-grid-pro-edit-column>
      </vaadin-gri-pro>
    `);

    const column = grid.querySelector(`[path="${path}"]`);
    switch (path) {
      case 'date':
        column.editModeRenderer = (root, _, model) => {
          root.innerHTML = `
            <vaadin-date-picker value="${model.item.date}" auto-open-disabled></vaadin-date-picker>
          `;
        };
        break;
      case 'time':
        column.editModeRenderer = (root, _, model) => {
          root.innerHTML = `
            <vaadin-time-picker value="${model.item.time}" auto-open-disabled></vaadin-time-picker>
          `;
        };
        break;
      case 'status':
        column.editModeRenderer = (root, _, model) => {
          root.innerHTML = `
            <vaadin-combo-box
              value="${model.item.status}"
              items='["active", "suspended"]'
              auto-open-disabled
            ></vaadin-combo-box>
          `;
        };
        break;
      case 'datetime':
        column.editModeRenderer = (root, _, model) => {
          root.innerHTML = `
            <vaadin-date-time-picker value="${model.item.datetime}" auto-open-disabled>
            </vaadin-date-time-picker>
          `;
        };
        break;
      case 'expires':
        column.editModeRenderer = (root, _, model) => {
          if (!root.firstChild) {
            // NOTE: using `innerHTML` doesn't work due to the timing issue in custom-field
            // See https://github.com/vaadin/web-components/issues/7871
            const field = document.createElement('vaadin-custom-field');
            field.appendChild(document.createElement('vaadin-text-field'));
            field.appendChild(document.createElement('vaadin-text-field'));
            root.appendChild(field);
          }
          root.firstChild.value = model.item.expires;
        };
        break;
      default:
      // Do nothing
    }

    grid.items = [
      { date: '1984-01-13', status: 'suspended', time: '09:00', expires: '01\t25' },
      { date: '1977-07-12', status: 'active', time: '09:30', expires: '02\t26' },
      { date: '1976-12-14', status: 'suspended', time: '10:00', expires: '03\t27' },
      { date: '1972-12-04', status: 'active', time: '10:00', expires: '04\t28' },
      { date: '1978-02-03', status: 'active', time: '10:00', expires: '05\t29' },
    ].map((item) => {
      return { ...item, datetime: `${item.date}T${item.time}` };
    });

    flushGrid(grid);
    return grid;
  }

  async function editFirstCell() {
    cell = getContainerCell(grid.$.items, 0, 0);
    cell.focus();
    await sendKeys({ press: 'Enter' });
  }

  afterEach(async () => {
    await resetMouse();
  });

  describe('date-picker', () => {
    beforeEach(async () => {
      grid = createGrid('date');
      await nextRender();
      await editFirstCell();
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

    it('should not stop editing when clicking inside the overlay but not on focusable element', async () => {
      // Open the overlay
      await sendKeys({ press: 'ArrowDown' });
      await waitForOverlayRender();

      // Click between toolbar buttons
      const overlayContent = document.querySelector('vaadin-date-picker-overlay-content');
      const { x, y } = middleOfNode(overlayContent.shadowRoot.querySelector('[part="toolbar"]'));
      await sendMouse({ type: 'click', position: [Math.floor(x), Math.floor(y)] });
      await nextRender();

      expect(cell._content.querySelector('vaadin-date-picker')).to.be.ok;
    });

    it('should not stop editing and update value when closing on outside click', async () => {
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

      const editor = cell._content.querySelector('vaadin-date-picker');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('1984-01-12');
    });
  });

  describe('combo-box', () => {
    beforeEach(async () => {
      grid = createGrid('status');
      await nextRender();
      await editFirstCell();
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
    beforeEach(async () => {
      grid = createGrid('time');
      await nextRender();
      await editFirstCell();
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
    beforeEach(async () => {
      grid = createGrid('datetime');
      await nextRender();
      await editFirstCell();
    });

    it('should not stop editing when switching between pickers using Tab', async () => {
      // Move focus to the time-picker
      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-date-time-picker')).to.be.ok;

      // Move focus to the date-picker
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-date-time-picker')).to.be.ok;
    });

    it('should not stop editing and update value when closing on date-picker outside click', async () => {
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

      const editor = cell._content.querySelector('vaadin-date-time-picker');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('1984-01-12T09:00');
    });

    it('should not stop editing and update value when closing on time-picker outside click', async () => {
      await sendKeys({ press: 'Tab' });

      // Open the overlay
      await sendKeys({ press: 'ArrowDown' });

      // Select first item
      await sendKeys({ press: 'ArrowDown' });

      await sendMouse({ type: 'click', position: [10, 10] });
      await nextRender();

      const editor = cell._content.querySelector('vaadin-date-time-picker');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('1984-01-13T00:00');
    });
  });

  describe('custom-field', () => {
    beforeEach(async () => {
      grid = createGrid('expires');
      await nextRender();
      await editFirstCell();
    });

    it('should not stop editing when switching between fields using mouse', async () => {
      // Move focus to the second field
      const { x, y } = middleOfNode(cell._content.querySelectorAll('input')[1]);
      await sendMouse({ type: 'click', position: [Math.floor(x), Math.floor(y)] });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.ok;
    });

    it('should not stop editing when switching between fields using Tab', async () => {
      // Move focus to the second field
      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.ok;

      // Move focus to the first field
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.ok;
    });

    it('should stop editing when moving focus outside the field using Tab', async () => {
      // Move focus to the second field
      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.ok;

      // Move focus outside of the field
      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.not.ok;
    });
  });
});
