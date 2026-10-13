import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/form-layout/vaadin-form-layout.js';
import '@vaadin/text-field/vaadin-text-field.js';
import '../../not-animated-styles.css';
import '../../../src/vaadin-crud.js';

describe('crud', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-crud style="height: calc(100vh - 16px)"></vaadin-crud>', div);
    element.items = [{ name: { first: 'Susan', last: 'Smith' } }];
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('edit-button-focus', async () => {
    const button = element.querySelector('vaadin-crud-edit');
    button.focus();
    await visualDiff(div, 'edit-button-focus');
  });

  it('no-toolbar', async () => {
    element.noToolbar = true;
    await visualDiff(div, 'no-toolbar');
  });

  describe('custom form', () => {
    let form;

    beforeEach(async () => {
      form = document.createElement('vaadin-form-layout');
      form.slot = 'form';
      form.innerHTML = `
        <vaadin-text-field path="name.first"></vaadin-text-field>
        <vaadin-text-field path="name.last"></vaadin-text-field>
      `;
      element.appendChild(form);
      await nextRender();
    });

    it('editor-first-field-focus', async () => {
      element.editedItem = element.items[0];
      await nextRender();
      form.querySelector('vaadin-text-field').focus();
      const overlay = element.$.dialog.shadowRoot.querySelector('vaadin-crud-dialog-overlay');
      await visualDiff(overlay.shadowRoot.querySelector('[part="overlay"]'), 'editor-first-field-focus');
    });
  });

  describe('flex', () => {
    beforeEach(async () => {
      div.style.display = 'flex';
      // Reset height to default
      div.style.height = 'auto';
      element.style.height = '400px';
      element.editorPosition = 'aside';
      await nextRender();
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
                await nextRender();
                break;
              case 'fullscreen':
                element._fullscreen = true;
                await nextRender();
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
