import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/tabs/test/visual/not-animated-styles.js';
import '../../../src/vaadin-tabsheet.js';

describe('tabsheet', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync(
      `
        <vaadin-tabsheet>
          <div slot="prefix">Prefix</div>
          <div slot="suffix">Suffix</div>

          <vaadin-tabs slot="tabs">
            <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
            <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
            <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
          </vaadin-tabs>

          <div tab="tab-1">
            Odio quis mi. Aliquam massa pede, pharetra quis, tincidunt quis, fringilla at, mauris. Vestibulum a massa.
            Vestibulum luctus odio ut quam. Maecenas congue convallis diam. Cras urna arcu, vestibulum vitae, blandit ut,
            laoreet id, risus. Ut condimentum, arcu sit amet placerat blandit, augue nibh pretium nunc, in tempus sem dolor
            non leo. Etiam fringilla mauris a odio. Nunc lorem diam, interdum eget, lacinia in, scelerisque sit amet, purus.
            Nam ornare. Donec placerat dui ut orci. Phasellus quis lacus at nisl elementum cursus. Cras bibendum egestas
            nulla. Phasellus pulvinar ullamcorper odio. Etiam ipsum. Proin tincidunt. Aliquam aliquet.
          </div>
          <div tab="tab-2">Panel 2</div>
          <div tab="tab-3">Panel 3</div>
        </vaadin-tabsheet>
      `,
      div,
    );
    await nextRender();
  });

  it('scroller focus-ring', async () => {
    await sendKeys({ press: 'Tab' });
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'scroller-focus-ring');
  });

  it('no-border', async () => {
    element.setAttribute('theme', 'no-border');
    await visualDiff(div, 'no-border');
  });

  it('no-padding', async () => {
    element.setAttribute('theme', 'no-padding');
    await visualDiff(div, 'no-padding');
  });

  it('overflow-top', async () => {
    element.style.setProperty('height', '100px');
    element.shadowRoot.querySelector('[part="content"]').scrollBy(0, 40);
    await nextRender();
    await visualDiff(div, 'overflow-top');
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe(`${dir}`, () => {
        it('default', async () => {
          await visualDiff(div, `${dir}-default`);
        });
      });
    });
  });
});
