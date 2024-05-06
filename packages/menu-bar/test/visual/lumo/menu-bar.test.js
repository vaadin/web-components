import { arrowDown, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon/theme/lumo/vaadin-icon.js';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset.js';
import '../../../theme/lumo/vaadin-menu-bar.js';
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
        beforeEach(async () => {
          div = document.createElement('div');
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          await nextRender();

          element.items = [
            { text: 'Home' },
            {
              text: 'Reports',
              children: [{ text: 'View Reports' }, { text: 'Generate Report' }],
            },
            { text: 'Dashboard', disabled: true },
            { text: 'Help' },
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

        it('reverse-collapse opened', async () => {
          div.style.width = '250px';
          element.reverseCollapse = true;
          await nextRender(element);
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
          await nextRender();

          element.items = [{ text: 'Actions' }];
        });

        it('single button', async () => {
          await visualDiff(document.body, `${dir}-single-button`);
        });

        it('single overflow button', async () => {
          element.items = [{ text: 'View' }, { text: 'Edit' }];
          element.style.maxWidth = '100px';
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
          await nextRender();

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
        });

        it('primary', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'primary');
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-primary`);
        });

        it('secondary', async () => {
          div.style.width = '320px';
          element.setAttribute('theme', 'secondary');
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-secondary`);
        });

        it('tertiary', async () => {
          div.style.width = '265px';
          element.setAttribute('theme', 'tertiary');
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-tertiary`);
        });

        it('tertiary-inline', async () => {
          div.style.width = '200px';
          element.setAttribute('theme', 'tertiary-inline');
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-tertiary-inline`);
        });

        it('small', async () => {
          div.style.width = '265px';
          element.setAttribute('theme', 'small');
          arrowDown(element._buttons[1]);
          await oneEvent(overlay, 'vaadin-overlay-open');
          await visualDiff(document.body, `${dir}-small`);
        });

        it('end-aligned', async () => {
          element.setAttribute('theme', 'end-aligned');
          await visualDiff(document.body, `${dir}-end-aligned`);
        });

        it('end-aligned overflow button', async () => {
          element.style.width = '100px';
          element.setAttribute('theme', 'end-aligned');
          await visualDiff(document.body, `${dir}-end-aligned-overflow-button`);
        });
      });

      describe('dropdown-indicators', () => {
        function makeIcon(img) {
          const icon = document.createElement('vaadin-icon');
          icon.setAttribute('icon', img);
          return icon;
        }

        beforeEach(async () => {
          div = document.createElement('div');
          div.style.padding = '10px';

          element = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>', div);
          await nextRender();

          element.items = [
            { text: 'Home' },
            {
              text: 'Actions',
              children: [{ text: 'Notifications' }, { text: 'Mark as read' }],
            },
            { text: 'Manage' },
            {
              text: 'Reports',
              children: [{ text: 'View Reports' }, { text: 'Generate Report' }],
            },
            { text: 'Help' },
          ];
        });

        it('dropdown-indicators', async () => {
          div.style.width = '300px';
          element.setAttribute('theme', 'dropdown-indicators');
          await visualDiff(div, `${dir}-dropdown-indicators`);
        });

        it('dropdown-indicators small', async () => {
          div.style.width = '250px';
          element.setAttribute('theme', 'dropdown-indicators small');
          await visualDiff(div, `${dir}-dropdown-indicators-small`);
        });

        it('dropdown-indicators tertiary', async () => {
          div.style.width = '200px';
          element.setAttribute('theme', 'dropdown-indicators tertiary');
          await visualDiff(div, `${dir}-dropdown-indicators-tertiary`);
        });

        it('dropdown-indicators tertiary-inline', async () => {
          div.style.width = '200px';
          element.setAttribute('theme', 'dropdown-indicators tertiary-inline');
          await visualDiff(div, `${dir}-dropdown-indicators-tertiary-inline`);
        });

        it('dropdown-indicators icon', async () => {
          element.setAttribute('theme', 'dropdown-indicators');
          const items = [...element.items];
          items[1].text = null;
          items[1].component = makeIcon('lumo:chevron-down');
          items[1].theme = 'dropdown-indicators icon';
          element.items = items;
          await nextRender();
          await visualDiff(div, `${dir}-dropdown-indicators-icon`);
        });
      });
    });
  });
});
