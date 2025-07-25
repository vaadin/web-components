import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { aTimeout, change, fire, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-crud.js';
import { capitalize, getProperty, setProperty } from '../src/vaadin-crud-helpers.js';
import { flushGrid, getBodyCellContent, getDialogEditor } from './helpers.js';

describe('crud', () => {
  let crud, btnSave;

  function edit(item) {
    fire(crud._grid, 'edit', { item });
  }

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

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
      await nextRender();
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
      expect(crud._newButton.textContent).to.be.equal('New item');
      crud.i18n = { newItem: 'Nueva entidad', editLabel: 'Editar entidad' };
      await nextRender();
      expect(crud._newButton.textContent).to.be.equal('Nueva entidad');
      expect(crud._grid.querySelector('vaadin-crud-edit-column').ariaLabel).to.be.equal('Editar entidad');
      expect(crud._grid.querySelector('vaadin-crud-edit').getAttribute('aria-label')).to.be.equal('Editar entidad');
    });

    it('should propagate theme to internal themable components', async () => {
      crud.setAttribute('theme', 'foo');
      await nextRender();
      [
        crud,
        crud._grid,
        crud._form,
        getDialogEditor(crud),
        getDialogEditor(crud).$.overlay,
        crud._confirmCancelDialog,
        crud._confirmDeleteDialog,
      ].forEach((e) => expect(e.getAttribute('theme')).to.be.match(/foo/u));
    });
  });

  describe('empty items', () => {
    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.include = 'foo';
      await nextRender();
      btnSave = crud.querySelector('[slot=save-button]');
    });

    it('should save a new item when list is empty but `include` is set', async () => {
      const spy = sinon.spy();
      crud.addEventListener('items-changed', spy);

      crud._newButton.click();
      await nextRender();

      crud._form._fields[0].value = 'baz';
      change(crud._form);
      btnSave.click();
      await nextRender();

      const event = spy.firstCall.args[0];
      expect(event.detail.value[0].foo).to.be.equal('baz');
      expect(crud.items[0].foo).to.be.equal('baz');
    });
  });

  describe('empty dataProvider', () => {
    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
    });

    it('should have an empty form if no item is present', async () => {
      crud.dataProvider = (_, callback) => callback([], 0);
      await nextRender();
      crud._newButton.click();
      await nextRender();
      expect(crud._form._fields).to.be.not.ok;
    });

    it('should have an empty form if no item is present', async () => {
      crud.dataProvider = (_, callback) => callback([], 0);
      await nextRender();
      crud._newButton.click();
      await nextRender();
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
        await nextRender();
        flushGrid(crud._grid);
        expect(getBodyCellContent(crud._grid, 0, 0).textContent).to.be.equal('bar');
      });

      it('should apply data provider when initializing with a custom grid', async () => {
        // Add a custom grid, set data provider, add CRUD to DOM
        crud.appendChild(customGrid);
        crud.dataProvider = (_, callback) => callback(items, items.length);
        document.body.appendChild(crud);

        // Verify item from data provider is rendered
        await nextRender();
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
        await nextRender();
        flushGrid(customGrid);
        expect(getBodyCellContent(customGrid, 0, 0).textContent).to.be.equal('bar');
      });
    });

    describe('create and edit', () => {
      let spy;

      beforeEach(async () => {
        crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
        crud.dataProvider = (_, callback) => callback(items, items.length);
        await nextRender();
        btnSave = crud.querySelector('[slot=save-button]');

        spy = sinon.spy();
        crud.addEventListener('save', spy);
      });

      it('should save a new item', async () => {
        crud._newButton.click();
        await nextRender();

        crud._form._fields[0].value = 'baz';
        change(crud._form);

        btnSave.click();
        await nextRender();

        const event = spy.firstCall.args[0];
        expect(event.detail.item.foo).to.be.equal('baz');
      });

      it('should save an edited item', async () => {
        edit(items[0]);
        await nextRender();

        crud._form._fields[0].value = 'baz';
        change(crud._form);

        btnSave.click();
        await nextRender();

        const event = spy.firstCall.args[0];
        expect(event.detail.item.foo).to.be.equal('baz');
      });
    });
  });

  describe('helpers', () => {
    it('should set nested properties to an object with setProperty', () => {
      const o = {};
      setProperty('a.b.c', 'd', o);
      expect(o.a.b.c).to.be.equal('d');
    });

    it('should get nested properties from an object with getProperty', () => {
      const o = { a: { b: { c: 'd' } } };
      expect(getProperty('a.b.c', o)).to.be.equal('d');
    });

    it('should capitalize string and remove non-letter characters', () => {
      expect(capitalize('-aa.bb cc-dd FF')).to.be.equal('Aa bb cc dd ff');
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
      await nextRender();
    });

    afterEach(async () => {
      crud.editorOpened = false;
      await aTimeout(0);
    });

    it('should not customize the grid without a proper slot', async () => {
      crud.appendChild(grid);
      await nextRender();
      crud.items = [1, 2];
      await nextRender();
      flushGrid(grid);
      expect(crud._grid).not.to.be.equal(grid);
    });

    it('should be able to provide a custom grid', async () => {
      grid.setAttribute('slot', 'grid');
      crud.appendChild(grid);
      await nextRender();
      crud.items = [1, 2];
      await nextRender();
      flushGrid(grid);
      expect(crud._grid).to.be.equal(grid);
      expect(getBodyCellContent(crud._grid, 0, 0).textContent).to.be.equal('1');
      expect(getBodyCellContent(crud._grid, 1, 0).textContent).to.be.equal('2');
    });

    it('should not customize the form without a proper slot', async () => {
      crud.appendChild(form);
      await nextRender();
      crud.items = [{ foo: 1 }];
      await nextRender();
      edit(crud.items[0]);
      await nextRender();
      expect(crud._form).not.to.be.equal(form);
    });

    it('should be able to provide a custom form', async () => {
      form.setAttribute('slot', 'form');
      crud.appendChild(form);
      await nextRender();
      crud.items = [{ foo: 'bar' }];
      await nextRender();
      edit(crud.items[0]);
      await nextRender();
      expect(crud._form).to.be.equal(form);
      expect(form.querySelector('vaadin-text-field').value).to.be.equal('bar');
    });

    it('should be able to provide a custom dataProvider', async () => {
      crud.dataProvider = (_, callback) => {
        callback([1, 2], 2);
      };

      await nextRender();
      expect(getBodyCellContent(crud._grid, 0, 0).textContent).to.be.equal('1');
      expect(getBodyCellContent(crud._grid, 1, 0).textContent).to.be.equal('2');
    });

    it('should not highlight the edited item', async () => {
      grid.setAttribute('slot', 'grid');
      crud.appendChild(grid);
      await nextRender();
      crud.items = [{ foo: 'bar' }];
      edit(crud.items[0]);
      await nextRender();
      expect(crud._grid.selectedItems).to.eql([]);
    });

    it('should not clear selection of a custom grid', async () => {
      grid.setAttribute('slot', 'grid');
      crud.appendChild(grid);
      await nextRender();
      crud.items = [{ foo: 'bar' }];
      grid.selectedItems = [crud.items[0]];

      edit(crud.items[0]);
      await nextRender();
      crud.editorOpened = false;
      expect(crud._grid.selectedItems).to.eql([crud.items[0]]);
    });

    it('should not propagate theme attribute to a custom grid', async () => {
      crud.setAttribute('theme', 'foo');
      crud.appendChild(grid);
      await nextRender();
      expect(grid.hasAttribute('theme')).to.be.false;
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
      await nextRender();
      crud.items = [{ foo: 1, bar: 2 }];
      await nextRender();
    });

    afterEach(() => {
      crud.editorOpened = false;
    });

    it('should be able to validate fields', async () => {
      edit(crud.items[0]);
      await nextRender();
      expect(crud.__validate()).to.be.true;

      crud.__fields[0].value = '';
      expect(crud.__validate()).to.be.false;

      crud.__fields[1].value = '1';
      crud.__fields[1].value = '';
      expect(crud.__validate()).to.be.false;
    });

    it('should not save if invalid', async () => {
      const spy = sinon.spy();
      crud.addEventListener('save', spy);

      edit(crud.items[0]);
      await nextRender();

      crud.__fields[1].value = '';

      crud.__save();
      await nextRender();
      expect(spy.called).to.be.false;
    });
  });

  describe('editor-position', () => {
    let crud;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      await nextRender();
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

    it('should hide toolbar when editor position is "bottom" and opened', () => {
      crud.editorPosition = 'bottom';
      crud._fullscreen = false;
      crud._newButton.click();
      expect(crud.$.toolbar.style.display).to.be.equal('none');
    });

    it('should show toolbar with default editor position and opened', async () => {
      crud._newButton.click();
      await nextRender();
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

    it('should always show the editor in dialog on mobile', async () => {
      crud._fullscreen = true;
      crud.editorPosition = 'bottom';
      crud._newButton.click();
      await nextRender();
      expect(crud._fullscreen).to.be.true;
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
      await nextRender();
      flushGrid(crud._grid);
      confirmCancelDialog = crud._confirmCancelDialog;
      confirmCancelOverlay = confirmCancelDialog.$.overlay;
    });

    function fakeClickOnRow(idx) {
      crud._grid.activeItem = crud.items[idx];
    }

    it('should not open editor on row click by default', () => {
      crud.editOnClick = false;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.not.ok;
    });

    it('should open editor on row click if edit-on-click is set', async () => {
      fakeClickOnRow(0);
      await nextRender();
      expect(crud.editorOpened).to.be.true;
    });

    it('should be able to open rows in sequence', async () => {
      fakeClickOnRow(0);
      await nextRender();
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[0]);
      fakeClickOnRow(1);
      await nextRender();
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

    it('should close editor after a second click on the same row', async () => {
      fakeClickOnRow(0);
      await nextRender();
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
      confirmCancelDialog.querySelector('[slot^="confirm"]').click();
      expect(crud.editorOpened).to.be.false;
    });

    it('should open same row again after item closed after click on "New"', async () => {
      crud._fullscreen = false;

      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      crud._newButton.click();
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
      crud._newButton.click();
      await oneEvent(confirmCancelOverlay, 'vaadin-overlay-open');
      confirmCancelDialog.querySelector('[slot^="confirm"]').click();
      expect(crud.editorOpened).to.be.true;
      await aTimeout(0);
      expect(crud._grid.activeItem).to.be.undefined;
      fakeClickOnRow(0);
      expect(crud.editorOpened).to.be.true;
      expect(crud.editedItem).to.be.equal(crud.items[0]);
    });
  });

  describe('exportparts', () => {
    let dialog;

    beforeEach(() => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      dialog = getDialogEditor(crud);
    });

    it('should export all editor dialog overlay parts for styling', () => {
      const parts = [...dialog.$.overlay.shadowRoot.querySelectorAll('[part]')].map((el) => el.getAttribute('part'));
      const dialogExportParts = dialog.getAttribute('exportparts').split(', ');
      const overlayExportParts = dialog.$.overlay.getAttribute('exportparts').split(', ');

      parts.forEach((part) => {
        expect(dialogExportParts).to.include(part);
        expect(overlayExportParts).to.include(part);
      });
    });
  });
});
