import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-crud.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getDialogEditor, getInlineEditor, getVisibleRows } from './helpers.js';

describe('a11y', () => {
  let crud;

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  function focusRestorationTests(testId, createFixture) {
    describe(`focus restoration - ${testId}`, () => {
      let grid, form, dialog, newButton, saveButton, cancelButton, editButtons;

      describe('create item', () => {
        beforeEach(async () => {
          crud = createFixture();
          crud.items = [{ title: 'Item 1' }];
          await nextRender();
          dialog = getDialogEditor(crud);
          form = crud.querySelector('vaadin-crud-form');
          newButton = crud.querySelector('[slot=new-button]');
          saveButton = crud.querySelector('[slot=save-button]');
          cancelButton = crud.querySelector(':scope > [slot=cancel-button]');
          editButtons = crud.querySelectorAll('vaadin-crud-edit');
        });

        it('should move focus to the dialog on new dialog open', async () => {
          newButton.focus();
          newButton.click();
          await nextRender();
          expect(getDeepActiveElement()).to.equal(dialog);
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
          crud = createFixture();
          crud.editorPosition = 'aside';
          crud.items = Array.from({ length: 50 }, (_, i) => {
            return { title: `Item ${i}` };
          });
          await nextRender();
          grid = crud.querySelector('vaadin-crud-grid') || crud.querySelector('vaadin-grid');
          form = crud.querySelector('vaadin-crud-form');
          newButton = crud.querySelector('[slot=new-button]');
          saveButton = crud.querySelector('[slot=save-button]');
          cancelButton = crud.querySelector(':scope > [slot=cancel-button]');
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

          const firstVisibleRow = getVisibleRows(grid.$.items)[0];
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

          const firstVisibleRow = getVisibleRows(grid.$.items)[0];
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
          const secondVisibleRow = getVisibleRows(grid.$.items)[1];
          expect(getDeepActiveElement()).to.equal(secondVisibleRow);
        });
      });

      describe('delete item', () => {
        let deleteButton;

        beforeEach(() => {
          crud = createFixture();
          crud.editorPosition = 'aside';
          newButton = crud.querySelector('[slot=new-button]');
          deleteButton = crud.querySelector('[slot=delete-button]');
        });

        describe('multiple rows', () => {
          beforeEach(async () => {
            crud.items = Array.from({ length: 50 }, (_, i) => {
              return { title: `Item ${i}` };
            });
            await nextRender();
            grid = crud.querySelector('vaadin-crud-grid') || crud.querySelector('vaadin-grid');
            editButtons = [...crud.querySelectorAll('vaadin-crud-edit')];
          });

          it('should restore focus to first visible row on delete', async () => {
            editButtons[8].focus();
            editButtons[8].click();
            await nextRender();

            // Scroll a bit to get a couple of rows out of the grid's viewport.
            grid.scrollToIndex(2);
            await nextRender();

            deleteButton.focus();
            deleteButton.click();
            await nextRender();

            const confirmButton = getDeepActiveElement();
            confirmButton.focus();
            confirmButton.click();

            const firstVisibleRow = getVisibleRows(grid.$.items)[0];
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
  }

  focusRestorationTests('default grid', () => fixtureSync('<vaadin-crud></vaadin-crud>'));
  focusRestorationTests('slotted grid', () =>
    fixtureSync(`
      <vaadin-crud>
        <vaadin-grid slot="grid">
          <vaadin-crud-edit-column></vaadin-crud-edit-column>
          <vaadin-grid-column path="title" header="Title"></vaadin-grid-column>
        </vaadin-grid>
      </vaadin-crud>
  `),
  );

  ['aside', 'bottom'].forEach((editorPosition) => {
    describe(`editor focus - ${editorPosition} position`, () => {
      let newButton, editButtons, editor;

      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud></vaadin-crud>');
        crud.editorPosition = editorPosition;
        crud.items = [{ title: 'Item 1' }];
        await nextRender();
        newButton = crud.querySelector('[slot=new-button]');
        editButtons = crud.querySelectorAll('vaadin-crud-edit');
        editor = getInlineEditor(crud);
      });

      afterEach(async () => {
        crud.editorOpened = false;
        await nextRender();
      });

      it('should move focus to the editor on new button click', async () => {
        newButton.focus();
        newButton.click();
        await nextRender();
        expect(getDeepActiveElement()).to.equal(editor);
      });

      it('should move focus to the editor on edit button click', async () => {
        editButtons[0].focus();
        editButtons[0].click();
        await nextRender();
        expect(getDeepActiveElement()).to.equal(editor);
      });
    });
  });

  describe('dialog ARIA attributes', () => {
    let newButton, editButtons, dialog;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud></vaadin-crud>');
      crud.items = [{ title: 'Item 1' }];
      await nextRender();
      newButton = crud.querySelector('[slot=new-button]');
      editButtons = crud.querySelectorAll('vaadin-crud-edit');
      dialog = getDialogEditor(crud);
    });

    afterEach(async () => {
      crud.editorOpened = false;
      await nextRender();
    });

    it('should set correct role attribute to the dialog', async () => {
      newButton.click();
      await nextRender();
      expect(dialog.getAttribute('role')).to.equal('dialog');
    });

    it('should set correct aria-label to the new item dialog', async () => {
      newButton.click();
      await nextRender();
      expect(dialog.getAttribute('aria-label')).to.equal('New item');
    });

    it('should set correct aria-label to the edit item dialog', async () => {
      editButtons[0].click();
      await nextRender();
      expect(dialog.getAttribute('aria-label')).to.equal('Edit item');
    });
  });
});
