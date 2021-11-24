import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-crud.js';

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
    await visualDiff(div, 'basic');
  });

  it('basic-edit', async () => {
    element.editedItem = element.items[0];
    await visualDiff(div, 'basic-edit');
  });

  it('editor-position-bottom', async () => {
    element.editorPosition = 'bottom';
    await nextRender(element);
    element.editedItem = {};
    await visualDiff(div, 'editor-position-bottom');
  });

  it('editor-position-bottom-edit', async () => {
    element.editorPosition = 'bottom';
    await nextRender(element);
    element.editedItem = element.items[0];
    await visualDiff(div, 'editor-position-bottom-edit');
  });

  it('toolbar-visible-by-default', async () => {
    await visualDiff(div, 'toolbar-visible');
  });

  it('no-toolbar', async () => {
    element.noToolbar = true;
    await visualDiff(div, 'toolbar-hidden');
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
        await visualDiff(div, `${dir}-editor-position-aside`);
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
