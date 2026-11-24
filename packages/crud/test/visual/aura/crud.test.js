import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '@vaadin/form-layout/vaadin-form-layout.js';
import '@vaadin/text-field/vaadin-text-field.js';
import '../../not-animated-styles.css';
import '../../../vaadin-crud.js';

describe('crud', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-crud style="height: 100%"></vaadin-crud>', div);
    element.items = [{ name: { first: 'John', last: 'Doe' } }, { name: { first: 'Jane', last: 'Doe' } }];
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('column-borders', async () => {
    element.setAttribute('theme', 'column-borders');
    await visualDiff(element, 'column-borders');
  });

  it('no-row-borders', async () => {
    element.setAttribute('theme', 'no-row-borders');
    await visualDiff(element, 'no-row-borders');
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

  ['default', 'aside', 'bottom'].forEach((position) => {
    describe(`editor-position-${position}`, () => {
      beforeEach(async () => {
        switch (position) {
          case 'aside':
          case 'bottom':
            element.editorPosition = position;
            await nextRender();
            break;
          default:
          // Do nothing
        }
      });

      it(`editor-position-${position}`, async () => {
        element.editedItem = {};
        await visualDiff(div, `editor-position-${position}`);
      });
    });
  });
});
