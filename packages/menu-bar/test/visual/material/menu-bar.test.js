import { arrowDown, fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/theme/material/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/material/vaadin-menu-bar.js';
import '../../not-animated-styles.js';

describe('menu-bar', () => {
  let div, element;

  // FIXME: overflow doesn't work correctly in RTL in older Chrome version
  // See comments under https://github.com/vaadin/web-components/pull/7347
  ['ltr' /* , 'rtl' */].forEach((dir) => {
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
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          element.items = [
            { text: 'Home' },
            {
              text: 'Reports',
              children: [{ text: 'View Reports' }, { text: 'Generate Report' }],
            },
            { text: 'Dashboard', disabled: true },
            { text: 'Help' },
          ];
          await nextResize(element);
        });

        it('basic', async () => {
          await visualDiff(document.body, `${dir}-basic`);
        });

        it('opened', async () => {
          element._buttons[1].click();
          await nextRender(element);
          await visualDiff(document.body, `${dir}-opened`);
        });

        it('reverse-collapse opened', async () => {
          div.style.width = '250px';
          element.reverseCollapse = true;
          element.setAttribute('theme', 'outlined');
          await nextResize(element);
          element._buttons[4].click();
          const overlay = element._subMenu._overlayElement;
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-reverse-collapse-opened`);
        });
      });

      describe('single button', () => {
        beforeEach(async () => {
          div = document.createElement('div');
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);

          element.items = [{ text: 'Actions' }];
          element.setAttribute('theme', 'outlined');
          await nextResize(element);
        });

        it('single button', async () => {
          await visualDiff(document.body, `${dir}-single-button`);
        });

        it('single overflow button', async () => {
          element.items = [{ text: 'View' }, { text: 'Edit' }];
          element.style.maxWidth = '100px';
          await nextResize(element);
          await visualDiff(document.body, `${dir}-single-button-overflow`);
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

          await nextResize(element);
          overlay = element._subMenu._overlayElement;
        });

        it('outlined', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'outlined');
          await nextResize(element);
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-outlined`);
        });

        it('contained', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'contained');
          await nextResize(element);
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-contained`);
        });

        it('text', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'text');
          await nextResize(element);
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-text`);
        });

        it('end-aligned', async () => {
          element.setAttribute('theme', 'end-aligned');
          await nextResize(element);
          await visualDiff(document.body, `${dir}-end-aligned`);
        });

        it('end-aligned overflow button', async () => {
          element.style.width = '100px';
          element.setAttribute('theme', 'end-aligned');
          await nextResize(element);
          await visualDiff(document.body, `${dir}-end-aligned-overflow-button`);
        });

        it('end-aligned outlined', async () => {
          element.setAttribute('theme', 'outlined end-aligned');
          await nextResize(element);
          await visualDiff(document.body, `${dir}-end-aligned-outlined`);
        });

        it('end-aligned contained', async () => {
          element.setAttribute('theme', 'contained end-aligned');
          await nextResize(element);
          await visualDiff(document.body, `${dir}-end-aligned-contained`);
        });
      });
    });
  });
});
