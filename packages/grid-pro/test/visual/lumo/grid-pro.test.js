import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-grid-pro.js';
import '../../../theme/lumo/vaadin-grid-pro-edit-column.js';
import '../../not-animated-styles.js';
import { getContainerCell } from '../../helpers.js';
import { users } from '../users.js';

describe('grid-pro', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.width = '200px';
  });

  describe('editable-cell', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-grid-pro style="height: 100px;">
            <vaadin-grid-pro-edit-column path="name.first"></vaadin-grid-pro-edit-column>
            <vaadin-grid-column path="name.last"></vaadin-grid-column>
          </vaadin-grid-pro>
        `,
        div,
      );
      element.items = users;
      await nextRender(element);
      div.style.width = '300px';
      element.focus();
    });

    describe('default', () => {
      beforeEach(async () => {
        // Focus the header cell
        await sendKeys({ press: 'Tab' });
      });

      it('editable-cell focus', async () => {
        // Focus the editable cell
        await sendKeys({ press: 'Tab' });

        await visualDiff(div, 'editable-cell-focus');
      });

      it('read-only-cell focus', async () => {
        // Focus the editable cell
        await sendKeys({ press: 'Tab' });

        // Focus the read-only cell
        await sendKeys({ press: 'ArrowRight' });

        await visualDiff(div, 'read-only-cell-focus');
      });
    });

    ['highlight-editable-cells', 'highlight-read-only-cells'].forEach((theme) => {
      describe(theme, () => {
        beforeEach(() => {
          element.setAttribute('theme', theme);
        });

        it('default', async () => {
          await visualDiff(div, `theme-${theme}`);
        });

        it('focus', async () => {
          // Focus the header cell
          await sendKeys({ press: 'Tab' });

          // Focus the editable cell
          await sendKeys({ press: 'Tab' });

          await visualDiff(div, `theme-${theme}-focus`);
        });
      });
    });
  });

  describe('edit-column-text', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-grid-pro style="height: 100px;">
            <vaadin-grid-pro-edit-column path="name.first"></vaadin-grid-pro-edit-column>
          </vaadin-grid-pro>
        `,
        div,
      );
      element.items = users;
      await nextRender(element);
    });

    it('text', async () => {
      const cell = getContainerCell(element.$.items, 0, 0);
      cell._content.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
      await visualDiff(div, 'edit-column-text');
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
        div,
      );
      element.items = users;
      await nextRender(element);
    });

    it('checkbox', async () => {
      const cell = getContainerCell(element.$.items, 0, 0);
      cell._content.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
      await visualDiff(div, 'edit-column-checkbox');
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
        div,
      );
      element.items = users;
      const column = element.querySelector('vaadin-grid-pro-edit-column');
      column.editorOptions = ['mr', 'mrs', 'ms'];
      await nextRender(element);
    });

    it('select', async () => {
      const cell = getContainerCell(element.$.items, 0, 0);
      cell._content.dispatchEvent(new CustomEvent('dblclick', { bubbles: true }));
      await visualDiff(div, 'edit-column-select');
    });
  });
});
