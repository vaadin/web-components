import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { getContainerCell } from '../../helpers.js';
import { users } from '../users.js';
import '../../../theme/material/vaadin-grid-pro.js';
import '../../../theme/material/vaadin-grid-pro-edit-column.js';
import '../../not-animated-styles.js';

describe('grid-pro', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.width = '200px';
  });

  describe('edit-column-text', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-grid-pro style="height: 100px;">
            <vaadin-grid-pro-edit-column path="name.first"></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>
        `,
        div
      );
      element.items = users;
      await nextRender(element);
    });

    it('select', async () => {
      const cell = getContainerCell(element.$.items, 0, 0);
      cell._content.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
      await visualDiff(div, 'grid-pro:edit-column-text');
    });
  });

  describe('edit-column-checkbox', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-grid-pro style="height: 100px;">
            <vaadin-grid-pro-edit-column path="married" editor-type="checkbox"></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>
        `,
        div
      );
      element.items = users;
      await nextRender(element);
    });

    it('checkbox', async () => {
      const cell = getContainerCell(element.$.items, 0, 0);
      cell._content.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
      await visualDiff(div, 'grid-pro:edit-column-checkbox');
    });
  });

  describe('edit-column-select', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-grid-pro style="height: 225px;">
            <vaadin-grid-pro-edit-column path="name.title" editor-type="select"></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>
        `,
        div
      );
      element.items = users;
      const column = element.querySelector('vaadin-grid-pro-edit-column');
      column.editorOptions = ['mr', 'mrs', 'ms'];
      await nextRender(element);
    });

    it('select', async () => {
      const cell = getContainerCell(element.$.items, 0, 0);
      cell._content.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
      await visualDiff(div, 'grid-pro:edit-column-select');
    });
  });
});
