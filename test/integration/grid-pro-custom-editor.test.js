import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/combo-box';
import '@vaadin/date-picker';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
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
      </vaadin-gri-pro>
    `);

    grid.items = [
      { firstName: 'Aria', lastName: 'Bailey', birthday: '1984-01-13', status: 'suspended' },
      { firstName: 'Aaliyah', lastName: 'Butler', birthday: '1977-07-12', status: 'active' },
      { firstName: 'Eleanor', lastName: 'Price', birthday: '1976-12-14', status: 'suspended' },
      { firstName: 'Allison', lastName: 'Torres', birthday: '1972-12-04', status: 'active' },
      { firstName: 'Madeline', lastName: 'Lewis', birthday: '1978-02-03', status: 'active' },
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

    flushGrid(grid);
    await nextRender();
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
  });
});
