import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-tabsheet.js';

describe('tabsheet', () => {
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

      describe(`${dir}-horizontal`, () => {
        beforeEach(() => {
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
      
              <div tab="tab-1">Panel 1</div>
              <div tab="tab-2">Panel 2</div>
              <div tab="tab-3">Panel 3</div>
            </vaadin-tabsheet>
            `,
            div,
          );
        });

        it('default', async () => {
          await visualDiff(div, `${dir}-horizontal-default`);
        });

        it('content-borders', async () => {
          element.setAttribute('theme', 'content-borders');
          await visualDiff(div, `${dir}-horizontal-content-borders`);
        });
      });

      describe(`${dir}-vertical`, () => {
        beforeEach(() => {
          element = fixtureSync(
            `
            <vaadin-tabsheet orientation="vertical">
              <div slot="prefix">Prefix</div>
              <div slot="suffix">Suffix</div>
      
              <vaadin-tabs slot="tabs">
                <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
                <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
                <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
              </vaadin-tabs>
      
              <div tab="tab-1">Panel 1</div>
              <div tab="tab-2">Panel 2</div>
              <div tab="tab-3">Panel 3</div>
            </vaadin-tabsheet>
            `,
            div,
          );
        });

        it('default', async () => {
          await visualDiff(div, `${dir}-vertical-default`);
        });

        it('content-borders', async () => {
          element.setAttribute('theme', 'content-borders');
          await visualDiff(div, `${dir}-vertical-content-borders`);
        });
      });
    });
  });
});
