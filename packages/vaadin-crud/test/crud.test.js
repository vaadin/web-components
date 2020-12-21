import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, getBodyCellContent, isIOS, listenOnce, nextRender } from './helpers.js';
import '../src/vaadin-crud.js';

describe('crud', () => {
  let crud;

  // Buttons in the editor dialog
  const change = () => crud._form.dispatchEvent(new Event('change', { bubbles: true }));
  const buttons = () => crud.$.dialog.$.dialog.$.overlay.shadowRoot.querySelectorAll('vaadin-button');
  const btnSave = () => buttons()[0];
  const btnCancel = () => buttons()[1];
  const btnDelete = () => buttons()[2];

  const editorHeader = () => crud.$.dialog.$.dialog.$.overlay.shadowRoot.querySelector('[slot=header]');

  // Buttons in confirm dialogs
  const btnConfDialog = (confirm, id) =>
    confirm.$.dialog.$.overlay.$.content.shadowRoot.querySelector(`vaadin-button#${id}`);

  const edit = (item) => crud._grid.dispatchEvent(new CustomEvent('edit', { detail: { item } }));

  describe('basic', () => {
    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
    });

    it('should not expose class name globally', () => {
      expect(window.CrudElement).not.to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(customElements.get('vaadin-crud').version).to.be.ok;
    });
  });

  describe('declarative', () => {
    beforeEach(async () => {
      crud = fixtureSync(`
        <vaadin-crud style="width: 300px;" items='[{"foo": "bar"}]' edited-item="{}">
          <div slot="footer">Footer content</div>
        </vaadin-crud>
      `);
      await nextRender(crud);
      flushGrid(crud._grid);
    });

    afterEach(() => {
      crud.editorOpened = false;
    });

    it('should be able to set items and item declaratively', () => {
      expect(crud._grid._columnTree.length).to.be.equal(1);
      expect(crud._form._fields.length).to.be.equal(1);
    });

    it('should have a column with editor buttons', () => {
      expect(crud._grid._columnTree[0].length).to.be.equal(2);
      expect(crud._grid._columnTree[0][1].localName).to.be.equal('vaadin-crud-edit-column');
    });

    it('should have a slot for footer content', () => {
      expect(crud.querySelector('[slot=footer]').textContent).to.be.equal('Footer content');
    });

    it('should open the new item editor if item is provided declarativelly', () => {
      expect(crud.editorOpened).to.be.true;
      expect(crud.__isNew).to.be.true;
    });

    it('should be able to internationalise via `i18n` property', async () => {
      expect(crud.$.new.textContent).to.be.equal('New item');
      crud.i18n = Object.assign({}, crud.i18n, { newItem: 'Nueva entidad', editLabel: 'Editar entidad' });
      await nextRender(crud._grid);
      expect(crud.$.new.textContent).to.be.equal('Nueva entidad');
      expect(crud._grid.querySelector('vaadin-crud-edit-column').ariaLabel).to.be.equal('Editar entidad');
      expect(crud._grid.querySelector('vaadin-crud-edit').getAttribute('aria-label')).to.be.equal('Editar entidad');
    });

    it('should propagate theme to internal themable components', () => {
      crud.setAttribute('theme', 'foo');
      [
        crud,
        crud._grid,
        crud._form,
        crud.$.dialog,
        crud.$.dialog.$.dialog,
        crud.$.confirmCancel,
        crud.$.confirmDelete
      ].forEach((e) => expect(e.getAttribute('theme')).to.be.match(/foo/));
    });
  });

  describe('empty items', () => {
    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.include = 'foo';
      await nextRender(crud);
    });

    it('should save a new item when list is empty but `include` is set', (done) => {
      listenOnce(crud, 'items-changed', () => {
        expect(crud.items[0].foo).to.be.equal('baz');
        done();
      });

      crud.$.new.click();
      crud._form._fields[0].value = 'baz';
      change();
      btnSave().click();
    });
  });

  describe('empty dataProvider', () => {
    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
    });

    it('should have an empty form if no item is present', async () => {
      crud.dataProvider = (_, callback) => callback([], 0);
      await nextRender(crud);
      crud.$.new.click();
      expect(crud._form._fields).to.be.not.ok;
    });

    it('should have an empty form if no item is present', async () => {
      crud.dataProvider = (_, callback) => callback([], 0);
      await nextRender(crud);
      crud.$.new.click();
      expect(crud._form._fields).to.be.not.ok;
    });
  });

  describe('items', () => {
    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.items = [{ foo: 'bar' }];
      await nextRender(crud._grid);
    });

    describe('editor header', () => {
      it('should have new item title', () => {
        crud.$.new.click();
        expect(editorHeader().textContent).to.be.equal('New item');
      });

      it('should have edit item title', () => {
        crud.editedItem = crud.items[0];
        expect(editorHeader().textContent).to.be.equal('Edit item');
      });

      it('should change to new item title', () => {
        crud.editedItem = crud.items[0];
        expect(editorHeader().textContent).to.be.equal('Edit item');
        crud.$.new.click();
        expect(editorHeader().textContent).to.be.equal('New item');
      });
    });

    describe('actions', () => {
      it('should save an edited item', () => {
        edit(crud.items[0]);
        crud._form._fields[0].value = 'baz';
        change();
        btnSave().click();
        expect(crud.items[0].foo).to.be.equal('baz');
      });

      it('should save a new item', () => {
        crud.$.new.click();
        crud._form._fields[0].value = 'baz';
        change();
        btnSave().click();
        expect(crud.items[1].foo).to.be.equal('baz');
      });

      it('should delete a item', () => {
        edit(crud.items[0]);
        btnDelete().click();
        btnConfDialog(crud.$.confirmDelete, 'confirm').click();
        expect(crud.items.length).to.be.equal(0);
      });

      it('should notify size changes', (done) => {
        listenOnce(crud, 'size-changed', () => {
          expect(crud.size).to.be.equal(2);
          done();
        });
        crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
      });

      it('should save a new pre-filled item', () => {
        crud.editedItem = { foo: 'baz' };
        crud._form._fields[0].value = 'baz';
        change();
        btnSave().click();
        expect(crud.items[1].foo).to.be.equal('baz');
      });

      it('should not delete any item if item was not in items array', () => {
        crud.editedItem = { foo: 'baz' };
        btnDelete().click();
        btnConfDialog(crud.$.confirmDelete, 'confirm').click();
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
      afterEach(async () => {
        crud.$.dialog.opened = crud.$.confirmCancel.opened = crud.$.confirmDelete.opened = false;
        await aTimeout(0);
      });

      describe('cancel', () => {
        it('should not ask for confirmation on cancel when not modified', () => {
          edit(crud.items[0]);
          btnCancel().click();
          expect(crud.$.confirmCancel.opened).not.to.be.ok;
        });

        it('should not ask for confirmation on cancel when not modified - click out', () => {
          edit(crud.items[0]);
          crud.$.new.click();
          expect(crud.$.confirmCancel.opened).not.to.be.ok;
        });

        it('should not ask for confirmation on cancel when not modified - esc', () => {
          edit(crud.items[0]);
          crud.$.dialog.$.dialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
          expect(crud.$.confirmCancel.opened).not.to.be.ok;
        });

        it('should ask for confirmation on cancel when modified', () => {
          edit(crud.items[0]);
          change();
          btnCancel().click();
          expect(crud.$.confirmCancel.opened).to.be.true;
        });

        it('should ask for confirmation on cancel when modified - click out', () => {
          edit(crud.items[0]);
          change();
          crud.$.new.click();
          expect(crud.$.confirmCancel.opened).to.be.true;
        });

        it('should ask for confirmation on cancel when modified - esc', () => {
          edit(crud.items[0]);
          change();
          crud.$.dialog.$.dialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
          expect(crud.$.confirmCancel.opened).to.be.true;
        });

        it('should continue editing when closing confirmation with confirm', () => {
          edit(crud.items[0]);
          change();
          btnCancel().click();
          btnConfDialog(crud.$.confirmCancel, 'cancel').click();
          expect(crud.$.confirmCancel.opened).not.to.be.ok;
          expect(crud.$.dialog.opened).to.be.true;
        });

        it('should cancel editing when closing confirmation with reject', () => {
          edit(crud.items[0]);
          change();
          btnCancel().click();
          btnConfDialog(crud.$.confirmCancel, 'confirm').click();
          expect(crud.$.confirmCancel.opened).not.to.be.ok;
          expect(crud.$.dialog.opened).not.to.be.ok;
        });

        it('should trigger "cancel" only once after user hits "Cancel"', async () => {
          crud.editOnClick = true;

          const cancelSpyListener = sinon.spy();
          crud.addEventListener('cancel', cancelSpyListener);

          crud._grid.activeItem = crud.items[0];
          btnCancel().click();
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
          crud.$.dialog.$.dialog.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-escape-press'));
          await aTimeout(0);
          expect(cancelSpyListener.calledOnce).to.be.ok;
        });

        it('should not trigger "cancel" after user hits "Save"', async () => {
          crud.editOnClick = true;

          const cancelSpyListener = sinon.spy();
          crud.addEventListener('cancel', cancelSpyListener);

          crud._grid.activeItem = crud.items[0];
          edit(crud.items[0]);
          change();
          btnSave().click();
          await aTimeout(0);
          expect(cancelSpyListener.notCalled).to.be.ok;
        });
      });

      describe('delete', () => {
        it('should ask for confirmation on delete', () => {
          edit(crud.items[0]);
          btnDelete().click();
          expect(crud.$.confirmDelete.opened).to.be.true;
        });

        it('should continue editing when closing confirmation with cancel', () => {
          edit(crud.items[0]);
          btnDelete().click();
          btnConfDialog(crud.$.confirmDelete, 'cancel').click();
          expect(crud.$.confirmDelete.opened).not.to.be.ok;
          expect(crud.$.dialog.opened).to.be.true;
        });

        it('should delete when closing confirmation with confirm', () => {
          edit(crud.items[0]);
          btnDelete().click();
          btnConfDialog(crud.$.confirmDelete, 'confirm').click();
          expect(crud.$.confirmDelete.opened).not.to.be.ok;
          expect(crud.$.dialog.opened).not.to.be.ok;
        });
      });
    });

    describe('flags', () => {
      afterEach(async () => {
        crud.$.dialog.opened = false;
        await aTimeout(0);
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

      it('should set dirty on editor changes', () => {
        edit(crud.items[0]);
        change();
        expect(crud.__isDirty).to.be.true;
      });

      it('should hide delete button on new', async () => {
        crud.$.new.click();
        await nextRender(crud.$.dialog.$.overlay);
        expect(btnDelete().hasAttribute('hidden')).to.be.true;
      });

      it('should show delete button and disable save button on edit', async () => {
        edit(crud.items[0]);
        await nextRender(crud.$.dialog.$.overlay);
        expect(btnSave().hasAttribute('disabled')).to.be.true;
        expect(btnDelete().hasAttribute('hidden')).not.to.be.true;
      });

      ['change', 'input'].forEach((type) => {
        it('should enable save button on ' + type, async () => {
          edit(crud.items[0]);
          await nextRender(crud.$.dialog.$.overlay);
          crud._form.dispatchEvent(new Event(type, { bubbles: true }));
          expect(btnSave().hasAttribute('disabled')).not.to.be.true;
        });
      });

      describe('editor position', () => {
        beforeEach(async () => {
          crud.editorPosition = 'bottom';
          crud.editOnClick = true;
          await nextRender(crud);
          flushGrid(crud._grid);
          crud.set('items', [{ foo: 'bar' }, { foo: 'baz' }]);
        });

        it('should prevent changing edited items if dirty', () => {
          crud._grid.activeItem = crud.items[0];
          expect(crud.editorOpened).to.be.true;

          change();
          crud._grid.activeItem = crud.items[1];
          expect(crud.$.confirmCancel.opened).to.be.true;
          expect(crud.editedItem).to.be.equal(crud.items[0]);
        });

        it('should prompt confirm if dirty and new button is clicked', () => {
          crud._grid.activeItem = crud.items[0];
          expect(crud.editorOpened).to.be.true;

          change();
          crud.$.new.click();
          expect(crud.$.confirmCancel.opened).to.be.true;
        });

        it('should keep editor opened if dirty, new button is clicked and changes are discarded', () => {
          crud._grid.activeItem = crud.items[0];
          expect(crud.editorOpened).to.be.true;

          change();
          crud.$.new.click();
          expect(crud.$.confirmCancel.opened).to.be.true;

          btnConfDialog(crud.$.confirmCancel, 'confirm').click();
          expect(crud.editorOpened).to.be.true;
        });

        it('should change edited items if dirty when user discard changes', () => {
          crud._grid.activeItem = crud.items[0];
          change();

          crud._grid.activeItem = crud.items[1];
          expect(crud.$.confirmCancel.opened).to.be.true;

          btnConfDialog(crud.$.confirmCancel, 'confirm').click();
          expect(crud.editedItem).to.be.equal(crud.items[1]);
        });
      });
    });

    describe('events', () => {
      afterEach(async () => {
        crud.$.dialog.opened = false;
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
          expect(crud.$.dialog.opened).to.be.true;
        });

        it('on new should not set the item but open dialog if default prevented', () => {
          listenOnce(crud, 'new', (e) => e.preventDefault());
          crud.$.new.click();
          expect(crud.editedItem).not.to.be.ok;
          expect(crud.$.dialog.opened).to.be.true;
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
          change();
          btnSave().click();
        });

        it('on save should close dialog if not default prevented', () => {
          edit(crud.items[0]);
          change();
          btnSave().click();
          expect(crud.$.dialog.opened).not.to.be.ok;
        });

        it('on save should keep opened dialog if default prevented', () => {
          listenOnce(crud, 'save', (e) => e.preventDefault());
          edit(crud.items[0]);
          btnSave().click();
          expect(crud.$.dialog.opened).to.be.true;
        });

        it('on save should keep item unmodified if default prevented', () => {
          listenOnce(crud, 'save', (e) => e.preventDefault());

          const originalItem = Object.assign({}, crud.items[0]);
          edit(crud.items[0]);
          crud._fields[0].value = 'Modified';
          change();
          btnSave().click();

          expect(crud.items[0]).to.be.deep.equal(originalItem);
        });

        it('on save should modify item if not default prevented', () => {
          const originalItem = Object.assign({}, crud.items[0]);
          edit(crud.items[0]);
          crud._fields[0].value = 'Modified';
          change();
          btnSave().click();

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
          btnCancel().click();
        });

        it('on cancel should close dialog if not default prevented', () => {
          edit(crud.items[0]);
          btnCancel().click();
          expect(crud.$.dialog.opened).not.to.be.ok;
          expect(crud.editorOpened).not.to.be.ok;
        });

        it('on cancel should keep opened dialog if default prevented', () => {
          listenOnce(crud, 'cancel', (e) => e.preventDefault());
          edit(crud.items[0]);
          btnCancel().click();
          expect(crud.$.dialog.opened).to.be.true;
        });
      });

      describe('delete', () => {
        it('should fire the delete event', (done) => {
          listenOnce(crud, 'delete', (e) => {
            expect(e.detail.item).to.be.equal(crud.items[0]);
            done();
          });
          edit(crud.items[0]);
          btnDelete().click();
          btnConfDialog(crud.$.confirmDelete, 'confirm').click();
        });

        it('on delete should close dialog if not default prevented', () => {
          edit(crud.items[0]);
          btnDelete().click();
          btnConfDialog(crud.$.confirmDelete, 'confirm').click();
          expect(crud.$.dialog.opened).not.to.be.ok;
        });

        it('on delete should keep opened dialog if default prevented', () => {
          listenOnce(crud, 'delete', (e) => e.preventDefault());
          edit(crud.items[0]);
          btnDelete().click();
          btnConfDialog(crud.$.confirmDelete, 'confirm').click();
          expect(crud.$.dialog.opened).to.be.true;
        });
      });
    });
  });

  describe('objects', () => {
    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
    });

    it('should be possible to set nested properties to an object', () => {
      const o = {};
      crud.__set('a.b.c', 'd', o);
      expect(o.a.b.c).to.be.equal('d');
    });

    it('should be possible to get nested properties to an object', () => {
      const o = { a: { b: { c: 'd' } } };
      expect(crud.get('a.b.c', o)).to.be.equal('d');
    });
  });

  describe('custom', () => {
    let grid, form;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column><template>[[item]]</template></vaadin-grid-column>
        </vaadin-grid>
      `);
      form = fixtureSync(`
        <vaadin-form-layout>
          <head>Foo Editor</head>
          <vaadin-text-field path="foo" required></vaadin-text-field>
          <input type="number" path="bar" required>
        </vaadin-form-layout>
      `);
      await nextRender(grid);
    });

    afterEach(async () => {
      crud.$.dialog.opened = false;
      await aTimeout(0);
    });

    it('should not customize the grid without a proper slot', async () => {
      crud.appendChild(grid);
      crud._observer.flush();
      crud.items = [1, 2];
      await nextRender(crud);
      flushGrid(grid);
      expect(crud._grid).not.to.be.equal(grid);
    });

    it('should be able to provide a custom grid', async () => {
      grid.setAttribute('slot', 'grid');
      crud.appendChild(grid);
      crud._observer.flush();
      crud.items = [1, 2];
      await nextRender(crud);
      flushGrid(grid);
      expect(crud._grid).to.be.equal(grid);
      expect(getBodyCellContent(crud._grid, 0, 0).textContent).to.be.equal('1');
      expect(getBodyCellContent(crud._grid, 1, 0).textContent).to.be.equal('2');
    });

    it('should not customize the form without a proper slot', async () => {
      crud.appendChild(form);
      crud._observer.flush();
      crud.items = [{ foo: 1 }];
      await nextRender(crud);
      edit(crud.items[0]);
      await nextRender(crud.$.dialog);
      expect(crud._form).not.to.be.equal(form);
    });

    it('should be able to provide a custom form', async () => {
      form.setAttribute('slot', 'form');
      crud.appendChild(form);
      crud._observer.flush();
      crud.items = [{ foo: 'bar' }];
      await nextRender(crud);
      edit(crud.items[0]);
      await nextRender(crud.$.dialog);
      expect(crud._form).to.be.equal(form);
      expect(form.querySelector('vaadin-text-field').value).to.be.equal('bar');
    });

    it('should be able to provide a custom dataProvider', async () => {
      crud.dataProvider = (_, callback) => {
        callback([1, 2], 2);
      };

      await nextRender(crud);
      expect(getBodyCellContent(crud._grid, 0, 0).textContent).to.be.equal('1');
      expect(getBodyCellContent(crud._grid, 1, 0).textContent).to.be.equal('2');
    });

    it('should not highlight the edited item', () => {
      grid.setAttribute('slot', 'grid');
      crud.appendChild(grid);
      crud._observer.flush();
      crud.items = [{ foo: 'bar' }];
      edit(crud.items[0]);
      expect(crud._grid.selectedItems).to.eql([]);
    });

    it('should not clear selection of a custom grid', () => {
      grid.setAttribute('slot', 'grid');
      crud.appendChild(grid);
      crud._observer.flush();
      crud.items = [{ foo: 'bar' }];
      grid.selectedItems = [crud.items[0]];

      edit(crud.items[0]);
      crud.editorOpened = false;
      expect(crud._grid.selectedItems).to.eql([crud.items[0]]);
    });
  });

  describe('validation', () => {
    let form;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      form = fixtureSync(`
        <vaadin-form-layout>
          <head>Foo Editor</head>
          <vaadin-text-field path="foo" required></vaadin-text-field>
          <input type="number" path="bar" required>
        </vaadin-form-layout>
      `);
      form.setAttribute('slot', 'form');
      crud.appendChild(form);
      crud._observer.flush();
      crud.items = [{ foo: 1, bar: 2 }];
      await nextRender(crud);
    });

    afterEach(() => {
      crud.editorOpened = false;
    });

    it('should be able to validate fields', () => {
      edit(crud.items[0]);
      expect(crud.__validate()).to.be.true;

      crud.__fields[0].value = '';
      expect(crud.__validate()).to.be.false;

      crud.__fields[1].value = '1';
      crud.__fields[1].value = '';
      expect(crud.__validate()).to.be.false;
    });

    it('should not save if invalid', () => {
      edit(crud.items[0]);
      crud.__fields[1].value = '';

      listenOnce(crud, 'save', () => {
        throw Error('Error save event thrown in an invalid form');
      });

      crud.__save();
    });
  });

  describe('editor-position', () => {
    let crud, dialogLayout;

    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      dialogLayout = crud.$.dialog;
    });

    afterEach(() => {
      crud.editorOpened = false;
    });

    it('should have empty string as default', () => {
      expect(crud.editorPosition).to.be.equal('');
    });

    it('should fallback to empty string if invalid value is inserted', () => {
      crud.editorPosition = 'invalid-value';
      expect(crud.editorPosition).to.be.equal('');
    });

    it('should accept "bottom" and "aside" as valid values', () => {
      crud.editorPosition = 'bottom';
      expect(crud.editorPosition).to.be.equal('bottom');
      crud.editorPosition = 'aside';
      expect(crud.editorPosition).to.be.equal('aside');
    });

    (isIOS ? it.skip : it)('should hide toolbar when editor position is "bottom" and opened', () => {
      crud.editorPosition = 'bottom';
      crud.__mobile = false;
      crud.$.new.click();
      expect(crud.$.toolbar.style.display).to.be.equal('none');
    });

    it('should show toolbar with default editor position and opened', () => {
      crud.$.new.click();

      expect(crud.$.toolbar.style.display).to.be.not.equal('none');
    });

    it('should always show the editor in dialog on mobile', () => {
      if (isIOS) {
        // Only setting crud.__mobile = true is not working on iOS test
        crud.__mobileMediaQuery = '(max-width: 1000px), (max-height: 1000px)';
      }
      crud.__mobile = true;
      crud.editorPosition = 'bottom';
      crud.$.new.click();

      expect(crud.__mobile).to.be.true;
    });

    (isIOS ? it.skip : it)('should not open dialog on desktop if not in default editor position', () => {
      crud.editorPosition = 'bottom';
      crud.__mobile = false;
      crud.$.new.click();
      expect(dialogLayout.$.dialog.opened).to.be.false;
    });

    (isIOS ? it.skip : it)('should switch from overlay to below grid if resize happens', () => {
      crud.editorPosition = 'bottom';
      crud.__mobile = true;
      crud.$.new.click();
      expect(dialogLayout.$.dialog.opened).to.be.true;
      crud.__mobile = false;
      expect(dialogLayout.$.dialog.opened).to.be.false;
    });
  });

  describe('edit-on-click', () => {
    let crud;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.editorPosition = 'bottom';
      crud.editOnClick = true;
      crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
      await nextRender(crud);
      flushGrid(crud._grid);
    });

    function fakeClickOnRow(idx) {
      crud._grid.activeItem = crud.items[idx];
    }

    it('should not open editor on row click by default', () => {
      crud.editOnClick = false;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.false;
    });

    it('should open editor on row click if edit-on-click is set', () => {
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
    });

    it('should be able to open rows in sequence', () => {
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[0]);
      fakeClickOnRow(1);
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[1]);
    });

    it('should show edit column by default', () => {
      crud.editOnClick = false; // Default
      expect(crud._grid.querySelector('vaadin-crud-edit-column')).to.be.not.null;
    });

    it('should hide edit column if edit-on-click is set', () => {
      expect(crud._grid.querySelector('vaadin-crud-edit-column')).to.be.null;
    });

    it('should close editor after a second click on the same row', () => {
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud._grid.activeItem = null; // A second click will set grid active item to null
      expect(crud.editorOpened).to.be.false;
    });

    it('should close editor after a second click on the same row after dirty editor is discarded', () => {
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud.__isDirty = true;
      crud._grid.activeItem = null; // A second click will set grid active item to null
      btnConfDialog(crud.$.confirmCancel, 'confirm').click();
      expect(crud.editorOpened).to.be.false;
    });

    it('should open same row again after item closed after click on "New"', async () => {
      crud.__mobile = false;

      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud.$.new.click();
      await aTimeout(0);
      expect(crud.editorOpened).to.be.true;
      await aTimeout(0);
      expect(crud._grid.activeItem).to.be.undefined;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[0]);
    });

    it('should open same row again after item was discarded after click on "New"', async () => {
      crud.__mobile = false;

      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud.__isDirty = true;
      crud.$.new.click();
      await aTimeout(0);
      expect(crud.$.confirmCancel.opened).to.be.true;
      btnConfDialog(crud.$.confirmCancel, 'confirm').click();
      expect(crud.editorOpened).to.be.true;
      await aTimeout(0);
      expect(crud._grid.activeItem).to.be.undefined;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[0]);
    });
  });
});
