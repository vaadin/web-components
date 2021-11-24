import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-crud.js';

describe('crud', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-crud style="height: calc(100vh - 16px)"></vaadin-crud>', div);
    element.items = [{ name: { first: 'Susan', last: 'Smith' } }];
    await nextRender(element);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('no-toolbar', async () => {
    element.noToolbar = true;
    await visualDiff(div, 'no-toolbar');
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      ['default', 'aside', 'bottom'].forEach((position) => {
        describe(`${dir}-editor-position-${position}`, () => {
          beforeEach(async () => {
            if (position !== 'default') {
              element.editorPosition = position;
              await nextRender(element);
            }
          });

          it(`editor-position-${position}-new`, async () => {
            element.editedItem = {};
            await visualDiff(div, `${dir}-editor-position-${position}-new`);
          });

          it(`editor-position-${position}-edit`, async () => {
            element.editedItem = element.items[0];
            await visualDiff(div, `${dir}-editor-position-${position}-edit`);
          });
        });
      });
    });
  });
});
