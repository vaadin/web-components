import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout, isDesktopSafari, isFirefox, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { createImage } from './helpers.js';

describe('toolbar controls', () => {
  let rte, editor, btn;

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  const getButton = (fmt) => rte.shadowRoot.querySelector(`[part~="toolbar-button-${fmt}"]`);

  beforeEach(async () => {
    rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    await nextRender();
    editor = rte._editor;
  });

  describe('selected text', () => {
    beforeEach(async () => {
      editor.focus();
      editor.insertText(0, 'Foo', 'user');
      editor.setSelection(0, 3);
      await nextRender(rte);
    });

    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'].forEach((fmt) => {
      it(`should apply ${fmt} formatting to the selected text on click`, () => {
        btn = getButton(fmt);
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        focusout(editor.root);
        document.body.focus();
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        btn.click();
        expect(editor.getFormat(0, 3)[fmt]).to.be.true;
      });
    });
  });

  describe('formatting', () => {
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'].forEach((fmt) => {
      it(`should apply ${fmt} formatting when clicking the "toolbar-button-${fmt}" part`, () => {
        btn = getButton(fmt);
        btn.click();
        editor.insertText(0, 'Foo', 'user');
        expect(editor.getFormat(0, 2)[fmt]).to.be.true;
      });

      it(`should undo ${fmt} formatting when clicking the "toolbar-button-${fmt}" part`, () => {
        btn = getButton(fmt);
        editor.format(fmt, true);
        btn.click();
        expect(editor.getFormat(0)).to.deep.equal({});
      });
    });

    ['sub', 'super'].forEach((scr) => {
      it(`should apply ${scr}script when clicking the "toolbar-button-${scr}script" part`, () => {
        btn = getButton(`${scr}script`);
        btn.click();
        editor.insertText(0, 'Foo', 'user');
        expect(editor.getFormat(0, 2).script).to.be.equal(scr);
      });

      it(`should undo ${scr}script when clicking the "toolbar-button-${scr}script" part`, () => {
        btn = getButton(`${scr}script`);
        editor.format('script', scr);
        btn.click();
        expect(editor.getFormat(0)).to.deep.equal({});
      });
    });

    ['ordered', 'bullet'].forEach((type) => {
      it(`should create ${type} list when clicking the "toolbar-button-list-${type}" part`, () => {
        btn = getButton(`list-${type}`);

        btn.click();
        expect(editor.getFormat(0).list).to.be.equal(type);

        btn.click();
        expect(editor.getFormat(0).list).to.be.not.ok;
      });
    });

    [1, 2].forEach((level) => {
      it(`should create <h${level}> header when clicking the "toolbar-button-h${level}" part`, () => {
        btn = getButton(`h${level}`);

        btn.click();
        expect(editor.getFormat(0).header).to.be.equal(level);

        btn.click();
        expect(editor.getFormat(0).header).to.be.not.ok;
      });
    });

    ['center', 'right'].forEach((align) => {
      it(`should apply ${align} alignment when clicking the "toolbar-button-align-${align}" part`, () => {
        btn = getButton(`align-${align}`);

        btn.click();
        expect(editor.getFormat(0).align).to.be.equal(align);

        btn = getButton('align-left');
        btn.click();
        expect(editor.getFormat(0).align).to.be.not.ok;
      });
    });

    describe('RTL', () => {
      beforeEach(() => rte.setAttribute('dir', 'rtl'));

      after(() => rte.removeAttribute('dir'));

      ['center', 'left'].forEach((align) => {
        it(`should apply ${align} alignment when clicking the "toolbar-button-align-${align}" part in RTL`, () => {
          btn = getButton(`align-${align}`);

          btn.click();
          expect(editor.getFormat(0).align).to.be.equal(align);

          btn = getButton('align-right');
          btn.click();
          expect(editor.getFormat(0).align).to.be.not.ok;
        });
      });
    });

    describe('RTL set initially', () => {
      beforeEach(async () => {
        rte = fixtureSync('<vaadin-rich-text-editor dir="rtl"></vaadin-rich-text-editor>');
        await nextRender();
        editor = rte._editor;
      });

      ['center', 'left'].forEach((align) => {
        it(`should apply ${align} alignment when clicking the "toolbar-button-align-${align}" part in RTL`, () => {
          btn = getButton(`align-${align}`);

          btn.click();
          expect(editor.getFormat(0).align).to.be.equal(align);

          btn = getButton('align-right');
          btn.click();
          expect(editor.getFormat(0).align).to.be.not.ok;
        });
      });
    });

    it('should clear formatting when clicking the "clean-button" part', () => {
      editor.format('bold', true);
      editor.format('underline', true);

      btn = getButton('clean');
      btn.click();
      expect(editor.getFormat(0)).to.deep.equal({});
    });

    describe('on state attribute', () => {
      it('should toggle "on" attribute when the format button is clicked', () => {
        btn = getButton('bold');

        btn.click();
        expect(btn.hasAttribute('on')).to.be.true;
        btn.click();
        expect(btn.hasAttribute('on')).to.be.false;
      });

      it('should toggle "toolbar-button-pressed" part value when the format button is clicked', () => {
        btn = getButton('bold');

        btn.click();
        expect(btn.part.contains('toolbar-button-pressed')).to.be.true;
        btn.click();
        expect(btn.part.contains('toolbar-button-pressed')).to.be.false;
      });

      it('should toggle "on" attribute for corresponding buttons when selection is changed', () => {
        const delta = new window.Quill.imports.delta([
          { attributes: { bold: true }, insert: 'Foo\n' },
          { attributes: { italic: true }, insert: 'Bar\n' },
          { attributes: { link: 'https://vaadin.com' }, insert: 'Vaadin\n' },
        ]);
        editor.setContents(delta, 'user');

        const boldBtn = getButton('bold');
        const italicBtn = getButton('italic');
        const linkBtn = getButton('link');

        editor.setSelection(0, 1);
        expect(boldBtn.hasAttribute('on')).to.be.true;
        expect(italicBtn.hasAttribute('on')).to.be.false;
        expect(linkBtn.hasAttribute('on')).to.be.false;

        editor.setSelection(4, 1);
        expect(boldBtn.hasAttribute('on')).to.be.false;
        expect(italicBtn.hasAttribute('on')).to.be.true;
        expect(linkBtn.hasAttribute('on')).to.be.false;

        editor.setSelection(8, 1);
        expect(boldBtn.hasAttribute('on')).to.be.false;
        expect(italicBtn.hasAttribute('on')).to.be.false;
        expect(linkBtn.hasAttribute('on')).to.be.true;
      });
    });

    (isFirefox ? describe.skip : describe)('image', () => {
      beforeEach(() => {
        btn = getButton('image');
      });

      it('should open file dialog when clicking the "image-button" part', () => {
        // This test checks if the 'click' event is synchronously dispatched
        // on the hidden file input when user clicks "Image" button. The
        // file dialog is actually not getting opened during testing.
        const clickSpy = sinon.spy();
        sinon.stub(rte.$.fileInput, 'click').callsFake(clickSpy);
        btn.dispatchEvent(new MouseEvent('click'));
        expect(clickSpy.calledOnce).to.be.true;
      });

      it('should open file dialog by touchend on the "image-button" part', () => {
        const clickSpy = sinon.spy();
        sinon.stub(rte.$.fileInput, 'click').callsFake(clickSpy);
        const e = new CustomEvent('touchend', { cancelable: true });
        btn.dispatchEvent(e);
        expect(clickSpy.calledOnce).to.be.true;
        expect(e.defaultPrevented).to.be.true;
      });

      (isDesktopSafari ? it.skip : it)(
        'should insert image from the file dialog on file input change event',
        (done) => {
          // We can't simply assign `files` property of input[type="file"].
          // Tweaking __proto__ to make it assignable below.
          const fileInput = rte.shadowRoot.querySelector('input[type="file"]');
          Object.setPrototypeOf(fileInput, HTMLElement.prototype);
          // Replacing __proto__ is not enough for Android Chrome, deleting the
          // files property in addition.
          delete fileInput.files;

          editor.focus();

          const img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
          fileInput.files = [createImage(img, 'image/gif')];

          rte.addEventListener('value-changed', () => {
            const operation = JSON.parse(rte.value)[0];
            expect(operation.insert.image).to.equal(img);
            done();
          });

          // Trigger mock image upload
          fileInput.dispatchEvent(new Event('change'));
        },
      );

      (isDesktopSafari ? it.skip : it)('should mark image button as clicked for subsequent change event', (done) => {
        const markClickedSpy = sinon.spy(rte, '_markToolbarClicked');

        const fileInput = rte.shadowRoot.querySelector('input[type="file"]');
        Object.setPrototypeOf(fileInput, HTMLElement.prototype);
        delete fileInput.files;

        editor.focus();

        const img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        fileInput.files = [createImage(img, 'image/gif')];

        rte.addEventListener('value-changed', () => {
          expect(markClickedSpy.calledOnce).to.be.true;
          done();
        });

        // Trigger mock image upload
        fileInput.dispatchEvent(new Event('change'));
      });
    });

    describe('hyperlink', () => {
      const url = 'https://vaadin.com';
      let dialog;

      beforeEach(() => {
        btn = getButton('link');
        dialog = rte.$.linkDialog;
      });

      describe('dialog', () => {
        it('should not open the confirm dialog when the editor does not have focus', async () => {
          btn.click();
          await nextUpdate(rte);
          expect(dialog.opened).to.be.false;
        });

        it('should focus whe text field when the dialog is opened', async () => {
          const spy = sinon.spy(rte.$.linkUrl, 'focus');
          editor.focus();
          btn.click();
          await nextRender(rte);
          expect(spy.calledOnce).to.be.true;
        });

        it('should confirm the dialog by pressing enter in the focused text field', async () => {
          const spy = sinon.spy(rte.$.confirmLink, 'click');
          editor.focus();
          btn.click();
          await nextRender();
          const evt = new CustomEvent('keydown');
          evt.keyCode = 13;
          rte.$.linkUrl.dispatchEvent(evt);
          expect(spy.calledOnce).to.be.true;
        });

        it('should focus whe editor when the dialog is cancelled', async () => {
          editor.focus();
          btn.click();
          await nextRender();

          const spy = sinon.spy(editor, 'focus');
          rte.addEventListener('change', spy);

          rte.$.cancelLink.click();
          expect(spy.calledOnce).to.be.true;
        });
      });

      describe('selected text', () => {
        it('should open the confirm dialog when the editor has focus and text is selected', async () => {
          rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          await nextUpdate(rte);
          await nextRender();
          expect(dialog.opened).to.be.true;
        });

        it('should add link to the selected text when URL in dialog is set and confirmed', async () => {
          rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
          editor.focus();
          editor.setSelection(0, 6);
          flushValueDebouncer();
          btn.click();
          await nextRender();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`);
        });

        it('should update link on the selected text when URL in the dialog is changed and confirmed', async () => {
          rte.value = '[{"attributes":{"link":"https://google.com"},"insert":"Vaadin"},{"insert":"\\n"}]';
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          await nextRender();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`);
        });

        it('should remove link and color on the selected text when remove button is pressed', async () => {
          rte.value = `[{"attributes":{"link":"${url}", "color": "blue"},"insert":"Vaadin"},{"insert":"\\n"}]`;
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          await nextRender();
          rte.$.removeLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal('[{"insert":"Vaadin\\n"}]');
        });
      });

      describe('no text selected', () => {
        it('should open the confirm dialog when the editor has focus and no text selected', async () => {
          editor.focus();
          btn.click();
          await nextRender();
          expect(dialog.opened).to.be.true;
        });

        it('should insert link with the text same as the URL set in the dialog, if no text selected', async () => {
          editor.focus();
          editor.setSelection(0, 0);
          btn.click();
          await nextRender();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"${url}"},{"insert":"\\n"}]`);
        });

        it('should update link if the cursor is in the text containing it, if no text selected', async () => {
          rte.value = '[{"attributes":{"link":"https://google.com"},"insert":"Vaadin"},{"insert":"\\n"}]';
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(1, 0);
          btn.click();
          await nextRender();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`);
        });

        it('should remove link and color if the cursor is in the text containing it, if no text selected', async () => {
          rte.value = `[{"attributes":{"link":"${url}", "color": "blue"},"insert":"Vaadin"},{"insert":"\\n"}]`;
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(1, 0);
          btn.click();
          await nextRender();
          rte.$.removeLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal('[{"insert":"Vaadin\\n"}]');
        });
      });

      describe('change', () => {
        it('should dispatch change event if the value has been updated', async () => {
          rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          await nextRender();

          rte.$.linkUrl.value = url;

          const spy = sinon.spy();
          rte.addEventListener('change', spy);

          rte.$.confirmLink.click();
          await nextRender();
          flushValueDebouncer();

          expect(spy.calledOnce).to.be.true;
        });

        it('should not change value and not dispatch change if the dialog was cancelled', async () => {
          const value = `[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`;
          rte.value = value;
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          await nextRender();

          const spy = sinon.spy();
          rte.addEventListener('change', spy);

          rte.$.cancelLink.click();
          await nextRender();
          flushValueDebouncer();
          expect(rte.value).to.equal(value);
          expect(spy.called).to.be.false;
        });
      });
    });
  });

  describe('undo and redo', () => {
    it('should undo last change when the "undo" button clicked', () => {
      editor.insertText(0, 'Foo', 'user');
      btn = getButton('undo');
      btn.click();
      expect(editor.getText()).to.not.equal('Foo\n');
    });

    it('should redo last change when the "redo" button clicked', () => {
      editor.insertText(0, 'Foo', 'user');
      btn = getButton('undo');
      btn.click();
      btn = getButton('redo');
      btn.click();
      expect(editor.getText()).to.equal('Foo\n');
    });
  });
});
