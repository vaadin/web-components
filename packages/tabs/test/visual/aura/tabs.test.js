import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-tabs.js';

describe('tabs', () => {
  describe('basic', () => {
    let div, element;

    beforeEach(() => {
      div = document.createElement('div');
      div.style.padding = '10px';
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

    it('horizontal', async () => {
      await visualDiff(div, 'horizontal');
    });

    it('orientation', async () => {
      element.orientation = 'vertical';
      div.style.width = '150px';
      await visualDiff(div, 'vertical');
    });

    it('filled', async () => {
      element.setAttribute('theme', 'filled');
      await visualDiff(div, 'filled');
    });
  });

  describe('scroll', () => {
    let div, element;

    ['horizontal', 'vertical'].forEach((orientation) => {
      describe(orientation, () => {
        beforeEach(async () => {
          div = document.createElement('div');
          div.style.padding = '10px';

          if (orientation === 'vertical') {
            div.style.width = '150px';
            div.style.height = '400px';
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

          await nextFrame();
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
