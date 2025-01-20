import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../not-animated-styles.js';
import '../../../theme/lumo/vaadin-side-nav.js';
import '@vaadin/icon';
import '@vaadin/icons';

describe('side-nav', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  describe('states', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
        <vaadin-side-nav collapsible>
          <span slot="label">Messages</span>
          <vaadin-side-nav-item path="/inbox">
            <vaadin-icon icon="vaadin:inbox" slot="prefix"></vaadin-icon>
            <span>Inbox</span>
          </vaadin-side-nav-item>
          <vaadin-side-nav-item path="/sent">
            <vaadin-icon icon="vaadin:paperplane" slot="prefix"></vaadin-icon>
            <span>Sent</span>
          </vaadin-side-nav-item>
          <vaadin-side-nav-item path="/trash">
            <vaadin-icon icon="vaadin:trash" slot="prefix"></vaadin-icon>
            <span>Trash</span>
          </vaadin-side-nav-item>
        </vaadin-side-nav>
        `,
        div,
      );
      await nextRender();
    });

    it('focused label', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focused-label');
    });

    it('focused item', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focused-item');
    });

    it('current item', async () => {
      const item = document.querySelector('vaadin-side-nav-item');
      item.setAttribute('current', '');
      await visualDiff(div, 'current-item');
    });

    it('current collapsed item', async () => {
      const item = document.querySelector('vaadin-side-nav-item');
      item.setAttribute('current', '');
      const child = document.createElement('vaadin-side-nav-item');
      child.setAttribute('slot', 'children');
      item.appendChild(child);
      await visualDiff(div, 'current-collapsed-item');
    });

    it('disabled item', async () => {
      const item = document.querySelector('vaadin-side-nav-item');
      item.disabled = true;
      await nextRender();
      await visualDiff(div, 'disabled-item');
    });

    it('overflowing item', async () => {
      const span = document.querySelector('vaadin-side-nav-item span');
      span.textContent = 'Very long item that does not fit';
      element.style.maxWidth = '200px';
      await visualDiff(div, 'overflowing-item');
    });
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
