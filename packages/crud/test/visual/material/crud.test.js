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

      it('editor-position-default', async () => {
        element.editedItem = {};
        await visualDiff(div, `${dir}-editor-position-default-new`);
      });

      it('editor-position-default-edit', async () => {
        element.editedItem = element.items[0];
        await visualDiff(div, `${dir}-editor-position-default-edit`);
      });

      it('editor-position-bottom', async () => {
        element.editorPosition = 'bottom';
        await nextRender(element);
        element.editedItem = {};
        await visualDiff(div, `${dir}-editor-position-bottom-new`);
      });

      it('editor-position-bottom-edit', async () => {
        element.editorPosition = 'bottom';
        await nextRender(element);
        element.editedItem = element.items[0];
        await visualDiff(div, `${dir}-editor-position-bottom-edit`);
      });

      it('editor-position-aside', async () => {
        element.editorPosition = 'aside';
        await nextRender(element);
        element.editedItem = {};
        await visualDiff(div, `${dir}-editor-position-aside-new`);
      });

      it('editor-position-aside-edit', async () => {
        element.editorPosition = 'aside';
        await nextRender(element);
        element.editedItem = element.items[0];
        await visualDiff(div, `${dir}-editor-position-aside-edit`);
      });
    });
  });
});
