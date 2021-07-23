import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { flushGrid } from './helpers.js';
import '../src/vaadin-crud.js';

describe('vaadin-crud editor', () => {
  ['default', 'custom'].forEach((type) => {
    const tpl =
      type === 'default'
        ? '<vaadin-crud style="width: 300px;"></vaadin-crud>'
        : `<vaadin-crud style="width: 300px;">
        <vaadin-form-layout slot="form">
          <vaadin-text-field path="foo" required></vaadin-text-field>
        </vaadin-form-layout>
      </vaadin-crud>`;

    describe(`${type} form`, () => {
      let crud, dialog, form, overlay;

      beforeEach(async () => {
        crud = fixtureSync(tpl);
        crud.editOnClick = true;
        crud.__mobile = false;
        await nextRender(crud);
        flushGrid(crud._grid);

        crud.set('items', [{ foo: 'bar' }, { foo: 'baz' }]);
        form = crud.$.dialog.form;
        dialog = crud.$.dialog.$.dialog;
        overlay = dialog.$.overlay;
      });

      it(`should move ${type} form to dialog content with default editorPosition`, () => {
        crud._grid.activeItem = crud.items[0];
        expect(form.parentElement).to.equal(overlay);
      });

      it(`should move ${type} form to layout when editorPosition set to bottom`, () => {
        crud.editorPosition = 'bottom';
        crud._grid.activeItem = crud.items[0];
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form to layout when editorPosition set to aside`, () => {
        crud.editorPosition = 'aside';
        crud._grid.activeItem = crud.items[0];
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form when editorPosition changes from default to bottom`, async () => {
        crud._grid.activeItem = crud.items[0];
        const cancel = overlay.querySelector('[slot=cancel]');
        cancel.click();

        crud.editorPosition = 'bottom';
        await nextRender(crud);

        crud._grid.activeItem = crud.items[1];
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form when editorPosition changes from bottom to default`, async () => {
        crud.editorPosition = 'bottom';
        await nextRender(crud);

        crud._grid.activeItem = crud.items[0];
        const cancel = crud.$.dialog.querySelector('[slot=cancel]');
        cancel.click();

        crud.editorPosition = '';
        await nextRender(crud);

        crud._grid.activeItem = crud.items[1];
        expect(form.parentElement).to.equal(overlay);
      });
    });
  });
});
