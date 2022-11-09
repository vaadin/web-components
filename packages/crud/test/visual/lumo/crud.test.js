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
    await visualDiff(div, 'basic');
  });

  it('edit-button-focus', async () => {
    const button = element.querySelector('vaadin-crud-edit');
    button.focus();
    button.setAttribute('focus-ring', '');
    await visualDiff(div, 'edit-button-focus');
  });

  it('no-toolbar', async () => {
    element.noToolbar = true;
    await visualDiff(div, 'no-toolbar');
  });

  it('theme-no-border', async () => {
    element.setAttribute('theme', 'no-border');
    await visualDiff(div, 'theme-no-border');
  });

  it('theme-no-border-edit', async () => {
    element.setAttribute('theme', 'no-border');
    element.editedItem = element.items[0];
    await visualDiff(div, 'theme-no-border-edit');
  });

  describe('flex', () => {
    beforeEach(async () => {
      div.style.display = 'flex';
      // Reset height to default
      div.style.height = 'auto';
      element.style.height = '400px';
      element.editorPosition = 'aside';
      await nextRender(element);
    });

    it('row', async () => {
      element.editedItem = element.items[0];
      await visualDiff(div, 'flex-layout');
    });

    it('column', async () => {
      div.style.flexDirection = 'column';
      element.editedItem = element.items[0];
      await visualDiff(div, 'flex-column-layout');
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

      ['default', 'aside', 'bottom', 'fullscreen'].forEach((position) => {
        describe(`${dir}-editor-position-${position}`, () => {
          beforeEach(async () => {
            switch (position) {
              case 'aside':
              case 'bottom':
                element.editorPosition = position;
                await nextRender(element);
                break;
              case 'fullscreen':
                element._fullscreen = true;
                await nextRender(element);
                break;
              default:
              // Do nothing
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
