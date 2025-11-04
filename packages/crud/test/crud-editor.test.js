import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-crud.js';
import { flushGrid, getDialogEditor, getInlineEditor } from './helpers.js';

describe('crud editor', () => {
  let crud;

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  describe('header', () => {
    let header;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.items = [{ foo: 'bar' }];
      header = crud.querySelector(':scope > [slot=header]');
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

  describe('editor mode', () => {
    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.items = [{ foo: 'bar' }, { foo: 'baz' }];
      await nextRender();
      flushGrid(crud._grid);
    });

    function verifyDialogMode() {
      const inlineEditor = getInlineEditor(crud);
      const dialogEditor = getDialogEditor(crud);

      expect(inlineEditor).to.be.null;
      expect(dialogEditor).to.not.be.null;
      expect(dialogEditor.querySelector('slot[slot="header"][name="header"]')).to.not.be.null;
      expect(dialogEditor.querySelector('slot[slot="form"][name="form"]')).to.not.be.null;
      expect(dialogEditor.querySelector('slot[slot="save-button"][name="save-button"]')).to.not.be.null;
      expect(dialogEditor.querySelector('slot[slot="cancel-button"][name="cancel-button"]')).to.not.be.null;
      expect(dialogEditor.querySelector('slot[slot="delete-button"][name="delete-button"]')).to.not.be.null;
    }

    function verifyInlineMode() {
      const inlineEditor = getInlineEditor(crud);
      const dialogEditor = getDialogEditor(crud);

      expect(dialogEditor).to.be.null;
      expect(inlineEditor).to.not.be.null;
      expect(inlineEditor.querySelector('slot[name="header"]')).to.not.be.null;
      expect(inlineEditor.querySelector('slot[name="form"]')).to.not.be.null;
      expect(inlineEditor.querySelector('slot[name="save-button"]')).to.not.be.null;
      expect(inlineEditor.querySelector('slot[name="cancel-button"]')).to.not.be.null;
      expect(inlineEditor.querySelector('slot[name="delete-button"]')).to.not.be.null;
    }

    it('should use dialog mode by default', async () => {
      crud._newButton.click();
      await nextRender();

      verifyDialogMode();
    });

    ['aside', 'bottom'].forEach((position) => {
      it(`should use inline mode when editorPosition is set to ${position}`, async () => {
        crud.editorPosition = position;
        crud._newButton.click();
        await nextRender();

        verifyInlineMode();
      });
    });

    ['', 'aside', 'bottom'].forEach((position) => {
      it(`should use dialog mode on mobile when editorPosition is set to ${position || 'default'}`, async () => {
        crud.editorPosition = position;
        crud._fullscreen = true;
        crud._newButton.click();
        await nextRender();

        verifyDialogMode();
      });
    });

    it('should switch to inline mode while editing an item', async () => {
      crud._newButton.click();
      await nextRender();

      verifyDialogMode();
      expect(crud.editorOpened).to.be.true;

      crud.editorPosition = 'aside';
      await nextRender();

      verifyInlineMode();
      expect(crud.editorOpened).to.be.true;
    });

    it('should switch to editor mode while editing an item', async () => {
      crud.editorPosition = 'aside';
      crud._newButton.click();
      await nextRender();

      verifyInlineMode();
      expect(crud.editorOpened).to.be.true;

      crud.editorPosition = '';
      await nextRender();

      verifyDialogMode();
      expect(crud.editorOpened).to.be.true;
    });
  });
});
