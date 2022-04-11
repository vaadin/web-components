import { expect } from '@esm-bundle/chai';
import { aTimeout, change, fire, fixtureSync, isIOS, listenOnce, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-crud.js';
import { flushGrid, getBodyCellContent } from './helpers.js';

describe('crud', () => {
  let crud, btnSave;

  function edit(item) {
    fire(crud._grid, 'edit', { item });
  }

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      tagName = crud.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('declarative', () => {
    beforeEach(async () => {
      crud = fixtureSync(`
        <vaadin-crud style="width: 300px;" items='[{"foo": "bar"}]' edited-item="{}"></vaadin-crud>
      `);
      await nextRender(crud);
      flushGrid(crud._grid);
    });

    afterEach(() => {
      crud.editorOpened = false;
    });

    it('should be able to set items and item declaratively', () => {
      expect(crud._grid._columnTree.length).to.be.equal(2);
      expect(crud._form._fields.length).to.be.equal(1);
    });

    it('should have a column with editor buttons', () => {
      expect(crud._grid._columnTree[0].length).to.be.equal(2);
      expect(crud._grid._columnTree[0][1].localName).to.be.equal('vaadin-crud-edit-column');
    });

    it('should open the new item editor if item is provided declaratively', () => {
      expect(crud.editorOpened).to.be.true;
      expect(crud.__isNew).to.be.true;
    });

    it('should be able to internationalize via `i18n` property', async () => {
      expect(crud.$.new.textContent).to.be.equal('New item');
      crud.i18n = { ...crud.i18n, newItem: 'Nueva entidad', editLabel: 'Editar entidad' };
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
        crud.$.dialog.$.overlay,
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
      btnSave = crud.querySelector('[slot=save-button]');
    });

    it('should save a new item when list is empty but `include` is set', (done) => {
      listenOnce(crud, 'items-changed', () => {
        expect(crud.items[0].foo).to.be.equal('baz');
        done();
      });

      crud.$.new.click();
      crud._form._fields[0].value = 'baz';
      change(crud._form);
      btnSave.click();
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

  describe('dataProvider', () => {
    const items = [{ foo: 'bar' }];

    describe('passing to grid', () => {
      let customGrid;

      beforeEach(() => {
        crud = document.createElement('vaadin-crud');
        customGrid = fixtureSync(`
          <vaadin-grid>
            <vaadin-grid-column path="foo"></vaadin-grid-column>
          </vaadin-grid>
        `);
        customGrid.setAttribute('slot', 'grid');
      });

      afterEach(() => {
        crud.remove();
      });

      it('should apply data provider when setting data provider before initializing the grid', async () => {
        // Set data provider before `ready` is called, which means the grid is not initialized yet
        crud.dataProvider = (_, callback) => callback(items, items.length);
        // This should initialize the grid and pass the data provider
        document.body.appendChild(crud);
        // Verify item from data provider is rendered
        await nextRender(crud);
        flushGrid(crud._grid);
        expect(getBodyCellContent(crud._grid, 0, 0).textContent).to.be.equal('bar');
      });

      it('should apply data provider when initializing with a custom grid', async () => {
        // Add a custom grid, set data provider, add CRUD to DOM
        crud.appendChild(customGrid);
        crud.dataProvider = (_, callback) => callback(items, items.length);
        document.body.appendChild(crud);

        // Verify item from data provider is rendered
        await nextRender(crud);
        flushGrid(customGrid);
        expect(getBodyCellContent(customGrid, 0, 0).textContent).to.be.equal('bar');
      });

      it('should apply data provider when replacing the grid', async () => {
        document.body.appendChild(crud);
        // Set data provider
        crud.dataProvider = (_, callback) => callback(items, items.length);
        // Replace default grid with custom one after setting the data provider
        crud.appendChild(customGrid);
        // Verify item from data provider is rendered
        await nextRender(crud);
        flushGrid(customGrid);
        expect(getBodyCellContent(customGrid, 0, 0).textContent).to.be.equal('bar');
      });
    });

    describe('create and edit', () => {
      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
        crud.dataProvider = (_, callback) => callback(items, items.length);
        await nextRender(crud);
        btnSave = crud.querySelector('[slot=save-button]');
      });

      it('should save a new item', (done) => {
        listenOnce(crud, 'save', (e) => {
          expect(e.detail.item.foo).to.be.equal('baz');
          done();
        });
        crud.$.new.click();
        crud._form._fields[0].value = 'baz';
        change(crud._form);
        btnSave.click();
        expect(crud.editedItem.foo).to.be.equal('baz');
      });

      it('should save an edited item', (done) => {
        listenOnce(crud, 'save', (e) => {
          expect(e.detail.item.foo).to.be.equal('baz');
          done();
        });
        edit(items[0]);
        crud._form._fields[0].value = 'baz';
        change(crud._form);
        btnSave.click();
        expect(crud.editedItem.foo).to.be.equal('baz');
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
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      form = fixtureSync(`
        <vaadin-form-layout>
          <head>Foo Editor</head>
          <vaadin-text-field path="foo" required></vaadin-text-field>
          <input type="number" path="bar" required>
        </vaadin-form-layout>
      `);
      grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
        root.textContent = model.item;
      };
      await nextRender(grid);
    });

    afterEach(async () => {
      crud.editorOpened = false;
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
    let crud, editorDialog;

    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      editorDialog = crud.$.dialog;
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

    (isIOS ? it.skip : it)('should hide toolbar when editor position is "bottom" and opened', async () => {
      crud.editorPosition = 'bottom';
      crud._fullscreen = false;
      crud.$.new.click();
      await oneEvent(crud, 'editor-opened-changed');
      expect(crud.$.toolbar.style.display).to.be.equal('none');
    });

    it('should show toolbar with default editor position and opened', () => {
      crud.$.new.click();

      expect(crud.$.toolbar.style.display).to.be.not.equal('none');
    });

    it('should have no-toolbar attribute when property set to true', () => {
      crud.noToolbar = true;
      expect(crud.hasAttribute('no-toolbar')).to.be.equal(true);
    });

    it('should remove no-toolbar attribute when set to false on propery', () => {
      crud.noToolbar = true;
      crud.noToolbar = false;
      expect(crud.hasAttribute('no-toolbar')).to.be.equal(false);
    });

    it('should hide toolbar when no-toolbar attribute is set', () => {
      crud.noToolbar = true;
      expect(getComputedStyle(crud.$.toolbar).display).to.be.equal('none');
    });

    it('should always show the editor in dialog on mobile', () => {
      if (isIOS) {
        // Only setting crud._fullscreen = true is not working on iOS test
        crud._fullscreenMediaQuery = '(max-width: 1000px), (max-height: 1000px)';
      }
      crud._fullscreen = true;
      crud.editorPosition = 'bottom';
      crud.$.new.click();

      expect(crud._fullscreen).to.be.true;
    });

    (isIOS ? it.skip : it)('should not open dialog on desktop if not in default editor position', () => {
      crud.editorPosition = 'bottom';
      crud._fullscreen = false;
      crud.$.new.click();
      expect(editorDialog.opened).to.be.false;
    });

    (isIOS ? it.skip : it)('should switch from overlay to below grid if resize happens', async () => {
      crud.editorPosition = 'bottom';
      crud._fullscreen = true;
      crud.$.new.click();
      await oneEvent(crud, 'editor-opened-changed');
      expect(editorDialog.opened).to.be.true;
      crud._fullscreen = false;
      expect(editorDialog.opened).to.be.false;
    });
  });

  describe('edit-on-click', () => {
    let crud;
    let confirmCancelDialog;
    let confirmCancelOverlay;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.editorPosition = 'bottom';
      crud.editOnClick = true;
      crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
      await nextRender(crud);
      flushGrid(crud._grid);
      confirmCancelDialog = crud.$.confirmCancel;
      confirmCancelOverlay = confirmCancelDialog.$.dialog.$.overlay;
    });

    function fakeClickOnRow(idx) {
      crud._grid.activeItem = crud.items[idx];
    }

    it('should not open editor on row click by default', () => {
      crud.editOnClick = false;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.not.ok;
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

    it('should close editor after a second click on the same row after dirty editor is discarded', async () => {
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud.__isDirty = true;
      crud._grid.activeItem = null; // A second click will set grid active item to null
      await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');
      confirmCancelOverlay.querySelector('[slot^="confirm"]').click();
      expect(crud.editorOpened).to.be.false;
    });

    it('should open same row again after item closed after click on "New"', async () => {
      crud._fullscreen = false;

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
      crud._fullscreen = false;

      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud.__isDirty = true;
      crud.$.new.click();
      await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');
      confirmCancelOverlay.querySelector('[slot^="confirm"]').click();
      expect(crud.editorOpened).to.be.true;
      await aTimeout(0);
      expect(crud._grid.activeItem).to.be.undefined;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[0]);
    });
  });
});
