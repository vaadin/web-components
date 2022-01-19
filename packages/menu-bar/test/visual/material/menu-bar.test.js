import { arrowDown, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/theme/material/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/material/vaadin-menu-bar.js';
import '../../not-animated-styles.js';

describe('menu-bar', () => {
  let div, element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('basic', () => {
        beforeEach(() => {
          div = document.createElement('div');
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [
            { text: 'Home' },
            {
              text: 'Reports',
              children: [{ text: 'View Reports' }, { text: 'Generate Report' }]
            },
            { text: 'Dashboard', disabled: true },
            { text: 'Help' }
          ];
        });

        it('basic', async () => {
          await visualDiff(document.body, `${dir}-basic`);
        });

        it('opened', async () => {
          element._buttons[1].click();
          await nextRender(element);
          await visualDiff(document.body, `${dir}-opened`);
        });
      });

      describe('column flex', () => {
        beforeEach(() => {
          div = document.createElement('div');
          div.style.display = 'flex';
          div.style.padding = '10px';
          div.style.maxWidth = '400px';
          div.style.flexDirection = 'column';
          div.style.alignItems = 'flex-start';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [
            { text: 'Item 1' },
            { text: 'Item 2' },
            { text: 'Item 3' },
            { text: 'Item 4' },
            { text: 'Item 5' },
            { text: 'Item 6' },
            { text: 'Item 7' }
          ];
        });

        it('flex-overflow', async () => {
          await visualDiff(div, `${dir}-flex-overflow`);
        });
      });

      describe('theme', () => {
        function makeIcon(img) {
          const item = document.createElement('vaadin-context-menu-item');
          const icon = document.createElement('vaadin-icon');
          icon.setAttribute('icon', img);
          item.appendChild(icon);
          item.setAttribute('theme', 'menu-bar-item');
          return item;
        }

        beforeEach(() => {
          div = document.createElement('div');
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [
            { component: 'u', text: 'Home' },
            {
              component: makeIcon('lumo:chevron-down'),
              children: [{ text: 'Notifications' }, { text: 'Mark as read' }]
            },
            { text: 'Manage', disabled: true },
            {
              text: 'Reports',
              children: [{ text: 'View Reports' }, { text: 'Generate Report' }]
            },
            { text: 'Help' }
          ];
        });

        it('outlined', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'outlined');
          element.notifyResize();
          arrowDown(element._buttons[1]);
          await oneEvent(element._subMenu.$.overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-outlined`);
        });

        it('contained', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'contained');
          element.notifyResize();
          arrowDown(element._buttons[1]);
          await oneEvent(element._subMenu.$.overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-contained`);
        });

        it('text', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'text');
          element.notifyResize();
          arrowDown(element._buttons[1]);
          await oneEvent(element._subMenu.$.overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-text`);
        });
      });
    });
  });
});
