import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/item/theme/lumo/vaadin-item.js';
import '../../../theme/lumo/vaadin-list-box.js';

describe('list-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-list-box>
          <vaadin-item focused focus-ring>Item 0</vaadin-item>
          <vaadin-item>Item 1</vaadin-item>
          <vaadin-item>Item 2</vaadin-item>
          <vaadin-item disabled>Item 3</vaadin-item>
          <hr>
          <vaadin-item>Item 4</vaadin-item>
        </vaadin-list-box>
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

      it('basic', async () => {
        element.selected = 2;
        await visualDiff(div, `${dir}-basic`);
      });

      it('multiple', async () => {
        element.multiple = true;
        element.selectedValues = [1, 2];
        await visualDiff(div, `${dir}-multiple`);
      });
    });
  });
});
