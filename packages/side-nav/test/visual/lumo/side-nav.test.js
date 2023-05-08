import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../not-animated-styles.js';
import '../../../enable.js';
import '../../../theme/lumo/vaadin-side-nav.js';
import '@vaadin/icon';
import '@vaadin/icons';

describe('side-nav', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe(`${dir}-basic`, () => {
        beforeEach(() => {
          element = fixtureSync(
            `
              <vaadin-side-nav>
                <span slot="label">Main menu</span>
                <vaadin-side-nav-item>
                  <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
                  Item 1
                  <span theme="badge primary" slot="suffix">2</span>
                </vaadin-side-nav-item>
                <vaadin-side-nav-item>
                  <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
                  Item 2
                  <span theme="badge primary" slot="suffix">3</span>
                </vaadin-side-nav-item>
              </vaadin-side-nav>
            `,
            div,
          );
        });

        it('basic', async () => {
          await visualDiff(div, `${dir}-basic`);
        });
      });

      describe(`${dir}-collapsible`, () => {
        beforeEach(() => {
          element = fixtureSync(
            `
              <vaadin-side-nav collapsible>
                <span slot="label">Main menu</span>
                <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
                <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
              </vaadin-side-nav>
            `,
            div,
          );
        });

        it('expanded', async () => {
          await visualDiff(div, `${dir}-expanded`);
        });

        it('collapsed', async () => {
          element.collapsed = true;
          await visualDiff(div, `${dir}-collapsed`);
        });
      });

      describe(`${dir}-item-expanded`, () => {
        beforeEach(() => {
          element = fixtureSync(
            `
              <vaadin-side-nav>
                <span slot="label">Main menu</span>
                <vaadin-side-nav-item>
                  <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
                  Item 1
                  <span theme="badge primary" slot="suffix">2</span>
                  <vaadin-side-nav-item slot="children">
                    <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
                    Child item 1
                    <span theme="badge primary" slot="suffix">12</span>
                  </vaadin-side-nav-item>
                  <vaadin-side-nav-item slot="children">
                    <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
                    Child item 2
                    <span theme="badge primary" slot="suffix">13</span>
                  </vaadin-side-nav-item>
                </vaadin-side-nav-item>
                <vaadin-side-nav-item>
                  <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
                  Item 2
                  <span theme="badge primary" slot="suffix">3</span>
                </vaadin-side-nav-item>
              </vaadin-side-nav>
            `,
            div,
          );
        });

        it('item collapsed', async () => {
          await visualDiff(div, `${dir}-item-collapsed`);
        });

        it('item expanded', async () => {
          element.querySelector('vaadin-side-nav-item').expanded = true;
          await visualDiff(div, `${dir}-item-expanded`);
        });
      });
    });
  });
});
