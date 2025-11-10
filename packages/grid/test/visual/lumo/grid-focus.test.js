import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/grid.css';
import '../../../vaadin-grid.js';
import '../../../vaadin-grid-column-group.js';
import { flushGrid } from '../helpers.js';
import { users } from './users.js';

describe('grid focus', () => {
  let element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });
    });

    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid style="width: 550px">
          <vaadin-grid-column-group header="Name" frozen>
            <vaadin-grid-column path="name.first" width="200px" flex-shrink="0"></vaadin-grid-column>
            <vaadin-grid-column path="name.last" width="200px" flex-shrink="0"></vaadin-grid-column>
          </vaadin-grid-column-group>
          <vaadin-grid-column path="location.city" width="200px" flex-shrink="0"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.items = users;
      flushGrid(element);

      // Scroll all the way to end
      element.$.table.scrollLeft = element.__isRTL ? -1000 : 1000;

      // Focus a header row
      await sendKeys({ press: 'Tab' });
      // Switch to row focus mode
      await sendKeys({ press: element.__isRTL ? 'ArrowRight' : 'ArrowLeft' });
      // Tab to body row
      await sendKeys({ press: 'Tab' });

      await nextRender();
    });

    it('row focus', async () => {
      await visualDiff(element, `${dir}-row-focus`);
    });

    it('row focus - header', async () => {
      // Focus a header row
      element.tabIndex = 0;
      element.focus();
      await sendKeys({ press: 'Tab' });

      await visualDiff(element, `${dir}-row-focus-header`);
    });
  });
});
