import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-crud.js';
import { flushGrid } from '../../grid/test/helpers.js';

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
      let crud, dialog, form, btnCancel, overlay;

      beforeEach(async () => {
        crud = fixtureSync(tpl);
        crud.editOnClick = true;
        crud._fullscreen = false;
        await nextRender(crud);
        flushGrid(crud._grid);

        crud.set('items', [{ foo: 'bar' }, { foo: 'baz' }]);
        form = crud._form;
        dialog = crud.$.dialog;
        overlay = dialog.$.overlay;
        btnCancel = crud.querySelector('[slot="cancel-button"]');
      });

      it(`should move ${type} form to dialog content with default editorPosition`, async () => {
        crud._grid.activeItem = crud.items[0];
        await nextFrame();
        expect(form.parentElement).to.equal(overlay);
      });

      it(`should move ${type} form to crud when editorPosition set to bottom`, async () => {
        crud.editorPosition = 'bottom';
        crud._grid.activeItem = crud.items[0];
        await nextFrame();
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form to crud when editorPosition set to aside`, async () => {
        crud.editorPosition = 'aside';
        crud._grid.activeItem = crud.items[0];
        await nextFrame();
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form when editorPosition changes from default to bottom`, async () => {
        crud._grid.activeItem = crud.items[0];
        btnCancel.click();

        crud.editorPosition = 'bottom';
        await nextRender(crud);

        crud._grid.activeItem = crud.items[1];
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form when editorPosition changes from bottom to default`, async () => {
        crud.editorPosition = 'bottom';
        await nextRender(crud);

        crud._grid.activeItem = crud.items[0];
        btnCancel.click();

        crud.editorPosition = '';
        await nextRender(crud);

        crud._grid.activeItem = crud.items[1];
        expect(form.parentElement).to.equal(overlay);
      });
    });
  });
});
