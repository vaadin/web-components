import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-crud.js';
import { flushGrid } from './helpers.js';

describe('crud editor', () => {
  let crud;

  describe('header', () => {
    let header;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.items = [{ foo: 'bar' }];
      header = crud.querySelector('[slot=header]');
      await nextRender(crud._grid);
    });

    it('should have new item title', () => {
      crud.$.new.click();
      expect(header.textContent).to.be.equal('New item');
    });

    it('should have edit item title', () => {
      crud.editedItem = crud.items[0];
      expect(header.textContent).to.be.equal('Edit item');
    });

    it('should change to new item title', () => {
      crud.editedItem = crud.items[0];
      expect(header.textContent).to.be.equal('Edit item');
      crud.$.new.click();
      expect(header.textContent).to.be.equal('New item');
    });
  });

  ['default', 'custom'].forEach((type) => {
    describe(`${type} form`, () => {
      let dialog, form, btnCancel, overlay;

      beforeEach(async () => {
        if (type === 'default') {
          crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
        } else {
          crud = fixtureSync(`
            <vaadin-crud style="width: 300px;">
              <vaadin-form-layout slot="form">
                <vaadin-text-field path="foo" required></vaadin-text-field>
              </vaadin-form-layout>
            </vaadin-crud>
          `);
        }
        crud.editOnClick = true;
        crud._fullscreen = false;
        await nextRender(crud);
        flushGrid(crud._grid);

        crud.set('items', [{ foo: 'bar' }, { foo: 'baz' }]);
        dialog = crud.$.dialog;
        overlay = dialog.$.overlay;
        form = crud.querySelector('[slot=form]');
        btnCancel = crud.querySelector('[slot="cancel-button"]');
      });

      it(`should move ${type} form to dialog content with default editorPosition`, () => {
        crud._grid.activeItem = crud.items[0];
        expect(form.parentElement).to.equal(overlay);
      });

      it(`should move ${type} form to crud when editorPosition set to bottom`, () => {
        crud.editorPosition = 'bottom';
        crud._grid.activeItem = crud.items[0];
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form to crud when editorPosition set to aside`, () => {
        crud.editorPosition = 'aside';
        crud._grid.activeItem = crud.items[0];
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
