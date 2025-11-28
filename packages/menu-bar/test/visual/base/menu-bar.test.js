import { arrowDown, fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '@vaadin/icon';
import '../../not-animated-styles.js';
import '../../../src/vaadin-menu-bar.js';

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
        beforeEach(async () => {
          div = document.createElement('div');
          div.style.display = 'inline-block';
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [
            { text: 'Home' },
            {
              text: 'Reports',
              children: [
                { text: 'View Reports' },
                {
                  text: 'Generate Report',
                  children: [{ text: 'Monthly' }, { text: 'Yearly' }],
                },
              ],
            },
            { text: 'Dashboard', disabled: true },
            { text: 'Help' },
          ];

          await nextResize(element);
        });

        it('basic', async () => {
          await visualDiff(div, `${dir}-basic`);
        });

        it('opened', async () => {
          div.style.height = '150px';
          element._buttons[1].click();
          await nextRender();
          await visualDiff(div, `${dir}-opened`);
        });

        it('reverse-collapse opened', async () => {
          element.style.width = '250px';
          div.style.width = '350px';
          div.style.height = '150px';
          element.reverseCollapse = true;
          await nextResize(element);
          element._buttons[4].click();
          const overlay = element._subMenu._overlayElement;
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(div, `${dir}-reverse-collapse-opened`);
        });
      });

      describe('single button', () => {
        beforeEach(async () => {
          div = document.createElement('div');
          div.style.display = 'inline-block';
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [{ text: 'Actions' }];
          await nextResize(element);
        });

        it('single button', async () => {
          await visualDiff(div, `${dir}-single-button`);
        });

        it('single overflow button', async () => {
          element.items = [{ text: 'View' }, { text: 'Edit' }];
          element.style.maxWidth = '80px';
          await nextResize(element);
          await visualDiff(div, `${dir}-single-button-overflow`);
        });
      });

      describe('theme', () => {
        let overlay;

        function makeIcon(img) {
          const item = document.createElement('vaadin-menu-bar-item');
          const icon = document.createElement('vaadin-icon');
          icon.setAttribute('icon', img);
          item.appendChild(icon);
          return item;
        }

        beforeEach(async () => {
          div = document.createElement('div');
          div.style.display = 'inline-block';
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [
            { component: 'u', text: 'Home' },
            {
              component: makeIcon('lumo:chevron-down'),
              children: [{ text: 'Notifications' }, { text: 'Mark as read' }],
            },
            { text: 'Manage', disabled: true },
            {
              text: 'Reports',
              children: [{ text: 'View Reports' }, { text: 'Generate Report' }],
            },
            { text: 'Help' },
          ];
          overlay = element._subMenu._overlayElement;
          await nextResize(element);
        });

        it('primary', async () => {
          div.style.width = '320px';
          div.style.height = '150px';
          element.setAttribute('theme', 'primary');
          await nextResize(element);
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(div, `${dir}-primary`);
        });

        it('tertiary', async () => {
          div.style.width = '265px';
          div.style.height = '150px';
          element.setAttribute('theme', 'tertiary');
          await nextResize(element);
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(div, `${dir}-tertiary`);
        });

        it('end-aligned', async () => {
          div.style.width = '600px';
          element.setAttribute('theme', 'end-aligned');
          await nextResize(element);
          await visualDiff(div, `${dir}-end-aligned`);
        });

        it('end-aligned overflow button', async () => {
          element.style.width = '50px';
          element.setAttribute('theme', 'end-aligned');
          await nextResize(element);
          await visualDiff(div, `${dir}-end-aligned-overflow-button`);
        });
      });
    });
  });
});
