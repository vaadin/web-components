import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement, setViewport } from '@vaadin/test-runner-commands';
import { click, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/combo-box/src/vaadin-combo-box.js';
import '@vaadin/custom-field/src/vaadin-custom-field.js';
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import '@vaadin/date-time-picker/src/vaadin-date-time-picker.js';
import '@vaadin/grid-pro/src/vaadin-grid-pro.js';
import '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/time-picker/src/vaadin-time-picker.js';
import { untilOverlayRendered, untilOverlayScrolled } from '@vaadin/date-picker/test/helpers.js';
import { dblclick, flushGrid, getContainerCell } from '@vaadin/grid-pro/test/helpers.js';

describe('grid-pro custom editor', () => {
  let grid, cell;

  function createGrid(path, autoOpen = false) {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="${path}" editor-type="custom"></vaadin-grid-pro-edit-column>
      </vaadin-gri-pro>
    `);

    // 1. Ensure grid cells have some height.
    // 2. Allow date-picker backdrop clicks.
    fixtureSync(`
      <style>
        vaadin-grid-pro::part(cell) {
          min-height: 36px;
        }

        vaadin-date-picker-overlay[fullscreen] {
          inset: 0 !important;
          justify-content: flex-end !important;
        }

        vaadin-date-picker-overlay[fullscreen]::part(overlay) {
          width: 100%;
          height: 70vh;
          max-height: 70vh;
        }
      </style>
    `);

    const column = grid.querySelector(`[path="${path}"]`);
    switch (path) {
      case 'date':
        column.editModeRenderer = (root, _, model) => {
          root.innerHTML = `
            <vaadin-date-picker value="${model.item.date}" ${!autoOpen ? 'auto-open-disabled' : ''}></vaadin-date-picker>
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
    describe('desktop', () => {
      let width, height;

      before(async () => {
        width = window.innerWidth;
        height = window.innerHeight;
        await setViewport({ width: 800, height: 600 });
      });

      beforeEach(async () => {
        grid = createGrid('date');
        await nextRender();
        await editFirstCell();
      });

      after(async () => {
        await setViewport({ width, height });
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

        const input = cell._content.querySelector('input');
        await sendMouseToElement({ type: 'click', element: input });

        expect(cell._content.querySelector('vaadin-date-picker')).to.be.ok;
      });

      it('should not stop editing when clicking inside the overlay but not on focusable element', async () => {
        // Open the overlay
        await sendKeys({ press: 'ArrowDown' });
        await untilOverlayRendered(cell._content.querySelector('vaadin-date-picker'));

        // Click between toolbar buttons
        const overlayContent = document.querySelector('vaadin-date-picker-overlay-content');
        const toolbar = overlayContent.shadowRoot.querySelector('[part="toolbar"]');
        await sendMouseToElement({ type: 'click', element: toolbar });
        await nextRender();

        expect(cell._content.querySelector('vaadin-date-picker')).to.be.ok;
      });

      it('should not stop editing and update value when closing on outside click', async () => {
        // Open the overlay
        await sendKeys({ press: 'ArrowDown' });
        await untilOverlayRendered(cell._content.querySelector('vaadin-date-picker'));

        // Move focus back to the input
        await sendKeys({ press: 'Shift+Tab' });

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

    describe('mobile', () => {
      let width, height;

      before(async () => {
        width = window.innerWidth;
        height = window.innerHeight;
        await setViewport({ width: 420, height: 600 });
      });

      beforeEach(async () => {
        grid = createGrid('date', true);
        await nextRender();
        cell = getContainerCell(grid.$.items, 0, 0);
      });

      after(async () => {
        await setViewport({ width, height });
      });

      it('should open date picker on double click', async () => {
        dblclick(cell);
        const datePicker = cell._content.querySelector('vaadin-date-picker');
        expect(datePicker).to.be.ok;
        await untilOverlayRendered(datePicker);
        expect(datePicker.opened).to.be.ok;
      });

      it('should close date picker on selecting a date in the overlay', async () => {
        dblclick(cell);
        const datePicker = cell._content.querySelector('vaadin-date-picker');
        await untilOverlayRendered(datePicker);

        const todayButton = datePicker._overlayElement.querySelector('[slot=today-button]');
        click(todayButton); // Fist click to scroll to current month
        await untilOverlayScrolled(datePicker);
        click(todayButton); // Second click to select today's date

        await nextRender();
        const TODAY_DATE = new Date().toISOString().split('T')[0];
        expect(TODAY_DATE).to.be.equal(cell._content.textContent);
      });

      it('should restore previous cell content if overlay is closed', async () => {
        const previousContent = cell._content.textContent;

        dblclick(cell);
        const datePicker = cell._content.querySelector('vaadin-date-picker');
        await untilOverlayRendered(datePicker);

        await sendMouse({ type: 'click', position: [10, 10] });
        await nextRender();
        expect(cell._content.querySelector('vaadin-date-picker')).to.not.be.ok;
        expect(previousContent).to.be.equal(cell._content.textContent);
      });
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
      await sendKeys({ press: 'Shift+Tab' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-date-time-picker')).to.be.ok;
    });

    it('should not stop editing and update value when closing on date-picker outside click', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(cell._content.querySelector('vaadin-date-picker'));

      // Move focus back to the input
      await sendKeys({ press: 'Shift+Tab' });

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
      const input = cell._content.querySelectorAll('input')[1];
      await sendMouseToElement({ type: 'click', element: input });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.ok;
    });

    it('should not stop editing when switching between fields using Tab', async () => {
      // Move focus to the second field
      await sendKeys({ press: 'Tab' });
      await nextRender();
      expect(cell._content.querySelector('vaadin-custom-field')).to.be.ok;

      // Move focus to the first field
      await sendKeys({ press: 'Shift+Tab' });
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
