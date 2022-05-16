import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-tabs.js';

describe('tabs', () => {
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
              <vaadin-tabs>
                <vaadin-tab>Foo</vaadin-tab>
                <vaadin-tab>Bar</vaadin-tab>
                <vaadin-tab>Baz</vaadin-tab>
              </vaadin-tabs>
            `,
            div,
          );
        });

        it('start', async () => {
          await visualDiff(div, `${dir}-horizontal-start`);
        });

        it('middle', async () => {
          element.selected = 1;
          await visualDiff(div, `${dir}-horizontal-middle`);
        });

        it('end', async () => {
          element.selected = 2;
          await visualDiff(div, `${dir}-horizontal-end`);
        });

        it('centered', async () => {
          element.setAttribute('theme', 'centered');
          await visualDiff(div, `${dir}-horizontal-centered`);
        });

        it('centered', async () => {
          element.setAttribute('theme', 'centered');
          element.style.maxWidth = '150px';
          await visualDiff(div, `${dir}-horizontal-centered-scroll`);
        });
      });

      describe(`${dir}-vertical`, () => {
        beforeEach(() => {
          element = fixtureSync(
            `
              <vaadin-tabs orientation="vertical" style="width: 150px">
                <vaadin-tab>Foo</vaadin-tab>
                <vaadin-tab>Bar</vaadin-tab>
                <vaadin-tab>Baz</vaadin-tab>
              </vaadin-tabs>
            `,
            div,
          );
        });

        it('start', async () => {
          await visualDiff(div, `${dir}-vertical-start`);
        });

        it('middle', async () => {
          element.selected = 1;
          await visualDiff(div, `${dir}-vertical-middle`);
        });

        it('end', async () => {
          element.selected = 2;
          await visualDiff(div, `${dir}-vertical-end`);
        });
      });
    });
  });

  describe('anchors', () => {
    beforeEach(() => {
      element = fixtureSync(
        `
          <vaadin-tabs>
            <vaadin-tab><a href="#">Foo</a></vaadin-tab>
            <vaadin-tab><a href="#">Bar</a></vaadin-tab>
            <vaadin-tab><a href="#">Baz</a></vaadin-tab>
          </vaadin-tabs>
        `,
        div,
      );
    });

    it('horizontal', async () => {
      await visualDiff(div, 'anchors-horizontal');
    });

    it('vertical', async () => {
      element.orientation = 'vertical';
      await visualDiff(div, 'anchors-vertical');
    });
  });

  describe('scroll', () => {
    ['horizontal', 'vertical'].forEach((orientation) => {
      describe(orientation, () => {
        beforeEach(() => {
          if (orientation === 'vertical') {
            div.style.height = '150px';
            div.style.display = 'inline-flex';
          } else {
            div.style.width = '400px';
          }

          element = fixtureSync(
            `
              <vaadin-tabs style="overflow: hidden">
                <vaadin-tab>Tab-00</vaadin-tab>
                <vaadin-tab>Tab-01</vaadin-tab>
                <vaadin-tab>Tab-02</vaadin-tab>
                <vaadin-tab>Tab-03</vaadin-tab>
                <vaadin-tab>Tab-04</vaadin-tab>
                <vaadin-tab>Tab-05</vaadin-tab>
                <vaadin-tab>Tab-06</vaadin-tab>
                <vaadin-tab>Tab-07</vaadin-tab>
                <vaadin-tab>Tab-08</vaadin-tab>
                <vaadin-tab>Tab-09</vaadin-tab>
                <vaadin-tab>Tab-10</vaadin-tab>
                <vaadin-tab>Tab-11</vaadin-tab>
                <vaadin-tab>Tab-12</vaadin-tab>
                <vaadin-tab>Tab-13</vaadin-tab>
                <vaadin-tab>Tab-14</vaadin-tab>
                <vaadin-tab>Tab-15</vaadin-tab>
              </vaadin-tabs>
            `,
            div,
          );
        });

        ['ltr', 'rtl'].forEach((dir) => {
          describe(dir, () => {
            before(() => {
              document.documentElement.setAttribute('dir', dir);
            });

            after(() => {
              document.documentElement.removeAttribute('dir');
            });

            it('selected', async () => {
              element.orientation = orientation;
              element.selected = 8;
              await visualDiff(div, `${dir}-${orientation}-scroll`);
            });
          });
        });
      });
    });
  });
});
