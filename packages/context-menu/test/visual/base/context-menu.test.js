import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '../../../src/vaadin-context-menu.js';
import { openSubMenus } from '../../helpers.js';

describe('context-menu', () => {
  let element;

  ['ltr', 'rtl'].forEach((dir) => {
    const contextmenu = (target) => {
      const domRect = target.getBoundingClientRect();
      const clientX = dir === 'rtl' ? domRect.right : domRect.left;
      const e = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY: domRect.y,
      });

      target.listenOn.dispatchEvent(e);
    };

    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('basic', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-context-menu>
              <div style="padding: 10px">Target</div>
            </vaadin-context-menu>
          `);
          element.items = [{ text: 'Item 1' }, { text: 'Item 2' }];
          await nextUpdate(element);
        });

        it('basic', async () => {
          contextmenu(element);
          await nextRender();
          await visualDiff(document.body, `${dir}-basic`);
        });
      });

      describe('nested', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-context-menu>
              <div style="padding: 10px">Target</div>
            </vaadin-context-menu>
          `);
          await nextUpdate(element);
        });

        it('nested', async () => {
          element.items = [
            { text: 'Menu Item 1' },
            { component: 'hr' },
            {
              text: 'Menu Item 2',
              children: [
                { text: 'Menu Item 2-1' },
                {
                  text: 'Menu Item 2-2',
                  children: [
                    { text: 'Menu Item 2-2-1', checked: true },
                    { text: 'Menu Item 2-2-2', disabled: true },
                    { component: 'hr' },
                    { text: 'Menu Item 2-2-3' },
                  ],
                },
              ],
            },
            { text: 'Menu Item 3', disabled: true },
          ];
          contextmenu(element);
          await openSubMenus(element);
          await nextRender();
          await visualDiff(document.body, `${dir}-nested`);
        });
      });
    });
  });
});
