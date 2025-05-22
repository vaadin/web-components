import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-crud.js';
import { flushGrid } from './helpers.js';

describe('crud editor', () => {
  let crud;

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  afterEach(async () => {
    // Wait until the crud dialog overlay is closed
    let overlay;
    while ((overlay = document.querySelector('body > vaadin-crud-dialog-overlay'))) {
      // Press esc to close the dialog
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await aTimeout(1);
    }
  });

  describe('header', () => {
    let header;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.items = [{ foo: 'bar' }];
      header = crud.querySelector('[slot=header]');
      await nextRender();
    });

    it('should have new item title', async () => {
      crud._newButton.click();
      await nextRender();
      expect(header.textContent).to.be.equal('New item');
    });

    it('should have edit item title', async () => {
      crud.editedItem = crud.items[0];
      await nextRender();
      expect(header.textContent).to.be.equal('Edit item');
    });

    it('should change to new item title', async () => {
      crud.editedItem = crud.items[0];
      expect(header.textContent).to.be.equal('Edit item');
      crud._newButton.click();
      await nextRender();
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
        await nextRender();
        flushGrid(crud._grid);

        crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
        await nextRender();
        dialog = crud.$.dialog;
        overlay = dialog.$.overlay;
        form = crud.querySelector('[slot=form]');
        btnCancel = crud.querySelector('[slot="cancel-button"]');
      });

      it(`should move ${type} form to dialog content with default editorPosition`, async () => {
        crud._grid.activeItem = crud.items[0];
        await nextRender();
        expect(form.parentElement).to.equal(overlay);
      });

      it(`should move ${type} form to crud after dialog closing with default editorPosition`, async () => {
        crud._grid.activeItem = crud.items[0];
        await nextRender();
        btnCancel.click();
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form to crud when editorPosition set to bottom`, async () => {
        crud.editorPosition = 'bottom';
        crud._grid.activeItem = crud.items[0];
        await nextRender();
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form to crud when editorPosition set to aside`, async () => {
        crud.editorPosition = 'aside';
        crud._grid.activeItem = crud.items[0];
        await nextRender();
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form when editorPosition changes from default to bottom`, async () => {
        crud._grid.activeItem = crud.items[0];
        await nextRender();
        btnCancel.click();

        crud.editorPosition = 'bottom';
        await nextRender();

        crud._grid.activeItem = crud.items[1];
        await nextRender();
        expect(form.parentElement).to.equal(crud);
      });

      it(`should move ${type} form when editorPosition changes from bottom to default`, async () => {
        crud.editorPosition = 'bottom';
        await nextRender();

        crud._grid.activeItem = crud.items[0];
        await nextRender();
        btnCancel.click();

        crud.editorPosition = '';
        await nextRender();

        crud._grid.activeItem = crud.items[1];
        await nextRender();
        expect(form.parentElement).to.equal(overlay);
      });

      it('should support replacing the form when the dialog is open', async () => {
        const newForm = fixtureSync(`
          <vaadin-form-layout slot="form">
            <vaadin-text-field path="foo" required></vaadin-text-field>
          </vaadin-form-layout>
        `);

        crud._grid.activeItem = crud.items[0];
        crud.appendChild(newForm);
        await nextRender();

        expect(form.parentElement).to.be.null;
        expect(newForm.parentElement).to.equal(overlay);
      });

      it('should not cover the editor content with focus ring element', async () => {
        // Open the editor
        crud.editorPosition = 'aside';
        crud._newButton.click();
        await nextRender();

        // Get the elementFromPoint of the editor header
        const header = crud.querySelector('[slot=header]');
        const headerRect = header.getBoundingClientRect();
        const x = headerRect.left + headerRect.width / 2;
        const y = headerRect.top + headerRect.height / 2;
        const elementFromPoint = document.elementFromPoint(x, y);

        expect(elementFromPoint).to.equal(header);
      });
    });
  });
});
