import { expect } from '@esm-bundle/chai';
import { aTimeout, change, fire, fixtureSync, listenOnce, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-crud.js';
import { flushGrid } from './helpers.js';

describe('crud buttons', () => {
  let crud, btnSave, btnCancel, btnDelete;

  function edit(item) {
    fire(crud._grid, 'edit', { item });
  }

  ['default', 'slotted'].forEach((mode) => {
    describe(mode, () => {
      beforeEach(async () => {
        if (mode === 'default') {
          crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
        } else {
          crud = fixtureSync(
            `<vaadin-crud style="width: 300px;">
              <vaadin-button slot="save-button"></vaadin-button>
              <vaadin-button slot="cancel-button"></vaadin-button>
              <vaadin-button slot="delete-button"></vaadin-button>
            </vaadin-crud>`
          );
        }
        crud.items = [{ foo: 'bar' }];
        await nextRender(crud._grid);
        [btnSave, btnCancel, btnDelete] = crud.querySelectorAll('vaadin-button');
      });

      describe('actions', () => {
        let confirmDeleteOverlay;

        beforeEach(() => {
          confirmDeleteOverlay = crud.$.confirmDelete.$.dialog.$.overlay;
        });

        it('should save an edited item', () => {
          edit(crud.items[0]);
          crud._form._fields[0].value = 'baz';
          change(crud._form);
          btnSave.click();
          expect(crud.items[0].foo).to.be.equal('baz');
        });

        it('should save a new item', () => {
          crud.$.new.click();
          crud._form._fields[0].value = 'baz';
          change(crud._form);
          btnSave.click();
          expect(crud.items[1].foo).to.be.equal('baz');
        });

        it('should delete an item', async () => {
          edit(crud.items[0]);
          btnDelete.click();
          await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
          confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
          expect(crud.items.length).to.be.equal(0);
        });

        it('should notify size changes', (done) => {
          listenOnce(crud, 'size-changed', () => {
            expect(crud.size).to.be.equal(2);
            done();
          });
          crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
        });

        it('should notify editedItem changes', (done) => {
          listenOnce(crud, 'edited-item-changed', () => {
            expect(crud.editedItem).to.deep.equal({ foo: 'bar' });
            done();
          });
          edit(crud.items[0]);
        });

        it('should save a new pre-filled item', () => {
          crud.editedItem = { foo: 'baz' };
          crud._form._fields[0].value = 'baz';
          change(crud._form);
          btnSave.click();
          expect(crud.items[1].foo).to.be.equal('baz');
        });

        it('should not delete any item if item was not in items array', async () => {
          crud.editedItem = { foo: 'baz' };
          btnDelete.click();
          await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
          confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
          expect(crud.items.length).to.be.equal(1);
        });

        it('should highlight the edited item', () => {
          edit(crud.items[0]);
          expect(crud._grid.selectedItems).to.eql([crud.items[0]]);
        });

        it('should clear highlighting of the edited item after closing the editor', () => {
          edit(crud.items[0]);
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
          await aTimeout(0);
        });

        describe('cancel', () => {
          let confirmCancelDialog;
          let confirmCancelOverlay;

          beforeEach(() => {
            confirmCancelDialog = crud.$.confirmCancel;
            confirmCancelOverlay = confirmCancelDialog.$.dialog.$.overlay;
          });

          afterEach(() => {
            confirmCancelDialog.opened = false;
          });

          it('should not ask for confirmation on cancel when not modified', () => {
            edit(crud.items[0]);
            btnCancel.click();
            expect(confirmCancelDialog.opened).not.to.be.ok;
          });

          it('should not ask for confirmation on cancel when not modified - click out', () => {
            edit(crud.items[0]);
            crud.$.new.click();
            expect(confirmCancelDialog.opened).not.to.be.ok;
          });

          it('should not ask for confirmation on cancel when not modified - esc', () => {
            edit(crud.items[0]);
            editorDialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
            expect(confirmCancelDialog.opened).not.to.be.ok;
          });

          it('should ask for confirmation on cancel when modified', () => {
            edit(crud.items[0]);
            change(crud._form);
            btnCancel.click();
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should ask for confirmation on cancel when modified - click out', () => {
            edit(crud.items[0]);
            change(crud._form);
            crud.$.new.click();
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should ask for confirmation on cancel when modified - esc', () => {
            edit(crud.items[0]);
            change(crud._form);
            editorDialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should continue editing when closing confirmation with cancel', async () => {
            edit(crud.items[0]);
            change(crud._form);
            btnCancel.click();
            await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');
            confirmCancelOverlay.querySelector('[slot^="cancel"]').click();
            expect(confirmCancelDialog.opened).not.to.be.ok;
            expect(editorDialog.opened).to.be.true;
          });

          it('should cancel editing when closing confirmation with confirm', async () => {
            edit(crud.items[0]);
            change(crud._form);
            btnCancel.click();
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
            btnCancel.click();
            await aTimeout(0);
            expect(cancelSpyListener.calledOnce).to.be.ok;
          });

          it('should trigger "cancel" only once after user clicks out', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            crud.$.new.dispatchEvent(
              new CustomEvent('click', {
                bubbles: true,
                cancelable: true,
                composed: true
              })
            );

            await aTimeout(0);
            expect(cancelSpyListener.calledOnce).to.be.ok;
          });

          it('should trigger "cancel" only once after user hits esc', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            editorDialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
            await aTimeout(0);
            expect(cancelSpyListener.calledOnce).to.be.ok;
          });

          it('should not trigger "cancel" after user hits "Save"', async () => {
            crud.editOnClick = true;

            const cancelSpyListener = sinon.spy();
            crud.addEventListener('cancel', cancelSpyListener);

            crud._grid.activeItem = crud.items[0];
            edit(crud.items[0]);
            change(crud._form);
            btnSave.click();
            await aTimeout(0);
            expect(cancelSpyListener.notCalled).to.be.ok;
          });
        });

        describe('delete', () => {
          let confirmDeleteDialog;
          let confirmDeleteOverlay;

          beforeEach(() => {
            confirmDeleteDialog = crud.$.confirmDelete;
            confirmDeleteOverlay = confirmDeleteDialog.$.dialog.$.overlay;
          });

          it('should ask for confirmation on delete', () => {
            edit(crud.items[0]);
            btnDelete.click();
            expect(confirmDeleteDialog.opened).to.be.true;
          });

          it('should continue editing when closing confirmation with cancel', async () => {
            edit(crud.items[0]);
            btnDelete.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="cancel"]').click();
            expect(confirmDeleteDialog.opened).not.to.be.ok;
            expect(editorDialog.opened).to.be.true;
          });

          it('should delete when closing confirmation with confirm', async () => {
            edit(crud.items[0]);
            btnDelete.click();
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
          [btnSave, btnCancel, btnDelete] = crud.querySelectorAll('vaadin-button');
        });

        it('should configure dirty and new flags on new', () => {
          crud.$.new.click();
          expect(crud.__isDirty).not.to.be.true;
          expect(crud.__isNew).to.be.true;
        });

        it('should configure dirty and new flags on edit', () => {
          edit(crud.items[0]);
          expect(crud.__isDirty).not.to.be.true;
          expect(crud.__isNew).not.to.be.true;
        });

        it('should configure new flag when editedItem changed', async () => {
          crud.editedItem = crud.items[0];
          btnCancel.click();
          await nextRender(crud);
          expect(crud.__isNew).not.to.be.true;
        });

        it('should set dirty on editor changes', () => {
          edit(crud.items[0]);
          change(crud._form);
          expect(crud.__isDirty).to.be.true;
        });

        it('should hide delete button on new', async () => {
          crud.$.new.click();
          await nextRender(crud.$.dialog.$.overlay);
          expect(btnDelete.hasAttribute('hidden')).to.be.true;
        });

        it('should show delete button and disable save button on edit', async () => {
          edit(crud.items[0]);
          await nextRender(crud.$.dialog.$.overlay);
          expect(btnSave.hasAttribute('disabled')).to.be.true;
          expect(btnDelete.hasAttribute('hidden')).not.to.be.true;
        });

        ['change', 'input'].forEach((type) => {
          it('should enable save button on ' + type, async () => {
            edit(crud.items[0]);
            await nextRender(crud.$.dialog.$.overlay);
            crud._form.dispatchEvent(new Event(type, { bubbles: true }));
            expect(btnSave.hasAttribute('disabled')).not.to.be.true;
          });
        });

        describe('editor position', () => {
          let confirmCancelDialog;
          let confirmCancelOverlay;

          beforeEach(async () => {
            crud.editorPosition = 'bottom';
            crud.editOnClick = true;
            confirmCancelDialog = crud.$.confirmCancel;
            confirmCancelOverlay = confirmCancelDialog.$.dialog.$.overlay;
            await nextRender(crud);
            flushGrid(crud._grid);
            crud.set('items', [{ foo: 'bar' }, { foo: 'baz' }]);
          });

          afterEach(() => {
            confirmCancelDialog.opened = false;
          });

          it('should prevent changing edited items if dirty', () => {
            crud._grid.activeItem = crud.items[0];
            expect(crud.editorOpened).to.be.true;

            change(crud._form);
            crud._grid.activeItem = crud.items[1];
            expect(confirmCancelDialog.opened).to.be.true;
            expect(crud.editedItem).to.be.equal(crud.items[0]);
          });

          it('should prompt confirm if dirty and new button is clicked', () => {
            crud._grid.activeItem = crud.items[0];
            expect(crud.editorOpened).to.be.true;

            change(crud._form);
            crud.$.new.click();
            expect(confirmCancelDialog.opened).to.be.true;
          });

          it('should keep editor opened if dirty, new button is clicked and changes are discarded', async () => {
            crud._grid.activeItem = crud.items[0];
            expect(crud.editorOpened).to.be.true;

            change(crud._form);
            crud.$.new.click();
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
          await aTimeout(0);
        });

        describe('new', () => {
          it('should fire the new event', (done) => {
            listenOnce(crud, 'new', () => done());
            crud.$.new.click();
          });

          it('on new should set the item and open dialog if not default prevented', () => {
            expect(crud.editedItem).not.to.be.ok;
            crud.$.new.click();
            expect(crud.editedItem).to.be.ok;
            expect(crud.editorOpened).to.be.true;
          });

          it('on new should not set the item but open dialog if default prevented', () => {
            listenOnce(crud, 'new', (e) => e.preventDefault());
            crud.$.new.click();
            expect(crud.editedItem).not.to.be.ok;
            expect(crud.editorOpened).to.be.true;
          });
        });

        describe('edit', () => {
          it('should fire the edit event', (done) => {
            listenOnce(crud, 'edit', (e) => {
              expect(e.detail.item).to.be.equal(crud.items[0]);
              done();
            });
            edit(crud.items[0]);
          });

          it('should not fire the edit event over the same opened item', () => {
            const editListener = sinon.spy();
            crud.addEventListener('edit', editListener);
            edit(crud.items[0]);
            edit(crud.items[0]);
            expect(editListener.calledOnce).to.be.true;
          });

          it('on edit should set the item and open dialog if not default prevented', () => {
            edit(crud.items[0]);
            expect(crud.editedItem).to.be.equal(crud.items[0]);
            expect(crud.$.dialog.opened).to.be.true;
            expect(crud.editorOpened).to.be.true;
          });

          it('on edit should not set the item nor open dialog if default prevented', () => {
            listenOnce(crud, 'edit', (e) => e.preventDefault());
            edit(crud.items[0]);
            expect(crud.editedItem).not.to.be.ok;
          });
        });

        describe('save', () => {
          it('should fire the save event', (done) => {
            listenOnce(crud, 'save', (e) => {
              expect(e.detail.item).to.be.deep.equal(crud.items[0]);
              done();
            });
            edit(crud.items[0]);
            change(crud._form);
            btnSave.click();
          });

          it('on save should close dialog if not default prevented', () => {
            edit(crud.items[0]);
            change(crud._form);
            btnSave.click();
            expect(crud.editorOpened).not.to.be.ok;
          });

          it('on save should keep opened dialog if default prevented', () => {
            listenOnce(crud, 'save', (e) => e.preventDefault());
            edit(crud.items[0]);
            btnSave.click();
            expect(crud.editorOpened).to.be.true;
          });

          it('on save should keep item unmodified if default prevented', () => {
            listenOnce(crud, 'save', (e) => e.preventDefault());

            const originalItem = { ...crud.items[0] };
            edit(crud.items[0]);
            crud._fields[0].value = 'Modified';
            change(crud._form);
            btnSave.click();

            expect(crud.items[0]).to.be.deep.equal(originalItem);
          });

          it('on save should modify item if not default prevented', () => {
            const originalItem = { ...crud.items[0] };
            edit(crud.items[0]);
            crud._fields[0].value = 'Modified';
            change(crud._form);
            btnSave.click();

            expect(crud.items[0]).to.not.be.deep.equal(originalItem);
          });
        });

        describe('cancel', () => {
          it('should fire the cancel event', (done) => {
            listenOnce(crud, 'cancel', (e) => {
              expect(e.detail.item).to.be.equal(crud.items[0]);
              done();
            });
            edit(crud.items[0]);
            btnCancel.click();
          });

          it('on cancel should close dialog if not default prevented', () => {
            edit(crud.items[0]);
            btnCancel.click();
            expect(crud.$.dialog.opened).not.to.be.ok;
            expect(crud.editorOpened).not.to.be.ok;
          });

          it('on cancel should keep opened dialog if default prevented', () => {
            listenOnce(crud, 'cancel', (e) => e.preventDefault());
            edit(crud.items[0]);
            btnCancel.click();
            expect(crud.editorOpened).to.be.true;
          });
        });

        describe('delete', () => {
          let confirmDeleteDialog;
          let confirmDeleteOverlay;

          beforeEach(() => {
            confirmDeleteDialog = crud.$.confirmDelete;
            confirmDeleteOverlay = confirmDeleteDialog.$.dialog.$.overlay;
          });

          it('should fire the delete event', async () => {
            const item = crud.items[0];
            const spy = sinon.spy();
            crud.addEventListener('delete', spy);
            edit(item);
            btnDelete.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(spy.calledOnce).to.be.true;
            expect(spy.firstCall.args[0].detail.item).to.be.equal(item);
          });

          it('on delete should close dialog if not default prevented', async () => {
            edit(crud.items[0]);
            btnDelete.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(crud.editorOpened).not.to.be.ok;
          });

          it('on delete should keep opened dialog if default prevented', async () => {
            listenOnce(crud, 'delete', (e) => e.preventDefault());
            edit(crud.items[0]);
            btnDelete.click();
            await oneEvent(confirmDeleteOverlay, 'vaadin-overlay-open');
            confirmDeleteOverlay.querySelector('[slot^="confirm"]').click();
            expect(crud.editorOpened).to.be.true;
          });
        });
      });
    });
  });
});
