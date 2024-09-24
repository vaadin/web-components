import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import '@vaadin/combo-box';
import '@vaadin/date-picker';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import '@vaadin/time-picker';
import { flushGrid, getContainerCell } from '@vaadin/grid-pro/test/helpers.js';

describe('grid-pro custom editor', () => {
  let grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid-pro>
        <vaadin-grid-pro-edit-column path="firstName"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="lastName"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="birthday" editor-type="custom"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="status" editor-type="custom"></vaadin-grid-pro-edit-column>
        <vaadin-grid-pro-edit-column path="time" editor-type="custom"></vaadin-grid-pro-edit-column>
      </vaadin-gri-pro>
    `);

    grid.items = [
      { firstName: 'Aria', lastName: 'Bailey', birthday: '1984-01-13', status: 'suspended', time: '09:00' },
      { firstName: 'Aaliyah', lastName: 'Butler', birthday: '1977-07-12', status: 'active', time: '09:30' },
      { firstName: 'Eleanor', lastName: 'Price', birthday: '1976-12-14', status: 'suspended', time: '10:00' },
      { firstName: 'Allison', lastName: 'Torres', birthday: '1972-12-04', status: 'active', time: '10:00' },
      { firstName: 'Madeline', lastName: 'Lewis', birthday: '1978-02-03', status: 'active', time: '10:00' },
    ];

    grid.querySelector('[path="birthday"]').editModeRenderer = (root, _, model) => {
      root.innerHTML = `
        <vaadin-date-picker value="${model.item.birthday}" auto-open-disabled>
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

    flushGrid(grid);
    await nextRender();
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('date-picker', () => {
    it('should apply the updated date to the cell when exiting on Tab', async () => {
      const cell = getContainerCell(grid.$.items, 0, 2);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ type: '1/12/1984' });
      await sendKeys({ press: 'Tab' });

      expect(cell._content.textContent).to.equal('1984-01-12');
    });

    it('should apply the updated date to the cell when exiting on Enter', async () => {
      const cell = getContainerCell(grid.$.items, 0, 2);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ type: '1/12/1984' });
      await sendKeys({ press: 'Enter' });

      expect(cell._content.textContent).to.equal('1984-01-12');
    });
  });

  describe('combo-box', () => {
    it('should apply the updated value to the cell when exiting on Tab', async () => {
      const cell = getContainerCell(grid.$.items, 0, 3);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ type: 'active' });
      await sendKeys({ press: 'Tab' });

      expect(cell._content.textContent).to.equal('active');
    });

    it('should apply the updated value to the cell when exiting on Enter', async () => {
      const cell = getContainerCell(grid.$.items, 0, 3);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ type: 'active' });
      await sendKeys({ press: 'Enter' });

      expect(cell._content.textContent).to.equal('active');
    });

    it('should not stop editing and update value when closing on outside click', async () => {
      const cell = getContainerCell(grid.$.items, 0, 3);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ type: 'active' });

      await sendMouse({ type: 'click', position: [10, 10] });

      const editor = cell._content.querySelector('vaadin-combo-box');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('active');
    });
  });

  describe('time-picker', () => {
    it('should apply the updated time to the cell when exiting on Tab', async () => {
      const cell = getContainerCell(grid.$.items, 0, 4);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ type: '10:00' });
      await sendKeys({ press: 'Tab' });

      expect(cell._content.textContent).to.equal('10:00');
    });

    it('should apply the updated value to the cell when exiting on Enter', async () => {
      const cell = getContainerCell(grid.$.items, 0, 4);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ type: '10:00' });
      await sendKeys({ press: 'Enter' });

      expect(cell._content.textContent).to.equal('10:00');
    });

    it('should not stop editing and update value when closing on outside click', async () => {
      const cell = getContainerCell(grid.$.items, 0, 4);
      cell.focus();

      await sendKeys({ press: 'Enter' });

      await sendKeys({ press: 'ArrowDown' });
      await sendKeys({ type: '10:00' });

      await sendMouse({ type: 'click', position: [10, 10] });

      const editor = cell._content.querySelector('vaadin-time-picker');
      expect(editor).to.be.ok;
      expect(editor.value).to.equal('10:00');
    });
  });
});
