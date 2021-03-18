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
    element.editedItem = {};
    await visualDiff(div, 'crud:basic');
  });

  it('editor-position-bottom', async () => {
    element.editorPosition = 'bottom';
    await nextRender(element);
    element.editedItem = {};
    await visualDiff(div, 'crud:editor-position-bottom');
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('editor-position-aside', async () => {
        element.editorPosition = 'aside';
        await nextRender(element);
        element.editedItem = {};
        await visualDiff(div, `crud:${dir}-editor-position-aside`);
      });
    });
  });
});
