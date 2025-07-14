import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { aTimeout, change, click, fire, fixtureSync, listenOnce, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-crud.js';
import { flushGrid } from './helpers.js';

describe('crud buttons', () => {
  let crud, saveButton, cancelButton, deleteButton;

  function edit(item) {
    fire(crud._grid, 'edit', { item });
  }

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  ['default', 'slotted'].forEach((mode) => {
    const isDefault = mode === 'default';

    describe(mode, () => {
      beforeEach(async () => {
        if (isDefault) {
          crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
        } else {
          crud = fixtureSync(`
            <vaadin-crud style="width: 300px;">
              <vaadin-button slot="save-button"></vaadin-button>
              <vaadin-button slot="cancel-button"></vaadin-button>
              <vaadin-button slot="delete-button"></vaadin-button>
            </vaadin-crud>
          `);
        }
        crud.items = [{ foo: 'bar' }];
        await nextRender();
        saveButton = crud.querySelector('[slot=save-button]');
        cancelButton = crud.querySelector('[slot=cancel-button]');
        deleteButton = crud.querySelector('[slot=delete-button]');
      });

      describe('i18n', () => {
        (isDefault ? describe : describe.skip)('i18n', () => {
          it('should set the label for the delete button', () => {
            expect(deleteButton.textContent).to.equal(crud.i18n.deleteItem);
          });

          it('should update the label of the delete button on i18n property change', () => {
            crud.i18n = { deleteItem: 'Custom' };
            expect(deleteButton.textContent).to.equal('Custom');
          });

          it('should set the label for the save button', () => {
            expect(saveButton.textContent).to.equal(crud.i18n.saveItem);
          });

          it('should update the label of the save button on i18n property change', () => {
            crud.i18n = { saveItem: 'Custom' };
            expect(saveButton.textContent).to.equal('Custom');
          });

          it('should set the label for the cancel button', () => {
            expect(cancelButton.textContent).to.equal(crud.i18n.cancel);
          });

          it('should update the label of the cancel button on i18n property change', () => {
            crud.i18n = { cancel: 'Custom' };
            expect(cancelButton.textContent).to.equal('Custom');
          });
        });
      });

      describe('actions', () => {
        let confirmDeleteOverlay;

        beforeEach(() => {
          confirmDeleteOverlay = crud.$.confirmDelete.$.overlay;
        });

        it('should save an edited item', async () => {
          edit(crud.items[0]);
          await nextRender();
          crud._form._fields[0].value = 'baz';
          change(crud._form);
          saveButton.click();
          expect(crud.items[0].foo).to.be.equal('baz');
        });

        it('should save a new item', async () => {
          crud._newButton.click();
          await nextRender();
          crud._form._fields[0].value = 'baz';
          change(crud._form);
          saveButton.click();
          expect(crud.items[1].foo).to.be.equal('baz');
        });

        it('should delete an item', async () => {
          edit(crud.items[0]);
          await nextRender();
          deleteButton.click();
          await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
          confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
          expect(crud.items.length).to.be.equal(0);
        });

        it('should notify size changes', async () => {
          const spy = sinon.spy();
          crud.addEventListener('size-changed', spy);
          crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
          await nextRender();
          expect(spy.firstCall.args[0].detail.value).to.equal(2);
        });

        it('should notify editedItem changes', async () => {
          const spy = sinon.spy();
          crud.addEventListener('edited-item-changed', spy);
          edit(crud.items[0]);
          await nextRender();
          expect(spy.firstCall.args[0].detail.value).to.deep.eql({ foo: 'bar' });
        });

        // FIXME: Why is this test failing in Webkit with Lit?
        it.skip('should save a new pre-filled item', async () => {
          crud.editedItem = { foo: 'baz' };
          await nextRender();
          crud._form._fields[0].value = 'baz';
          change(crud._form);
          click(saveButton);
          expect(crud.items[1].foo).to.be.equal('baz');
        });

        it('should not delete any item if item was not in items array', async () => {
          crud.editedItem = { foo: 'baz' };
          await nextRender();
          deleteButton.click();
          await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
          confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
          expect(crud.items.length).to.be.equal(1);
        });

        it('should highlight the edited item', async () => {
          edit(crud.items[0]);
          await nextRender();
          expect(crud._grid.selectedItems).to.eql([crud.items[0]]);
        });

        it('should clear highlighting of the edited item after closing the editor', async () => {
          edit(crud.items[0]);
          await nextRender();
          crud.editorOpened = false;
          expect(crud._grid.selectedItems).to.eql([]);
        });
      });

      describe('confirmation', () => {
        let editorDialog;

        beforeEach(() => {
          editorDialog = crud.$.dialog;
        });

        afterEach(async () => {
          crud.editorOpened = false;
          await nextRender();
        });

        describe('cancel', () => {
          let confirmCancelDialog;
          let confirmCancelOverlay;

          beforeEach(() => {
            confirmCancelDialog = crud.$.confirmCancel;
            confirmCancelOverlay = confirmCancelDialog.$.overlay;
          });

          afterEach(() => {
            confirmCancelDialog.opened = false;
          });

          it('should not ask for confirmation on cancel when not modified', async () => {
            edit(crud.items[0]);
            await nextRender();
            cancelButton.click();
            expect(confirmCancelDialog.opened).not.to.be.ok;
          });

          it('should not ask for confirmation on cancel when not modified - click out', async () => {
            edit(crud.items[0]);
            await nextRender();
            crud._newButton.click();
            await nextRender();
            expect(confirmCancelDialog.opened).not.to.be.ok;
          });

          it('should not ask for confirmation on cancel when not modified - esc', async () => {
            edit(crud.items[0]);
            await nextRender();
            editorDialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
            expect(confirmCancelDialog.opened).not.to.be.ok;
          });

          it('should ask for confirmation on cancel when modified', async () => {
            edit(crud.items[0]);
            await nextRender();
            change(crud._form);
            cancelButton.click();
            await nextRender();
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should ask for confirmation on cancel when modified - click out', async () => {
            edit(crud.items[0]);
            await nextRender();
            change(crud._form);
            crud._newButton.click();
            await nextRender();
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should ask for confirmation on cancel when modified - esc', async () => {
            edit(crud.items[0]);
            await nextRender();
            change(crud._form);
            editorDialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
            await nextRender();
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should continue editing when closing confirmation with cancel', async () => {
            edit(crud.items[0]);
            await nextRender();
            change(crud._form);
            cancelButton.click();
            await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');
            confirmCancelOverlay.querySelector('[slot^="cancel"]').click();
            await nextRender();
            expect(confirmCancelDialog.opened).not.to.be.ok;
            expect(editorDialog.opened).to.be.true;
          });

          it('should cancel editing when closing confirmation with confirm', async () => {
            edit(crud.items[0]);
            await nextRender();
            change(crud._form);
            cancelButton.click();
            await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');
            confirmCancelOverlay.querySelector('[slot^="confirm"]').click();
            expect(confirmCancelDialog.opened).not.to.be.ok;
            expect(editorDialog.opened).not.to.be.ok;
          });

          it('should trigger "cancel" only once after user hits "Cancel"', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            await nextRender();

            cancelButton.click();
            await nextRender();
            expect(cancelSpyListener.calledOnce).to.be.ok;
          });

          it('should trigger "cancel" only once after user clicks out', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            await nextRender();

            crud._newButton.click();
            await nextRender();
            expect(cancelSpyListener.calledOnce).to.be.ok;
          });

          it('should trigger "cancel" only once after user hits esc', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            await nextRender();

            editorDialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
            await nextRender();
            expect(cancelSpyListener.calledOnce).to.be.ok;
          });

          it('should not trigger "cancel" after user hits "Save"', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            await nextRender();
            edit(crud.items[0]);
            await nextRender();
            change(crud._form);

            saveButton.click();
            await nextRender();
            expect(cancelSpyListener.notCalled).to.be.ok;
          });
        });

        describe('delete', () => {
          let confirmDeleteDialog;
          let confirmDeleteOverlay;

          beforeEach(() => {
            confirmDeleteDialog = crud.$.confirmDelete;
            confirmDeleteOverlay = confirmDeleteDialog.$.overlay;
          });

          it('should ask for confirmation on delete', async () => {
            edit(crud.items[0]);
            await nextRender();
            deleteButton.click();
            await nextRender();
            expect(confirmDeleteDialog.opened).to.be.true;
          });

          it('should continue editing when closing confirmation with cancel', async () => {
            edit(crud.items[0]);
            await nextRender();
            deleteButton.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="cancel"]').click();
            expect(confirmDeleteDialog.opened).not.to.be.ok;
            expect(editorDialog.opened).to.be.true;
          });

          it('should delete when closing confirmation with confirm', async () => {
            edit(crud.items[0]);
            await nextRender();
            deleteButton.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(confirmDeleteDialog.opened).not.to.be.ok;
            expect(editorDialog.opened).not.to.be.ok;
          });
        });
      });

      describe('flags', () => {
        afterEach(async () => {
          crud.editorOpened = false;
          await aTimeout(0);
          saveButton = crud.querySelector('[slot=save-button]');
          cancelButton = crud.querySelector('[slot=cancel-button]');
          deleteButton = crud.querySelector('[slot=delete-button]');
        });

        it('should configure dirty and new flags on new', async () => {
          crud._newButton.click();
          await nextRender();
          expect(crud.__isDirty).not.to.be.true;
          expect(crud.__isNew).to.be.true;
        });

        it('should configure dirty and new flags on edit', async () => {
          edit(crud.items[0]);
          await nextRender();
          expect(crud.__isDirty).not.to.be.true;
          expect(crud.__isNew).not.to.be.true;
        });

        it('should configure new flag when editedItem changed', async () => {
          crud.editedItem = crud.items[0];
          await nextRender();
          cancelButton.click();
          await nextRender();
          expect(crud.__isNew).not.to.be.true;
        });

        it('should set dirty on editor changes', async () => {
          edit(crud.items[0]);
          await nextRender();
          change(crud._form);
          expect(crud.__isDirty).to.be.true;
        });

        it('should hide delete button on new', async () => {
          crud._newButton.click();
          await nextRender();
          expect(deleteButton.hasAttribute('hidden')).to.be.true;
        });

        it('should show delete button and disable save button on edit', async () => {
          edit(crud.items[0]);
          await nextRender();
          expect(saveButton.hasAttribute('disabled')).to.be.true;
          expect(deleteButton.hasAttribute('hidden')).not.to.be.true;
        });

        ['change', 'input'].forEach((type) => {
          it(`should enable save button on ${type}`, async () => {
            edit(crud.items[0]);
            await nextRender();
            crud._form.dispatchEvent(new Event(type, { bubbles: true }));
            expect(saveButton.hasAttribute('disabled')).not.to.be.true;
          });
        });

        describe('editor position', () => {
          let confirmCancelDialog;
          let confirmCancelOverlay;

          beforeEach(async () => {
            crud.editorPosition = 'bottom';
            crud.editOnClick = true;
            confirmCancelDialog = crud.$.confirmCancel;
            confirmCancelOverlay = confirmCancelDialog.$.overlay;
            await nextRender();
            flushGrid(crud._grid);
            crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
          });

          afterEach(() => {
            confirmCancelDialog.opened = false;
          });

          it('should prevent changing edited items if dirty', async () => {
            crud._grid.activeItem = crud.items[0];
            await nextRender();
            expect(crud.editorOpened).to.be.true;

            change(crud._form);
            crud._grid.activeItem = crud.items[1];
            await nextRender();

            expect(confirmCancelDialog.opened).to.be.true;
            expect(crud.editedItem).to.be.equal(crud.items[0]);
          });

          it('should prompt confirm if dirty and new button is clicked', async () => {
            crud._grid.activeItem = crud.items[0];
            await nextRender();
            expect(crud.editorOpened).to.be.true;

            change(crud._form);
            crud._newButton.click();
            await nextRender();

            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should keep editor opened if dirty, new button is clicked and changes are discarded', async () => {
            crud._grid.activeItem = crud.items[0];
            expect(crud.editorOpened).to.be.true;

            change(crud._form);
            crud._newButton.click();
            await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');

            confirmCancelOverlay.querySelector('[slot^="confirm"]').click();
            expect(crud.editorOpened).to.be.true;
          });

          it('should change edited items if dirty when user discard changes', async () => {
            crud._grid.activeItem = crud.items[0];
            change(crud._form);

            crud._grid.activeItem = crud.items[1];
            await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');

            confirmCancelOverlay.querySelector('[slot^="confirm"]').click();
            expect(crud.editedItem).to.be.equal(crud.items[1]);
          });
        });
      });

      describe('events', () => {
        afterEach(async () => {
          crud.editorOpened = false;
          await nextRender();
        });

        describe('new', () => {
          it('should fire the new event', async () => {
            const spy = sinon.spy();
            crud.addEventListener('new', spy);
            crud._newButton.click();
            await nextRender();
            expect(spy.calledOnce).to.be.true;
          });

          it('on new should set the item and open dialog if not default prevented', async () => {
            expect(crud.editedItem).not.to.be.ok;
            crud._newButton.click();
            expect(crud.editedItem).to.be.ok;
            await nextRender();
            expect(crud.editorOpened).to.be.true;
          });

          it('on new should not set the item but open dialog if default prevented', async () => {
            crud.addEventListener('new', (e) => e.preventDefault(), { once: true });
            crud._newButton.click();
            await nextRender();
            expect(crud.editedItem).not.to.be.ok;
            expect(crud.editorOpened).to.be.true;
          });
        });

        describe('edit', () => {
          it('should fire the edit event', async () => {
            const spy = sinon.spy();
            crud.addEventListener('edit', spy);
            edit(crud.items[0]);
            await nextRender();
            const event = spy.firstCall.args[0];
            expect(event.detail.item).to.be.equal(crud.items[0]);
          });

          it('should not fire the edit event over the same opened item', async () => {
            const spy = sinon.spy();
            crud.addEventListener('edit', spy);
            edit(crud.items[0]);
            await nextRender();
            edit(crud.items[0]);
            await nextRender();
            expect(spy.calledOnce).to.be.true;
          });

          it('should set the item and open dialog on edit if not default prevented', async () => {
            edit(crud.items[0]);
            expect(crud.editedItem).to.be.equal(crud.items[0]);
            await nextRender();
            expect(crud.$.dialog.opened).to.be.true;
            expect(crud.editorOpened).to.be.true;
          });

          it('should not set the item but open dialog on edit if default prevented', async () => {
            crud.addEventListener('edit', (e) => e.preventDefault(), { once: true });
            edit(crud.items[0]);
            expect(crud.editedItem).not.to.be.ok;
            await nextRender();
            expect(crud.$.dialog.opened).to.be.true;
            expect(crud.editorOpened).to.be.true;
          });
        });

        describe('save', () => {
          it('should fire the save event on save button click', async () => {
            const spy = sinon.spy();
            crud.addEventListener('save', spy);

            edit(crud.items[0]);
            await nextRender();

            change(crud._form);
            saveButton.click();
            await nextRender();

            const event = spy.firstCall.args[0];
            expect(event.detail.item).to.deep.equal(crud.items[0]);
          });

          it('should close dialog on save if not default prevented', async () => {
            edit(crud.items[0]);
            await nextRender();

            change(crud._form);
            saveButton.click();
            await nextRender();

            expect(crud.editorOpened).not.to.be.ok;
          });

          it('should keep dialog opened on save if default prevented', async () => {
            crud.addEventListener('save', (e) => e.preventDefault(), { once: true });

            edit(crud.items[0]);
            await nextRender();

            saveButton.click();
            await nextRender();

            expect(crud.editorOpened).to.be.true;
          });

          it('should keep item unmodified on save if default prevented', async () => {
            crud.addEventListener('save', (e) => e.preventDefault(), { once: true });

            const originalItem = { ...crud.items[0] };
            edit(crud.items[0]);
            await nextRender();

            crud._fields[0].value = 'Modified';
            change(crud._form);
            saveButton.click();
            await nextRender();

            expect(crud.items[0]).to.be.deep.equal(originalItem);
          });

          it('should modify item on save if not default prevented', async () => {
            const originalItem = { ...crud.items[0] };
            edit(crud.items[0]);
            await nextRender();

            crud._fields[0].value = 'Modified';
            change(crud._form);
            saveButton.click();
            await nextRender();

            expect(crud.items[0]).to.not.be.deep.equal(originalItem);
          });
        });

        describe('cancel', () => {
          it('should fire the cancel event on cancel button click', async () => {
            const spy = sinon.spy();
            crud.addEventListener('cancel', spy);

            edit(crud.items[0]);
            await nextRender();

            cancelButton.click();
            await nextRender();

            const event = spy.firstCall.args[0];
            expect(event.detail.item).to.deep.equal(crud.items[0]);
          });

          it('should close dialog on cancel if not default prevented', async () => {
            edit(crud.items[0]);
            await nextRender();

            cancelButton.click();
            await nextRender();

            expect(crud.$.dialog.opened).not.to.be.ok;
            expect(crud.editorOpened).not.to.be.ok;
          });

          it('should keep dialog opened on cancel if default prevented', async () => {
            crud.addEventListener('cancel', (e) => e.preventDefault(), { once: true });

            edit(crud.items[0]);
            await nextRender();

            cancelButton.click();
            await nextRender();

            expect(crud.editorOpened).to.be.true;
          });
        });

        describe('delete', () => {
          let confirmDeleteDialog;
          let confirmDeleteOverlay;

          beforeEach(() => {
            confirmDeleteDialog = crud.$.confirmDelete;
            confirmDeleteOverlay = confirmDeleteDialog.$.overlay;
          });

          it('should fire the delete event', async () => {
            const item = crud.items[0];
            const spy = sinon.spy();
            crud.addEventListener('delete', spy);
            edit(item);
            deleteButton.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(spy.calledOnce).to.be.true;
            expect(spy.firstCall.args[0].detail.item).to.be.equal(item);
          });

          it('on delete should close dialog if not default prevented', async () => {
            edit(crud.items[0]);
            deleteButton.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(crud.editorOpened).not.to.be.ok;
          });

          it('on delete should keep opened dialog if default prevented', async () => {
            listenOnce(crud, 'delete', (e) => e.preventDefault());
            edit(crud.items[0]);
            deleteButton.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(crud.editorOpened).to.be.true;
          });
        });
      });
    });
  });

  describe('lazy', () => {
    let button;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      await nextRender();
      button = document.createElement('vaadin-button');
    });

    describe('new', () => {
      beforeEach(() => {
        button.setAttribute('slot', 'new-button');
      });

      it('should not change text content of the custom new item button added lazily', async () => {
        button.textContent = 'New user';

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal('New user');
      });

      it('should set text content of the new item button when marked as a default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal(crud.i18n.newItem);
      });

      it('should update the new item button marked as default on i18n property change', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        crud.i18n = { newItem: 'Add user' };
        await nextRender();

        expect(button.textContent).to.equal('Add user');
      });

      it('should set theme attribute of the new item button when marked as a default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('primary');
      });

      it('should not change theme attribute of the new item button when marked as a default', async () => {
        button._isDefault = true;
        button.setAttribute('theme', 'primary success');

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('primary success');
      });
    });

    describe('delete', () => {
      beforeEach(() => {
        button.setAttribute('slot', 'delete-button');
      });

      it('should not change text content of the custom delete button added lazily', async () => {
        button.textContent = 'Drop user';

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal('Drop user');
      });

      it('should set text content of the delete button when marked as a default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal(crud.i18n.deleteItem);
      });

      it('should update the delete button marked as default on i18n property change', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        crud.i18n = { deleteItem: 'Drop user' };
        await nextRender();

        expect(button.textContent).to.equal('Drop user');
      });

      it('should set theme attribute of the delete button when marked as a default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('tertiary error');
      });

      it('should not change theme attribute of the delete button when marked as a default', async () => {
        button._isDefault = true;
        button.setAttribute('theme', 'tertiary contrast');

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('tertiary contrast');
      });
    });

    describe('save', () => {
      beforeEach(() => {
        button.setAttribute('slot', 'save-button');
      });

      it('should not set text content for the custom save button added lazily', async () => {
        button.textContent = 'Save user';

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal('Save user');
      });

      it('should set text content for the save button when marked as the default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal(crud.i18n.saveItem);
      });

      it('should update the save button marked as default on i18n property change', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        crud.i18n = { saveItem: 'Save user' };
        await nextRender();

        expect(button.textContent).to.equal('Save user');
      });

      it('should set theme attribute of the save button when marked as a default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('primary');
      });

      it('should not change theme attribute of the save button when marked as a default', async () => {
        button._isDefault = true;
        button.setAttribute('theme', 'primary contrast');

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('primary contrast');
      });
    });

    describe('cancel', () => {
      beforeEach(() => {
        button.setAttribute('slot', 'cancel-button');
      });

      it('should not set text content for the custom cancel button added lazily', async () => {
        button.textContent = 'Discard';

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal('Discard');
      });

      it('should set text content for the cancel button when marked as the default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.textContent).to.equal(crud.i18n.cancel);
      });

      it('should update the cancel button marked as default on i18n property change', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        crud.i18n = { ...crud.i18n, cancel: 'Discard' };
        await nextRender();

        expect(button.textContent).to.equal('Discard');
      });

      it('should set theme attribute of the cancel button when marked as a default', async () => {
        button._isDefault = true;

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('tertiary');
      });

      it('should not change theme attribute of the cancel button when marked as a default', async () => {
        button._isDefault = true;
        button.setAttribute('theme', 'tertiary contrast');

        crud.appendChild(button);
        await nextRender();

        expect(button.getAttribute('theme')).to.equal('tertiary contrast');
      });
    });
  });

  describe('no default buttons', () => {
    let crud;

    beforeEach(async () => {
      crud = document.createElement('vaadin-crud');
      crud._noDefaultButtons = true;
      crud.items = [{ foo: 'bar' }];
      document.body.appendChild(crud);
      await nextRender();
    });

    afterEach(() => {
      crud.remove();
    });

    it('should not create default new-button', () => {
      expect(crud.querySelector('[slot="new-button"]')).to.be.null;
    });

    it('should not create default save-button', () => {
      expect(crud.querySelector('[slot="save-button"]')).to.be.null;
    });

    it('should not create default cancel-button', () => {
      expect(crud.querySelector('[slot="cancel-button"]')).to.be.null;
    });

    it('should not create default delete-button', () => {
      expect(crud.querySelector('[slot="delete-button"]')).to.be.null;
    });

    it('should teleport form and header when no default buttons set', async () => {
      crud.editedItem = { foo: 'baz' };
      await nextRender();
      const overlay = crud.$.dialog.$.overlay;
      expect(crud._form.parentElement).to.equal(overlay);
      expect(crud._headerNode.parentElement).to.equal(overlay);
    });
  });

  describe('dataProvider', () => {
    let items;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      items = [{ foo: 'bar' }];
      crud.dataProvider = (_, callback) => callback(items, items.length);
      await nextRender();
      saveButton = crud.querySelector('[slot=save-button]');
      deleteButton = crud.querySelector('[slot=delete-button]');
    });

    it('should hide delete button on new', async () => {
      crud._newButton.click();
      await nextRender();
      expect(deleteButton.hasAttribute('hidden')).to.be.true;
    });

    it('should show delete button and disable save button on edit', async () => {
      edit(items[0]);
      await nextRender();
      expect(saveButton.hasAttribute('disabled')).to.be.true;
      expect(deleteButton.hasAttribute('hidden')).not.to.be.true;
    });
  });
});
