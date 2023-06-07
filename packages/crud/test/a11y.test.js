import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { setViewport } from '@web/test-runner-commands';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-crud.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getBodyRowsInViewport } from './helpers.js';

describe('a11y', () => {
  let crud;

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  describe('focus restoration', () => {
    let grid, form, overlay, newButton, saveButton, cancelButton, editButtons;

    describe('create item', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.items = [{ title: 'Item 1' }];
        await nextRender();
        overlay = crud.$.dialog.$.overlay;
        form = crud.querySelector('vaadin-crud-form');
        newButton = crud.querySelector('[slot=new-button]');
        saveButton = crud.querySelector('[slot=save-button]');
        cancelButton = crud.querySelector('[slot=cancel-button]');
        editButtons = crud.querySelectorAll('vaadin-crud-edit');
      });

      it('should move focus to the dialog on new dialog open', async () => {
        newButton.focus();
        newButton.click();
        await nextRender();
        expect(getDeepActiveElement()).to.equal(overlay.$.overlay);
      });

      it('should restore focus to previous element on new dialog close', async () => {
        newButton.focus();
        newButton.click();
        await nextRender();
        await sendKeys({ press: 'Escape' });
        expect(getDeepActiveElement()).to.equal(newButton);
      });

      it('should restore focus to previous element on save', async () => {
        newButton.focus();
        newButton.click();
        await nextRender();

        form.querySelector('vaadin-text-field').focus();
        await sendKeys({ type: 'something' });

        saveButton.focus();
        saveButton.click();
        expect(getDeepActiveElement()).to.equal(newButton);
      });

      it('should restore focus to previous element on cancel', async () => {
        newButton.focus();
        newButton.click();
        await nextRender();

        cancelButton.focus();
        cancelButton.click();
        expect(getDeepActiveElement()).to.equal(newButton);
      });
    });

    describe('edit item', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud editor-position="aside"></vaadin-crud>');
        crud.items = Array.from({ length: 50 }, (_, i) => {
          return { title: `Item ${i}` };
        });
        await nextRender();
        grid = crud.querySelector('vaadin-crud-grid');
        form = crud.querySelector('vaadin-crud-form');
        newButton = crud.querySelector('[slot=new-button]');
        saveButton = crud.querySelector('[slot=save-button]');
        cancelButton = crud.querySelector('[slot=cancel-button]');
        editButtons = crud.querySelectorAll('vaadin-crud-edit');
      });

      it('should restore focus to previous element on save', async () => {
        editButtons[0].focus();
        editButtons[0].click();
        await nextRender();

        // Edit the item
        form.querySelector('vaadin-text-field').focus();
        await sendKeys({ type: 'something' });

        saveButton.focus();
        saveButton.click();
        expect(getDeepActiveElement()).to.equal(editButtons[0]);
      });

      it('should restore focus to first visible row on save if previous element has been re-used for another item', async () => {
        editButtons[0].focus();
        editButtons[0].click();
        await nextRender();

        // Scroll to the end to trigger the grid to re-use
        // the saved focused element (the edit button) for another item.
        grid.scrollToIndex(crud.items.length - 1);
        await nextRender();

        // Edit the item
        form.querySelector('vaadin-text-field').focus();
        await sendKeys({ type: 'something' });

        saveButton.focus();
        saveButton.click();

        const firstVisibleRow = getBodyRowsInViewport(grid)[0];
        expect(getDeepActiveElement()).to.equal(firstVisibleRow);
      });

      it('should restore focus to previous element on cancel', async () => {
        editButtons[0].focus();
        editButtons[0].click();
        await nextRender();

        // Edit the item
        form.querySelector('vaadin-text-field').focus();
        await sendKeys({ type: 'something' });

        cancelButton.focus();
        cancelButton.click();
        await nextRender();

        const confirmButton = getDeepActiveElement();
        confirmButton.focus();
        confirmButton.click();
        expect(getDeepActiveElement()).to.equal(editButtons[0]);
      });

      it('should restore focus to first visible row on cancel if previous element has been re-used for another item', async () => {
        editButtons[0].focus();
        editButtons[0].click();
        await nextRender();

        // Scroll to the end to trigger the grid to re-use
        // the saved focused element (the edit button) for another item.
        grid.scrollToIndex(crud.items.length - 1);
        await nextRender();

        cancelButton.focus();
        cancelButton.click();
        await nextRender();

        const firstVisibleRow = getBodyRowsInViewport(grid)[0];
        expect(getDeepActiveElement()).to.equal(firstVisibleRow);
      });

      it('should switch to row focus mode when restoring focus to first visible row', async () => {
        editButtons[0].focus();
        editButtons[0].click();
        await nextRender();

        // Scroll to the end to trigger the grid to re-use
        // the saved focused element (the edit button) for another item.
        grid.scrollToIndex(crud.items.length - 1);
        await nextRender();

        cancelButton.focus();
        cancelButton.click();
        await nextRender();

        await sendKeys({ press: 'ArrowDown' });
        const secondVisibleRow = getBodyRowsInViewport(grid)[1];
        expect(getDeepActiveElement()).to.equal(secondVisibleRow);
      });
    });

    describe('delete item', () => {
      let deleteButton;

      beforeEach(() => {
        crud = fixtureSync('<vaadin-crud editor-position="aside"></vaadin-crud>');
        newButton = crud.querySelector('[slot=new-button]');
        deleteButton = crud.querySelector('[slot=delete-button]');
      });

      describe('multiple rows', () => {
        beforeEach(async () => {
          crud.items = Array.from({ length: 50 }, (_, i) => {
            return { title: `Item ${i}` };
          });
          await nextRender();
          grid = crud.querySelector('vaadin-crud-grid');
          editButtons = [...crud.querySelectorAll('vaadin-crud-edit')];
        });

        it('should restore focus to first visible row on delete', async () => {
          // Scroll a bit to get a couple of rows out of the grid's viewport.
          grid.scrollToIndex(2);
          await nextRender();

          editButtons[8].focus();
          editButtons[8].click();
          await nextRender();

          deleteButton.focus();
          deleteButton.click();
          await nextRender();

          const confirmButton = getDeepActiveElement();
          confirmButton.focus();
          confirmButton.click();

          const firstVisibleRow = getBodyRowsInViewport(grid)[0];
          expect(getDeepActiveElement()).to.equal(firstVisibleRow);
        });
      });

      describe('single row', () => {
        beforeEach(async () => {
          crud.items = [{ title: 'Item 1' }];
          await nextRender();
          editButtons = [...crud.querySelectorAll('vaadin-crud-edit')];
        });

        it('should restore focus to new button on delete', async () => {
          editButtons[0].focus();
          editButtons[0].click();
          await nextRender();

          deleteButton.focus();
          deleteButton.click();
          await nextRender();

          const confirmButton = getDeepActiveElement();
          confirmButton.focus();
          confirmButton.click();
          expect(getDeepActiveElement()).to.equal(newButton);
        });
      });
    });
  });
});
