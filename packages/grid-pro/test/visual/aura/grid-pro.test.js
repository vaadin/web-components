import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../not-animated-styles.js';
import '../../../vaadin-grid-pro.js';
import '../../../vaadin-grid-pro-edit-column.js';
import { users } from '../users.js';

describe('grid-pro', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'block';
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
      await nextRender();
      div.style.width = '300px';
      element.focus();
    });

    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('column-borders', async () => {
      element.setAttribute('theme', 'column-borders');
      await visualDiff(div, 'column-borders');
    });

    it('no-row-borders', async () => {
      element.setAttribute('theme', 'no-row-borders');
      await visualDiff(div, 'no-row-borders');
    });

    ['highlight-editable-cells', 'highlight-read-only-cells'].forEach((theme) => {
      describe(theme, () => {
        beforeEach(() => {
          element.setAttribute('theme', theme);
        });

        it('default', async () => {
          await visualDiff(div, `${theme}`);
        });

        it('focus', async () => {
          // Focus the header cell
          await sendKeys({ press: 'Tab' });

          // Focus the editable cell
          await sendKeys({ press: 'Tab' });

          await visualDiff(div, `${theme}-focus`);
        });
      });
    });
  });
});
