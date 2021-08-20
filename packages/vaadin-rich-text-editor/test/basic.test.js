import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, isDesktopSafari, isFirefox, nextRender } from '@vaadin/testing-helpers';
import { createImage } from './helpers.js';
import '../vaadin-rich-text-editor.js';

describe('rich text editor', () => {
  'use strict';

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  let rte, editor;

  const getButton = (fmt) => rte.shadowRoot.querySelector(`[part~="toolbar-button-${fmt}"]`);

  beforeEach(() => {
    rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    editor = rte._editor;
  });

  describe('custom element definition', () => {
    it('should not expose class name globally', () => {
      expect(window.RichTextEditorElement).not.to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(rte.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\*|\d+)(-(alpha|beta|rc)\d+)?$/);
    });
  });

  describe('toolbar controls', () => {
    let btn;

    describe('selected text', () => {
      beforeEach(async () => {
        editor.focus();
        editor.insertText(0, 'Foo', 'user');
        editor.setSelection(0, 3);
        await nextRender(rte);
      });

      // FIXME: flaky tests in GitHub Actions only in Firefox (passing locally).
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'].forEach((fmt) => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        (isFirefox || isSafari ? it.skip : it)(`should apply ${fmt} formatting to the selected text on click`, () => {
          btn = getButton(fmt);
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          editor.root.dispatchEvent(new CustomEvent('focusout', { bubbles: true }));
          document.body.focus();
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          btn.click();
          expect(editor.getFormat(0, 3)[fmt]).to.be.true;
        });
      });
    });

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

      it('should toggle "on" attribute for corresponding buttons when selection is changed', () => {
        const delta = new window.Quill.imports.delta([
          { attributes: { bold: true }, insert: 'Foo\n' },
          { attributes: { italic: true }, insert: 'Bar\n' },
          { attributes: { link: 'https://vaadin.com' }, insert: 'Vaadin\n' }
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
      let btn;

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

      it('should invoke Polymer.Gestures.resetMouseCanceller before open file dialog', () => {
        // NOTE(web-padawan): With ES modules we can’t put a spy on the actual
        // Polymer.Gestures.resetMouseCanceller. Have to use a separate
        // wrapper method for testing.
        const spy = sinon.spy(rte, '__resetMouseCanceller');
        btn.dispatchEvent(new CustomEvent('touchend', { cancelable: true }));
        expect(spy.calledOnce).to.be.true;
      });

      (isDesktopSafari ? it.skip : it)(
        'should insert image from the file dialog on file input change event',
        (done) => {
          // We can't simply assign `files` property of input[type="file"].
          // Tweaking __proto__ to make it assignable below.
          const fileInput = rte.shadowRoot.querySelector('input[type="file"]');
          fileInput.__proto__ = HTMLElement.prototype;
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

          // trigger mock image upload
          fileInput.dispatchEvent(new Event('change'));
        }
      );

      (isDesktopSafari ? it.skip : it)('should mark image button as clicked for subsequent change event', (done) => {
        const markClickedSpy = sinon.spy(rte, '_markToolbarClicked');

        const fileInput = rte.shadowRoot.querySelector('input[type="file"]');
        fileInput.__proto__ = HTMLElement.prototype;
        delete fileInput.files;

        editor.focus();

        const img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        fileInput.files = [createImage(img, 'image/gif')];

        rte.addEventListener('value-changed', () => {
          expect(markClickedSpy.calledOnce).to.be.true;
          done();
        });

        // trigger mock image upload
        fileInput.dispatchEvent(new Event('change'));
      });
    });

    describe('hyperlink', () => {
      const url = 'https://vaadin.com';
      let btn, dialog;

      beforeEach(() => {
        btn = getButton('link');
        dialog = rte.$.linkDialog;
      });

      describe('dialog', () => {
        it('should not open the confirm dialog when the editor does not have focus', () => {
          btn.click();
          expect(dialog.opened).to.be.false;
        });

        it('should focus whe text field when the dialog is opened', async () => {
          const spy = sinon.spy(rte.$.linkUrl, 'focus');
          editor.focus();
          btn.click();
          await nextRender(rte);
          expect(spy.calledOnce).to.be.true;
        });

        it('should confirm the dialog by pressing enter in the focused text field', () => {
          const spy = sinon.spy(rte.$.confirmLink, 'click');
          editor.focus();
          btn.click();
          const evt = new CustomEvent('keydown');
          evt.keyCode = 13;
          rte.$.linkUrl.dispatchEvent(evt);
          expect(spy.calledOnce).to.be.true;
        });

        it('should focus whe editor when the dialog is cancelled', () => {
          editor.focus();
          btn.click();

          const spy = sinon.spy(editor, 'focus');
          rte.addEventListener('change', spy);

          rte.$.cancelLink.click();
          expect(spy.calledOnce).to.be.true;
        });
      });

      describe('selected text', () => {
        it('should open the confirm dialog when the editor has focus and text is selected', () => {
          rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          expect(dialog.opened).to.be.true;
        });

        it('should add link to the selected text when URL in dialog is set and confirmed', () => {
          rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
          editor.focus();
          editor.setSelection(0, 6);
          flushValueDebouncer();
          btn.click();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`);
        });

        it('should update link on the selected text when URL in the dialog is changed and confirmed', () => {
          rte.value = '[{"attributes":{"link":"https://google.com"},"insert":"Vaadin"},{"insert":"\\n"}]';
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`);
        });

        it('should remove link and color on the selected text when remove button is pressed', () => {
          rte.value = `[{"attributes":{"link":"${url}", "color": "blue"},"insert":"Vaadin"},{"insert":"\\n"}]`;
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();
          rte.$.removeLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal('[{"insert":"Vaadin\\n"}]');
        });
      });

      describe('no text selected', () => {
        it('should open the confirm dialog when the editor has focus and no text selected', () => {
          editor.focus();
          btn.click();
          expect(dialog.opened).to.be.true;
        });

        it('should insert link with the text same as the URL set in the dialog, if no text selected', () => {
          editor.focus();
          editor.setSelection(0, 0);
          btn.click();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"${url}"},{"insert":"\\n"}]`);
        });

        it('should update link if the cursor is in the text containing it, if no text selected', () => {
          rte.value = '[{"attributes":{"link":"https://google.com"},"insert":"Vaadin"},{"insert":"\\n"}]';
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(1, 0);
          btn.click();
          rte.$.linkUrl.value = url;
          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(`[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`);
        });

        it('should remove link and color if the cursor is in the text containing it, if no text selected', () => {
          rte.value = `[{"attributes":{"link":"${url}", "color": "blue"},"insert":"Vaadin"},{"insert":"\\n"}]`;
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(1, 0);
          btn.click();
          rte.$.removeLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal('[{"insert":"Vaadin\\n"}]');
        });
      });

      describe('change', () => {
        it('should dispatch change event if the value has been updated', () => {
          rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
          editor.focus();
          editor.setSelection(0, 6);
          flushValueDebouncer();
          btn.click();
          rte.$.linkUrl.value = url;

          const spy = sinon.spy();
          rte.addEventListener('change', spy);

          rte.$.confirmLink.click();
          flushValueDebouncer();
          expect(spy.calledOnce).to.be.true;
        });

        it('should not change value and not dispatch change if the dialog was cancelled', () => {
          const value = `[{"attributes":{"link":"${url}"},"insert":"Vaadin"},{"insert":"\\n"}]`;
          rte.value = value;
          flushValueDebouncer();
          editor.focus();
          editor.setSelection(0, 6);
          btn.click();

          const spy = sinon.spy();
          rte.addEventListener('change', spy);

          rte.$.cancelLink.click();
          flushValueDebouncer();
          expect(rte.value).to.equal(value);
          expect(spy.called).to.be.false;
        });
      });
    });
  });

  describe('change event', () => {
    var content;

    const setContent = (text) => {
      editor.setContents(new window.Quill.imports.delta([{ insert: text }]), 'user');
    };

    beforeEach(() => {
      content = rte.shadowRoot.querySelector('.ql-editor');
    });

    it('should dispatch change event on focusout event when content was changed', () => {
      const spy = sinon.spy();
      rte.addEventListener('change', spy);

      // Emulate setting the value from keyboard
      editor.focus();
      setContent('Foo');
      // Setting selection range to null in Quill
      // Needed for proper hasFocus() check
      content.blur();
      content.dispatchEvent(new CustomEvent('focusout'));

      expect(spy.calledOnce).to.be.true;
    });

    it('should not dispatch change event on focusout when value set from outside', () => {
      const spy = sinon.spy();
      rte.addEventListener('change', spy);

      rte.value = JSON.stringify([{ insert: 'Foo\n' }]);
      editor.focus();
      content.blur();
      content.dispatchEvent(new CustomEvent('focusout'));

      expect(spy.called).to.be.false;
    });

    it('should dispatch change event after styling the content with toolbar', (done) => {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);

      rte.addEventListener('change', () => {
        expect(rte.value).to.equal('[{"attributes":{"bold":true},"insert":"Foo"},{"insert":"\\n"}]');
        done();
      });

      // Emulate using the toolbar: selecting text and clicking a bold button.
      editor.focus();
      editor.setSelection(0, 3);

      const btn = getButton('bold');
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      const evt = new CustomEvent('focusout');
      evt.relatedTarget = btn;
      content.blur();
      content.dispatchEvent(evt);
      btn.click();

      flushValueDebouncer();
    });

    it('should not dispatch change event if no styling changed after toolbar click', () => {
      const spy = sinon.spy();
      rte.addEventListener('change', spy);
      rte.value = JSON.stringify([{ insert: 'Foo' }]);

      // Emulate using the toolbar: clicking a bold button with no text selected
      editor.focus();
      editor.setSelection(0, 0);

      const btn = getButton('bold');
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      btn.click();
      content.dispatchEvent(new CustomEvent('focus'));
      flushValueDebouncer();

      expect(spy.called).to.be.false;
    });

    it('should dispatch change event after clearing the formatting with toolbar', (done) => {
      const text = JSON.stringify([{ attributes: { bold: true }, insert: 'Foo\n' }]);
      rte.value = text;

      rte.addEventListener('change', () => {
        expect(rte.value).to.equal(JSON.stringify([{ insert: 'Foo\n' }]));
        done();
      });

      // Emulate using the toolbar: selecting text and clicking a clear button.
      editor.focus();
      editor.setSelection(0, 3);
      const btn = getButton('clean');
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      btn.click();
      flushValueDebouncer();
    });

    it('should not be dispatched when text remains unchanged after leaving rte', () => {
      const spy = sinon.spy();
      rte.addEventListener('change', spy);

      rte.value = JSON.stringify([{ insert: 'Foo\n' }]);
      editor.focus();

      // Emulate adding the formatting, removing it back and then moving focus out
      editor.setSelection(0, 3);
      const btn = getButton('bold');
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      btn.click();

      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      btn.click();

      content.blur();
      content.dispatchEvent(new CustomEvent('focusout'));

      expect(spy.called).to.be.false;
    });
  });

  describe('value', () => {
    it('by default should be an empty string', () => {
      expect(rte.value).to.be.string;
      expect(rte.value).to.have.length(0);
    });

    it('should not be undefined', () => {
      rte.value = undefined;
      expect(rte.value).to.equal('');
    });

    it('should not contain only one empty new line', () => {
      rte.value = '[{"insert":"\\n"}]';
      expect(rte.value).to.equal('');
    });

    it('should set value to empty string after inserting and deleting text', () => {
      editor.insertText(0, 'Foo', 'user');
      flushValueDebouncer();
      editor.deleteText(0, 3, 'user');
      flushValueDebouncer();
      expect(rte.value).to.be.equal('');
    });

    it('should represent the stringified "delta" of the editor', (done) => {
      rte.addEventListener('value-changed', (e) => {
        expect(e.detail.value).to.be.string;
        const parsedValue = JSON.parse(e.detail.value);
        expect(parsedValue).to.have.length(1);
        expect(parsedValue).to.deep.equal([{ insert: 'Foo\n' }]);
        done();
      });
      editor.insertText(0, 'Foo', 'user');
    });

    it('should update the "delta" when set from outside', () => {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);
      expect(editor.getText()).to.equal('Foo\n');
    });

    it('should error when setting value of the incorrect type', () => {
      const origError = console.error;
      const spy = (console.error = sinon.spy());
      rte.value = [{ insert: 'Foo' }];
      console.error = origError;
      expect(editor.getText()).to.not.include('Foo');
      expect(spy.called).to.be.true;
    });

    it('should error when setting value with invalid structure and fallback to the previous value', () => {
      // Set value for falling back
      rte.value = '[{"insert":"Foo"}]';
      const origError = console.error;
      const spy = (console.error = sinon.spy());
      // Missing closing ]
      rte.value = `[{insert: 'Bar'}`;
      console.error = origError;
      expect(editor.getText()).to.not.include('Bar');
      expect(rte.value).to.be.equal('[{"insert":"Foo"}]');
      expect(spy.called).to.be.true;
    });

    it('should error when setting value of invalid type and fallback to the previous value', () => {
      // Set value for falling back
      rte.value = '[{"insert":"Foo"}]';
      const origError = console.error;
      const spy = (console.error = sinon.spy());
      rte.value = `1`;
      console.error = origError;
      expect(editor.getText()).to.not.include('1');
      expect(rte.value).to.be.equal('[{"insert":"Foo"}]');
      expect(spy.called).to.be.true;
    });

    it('should clear the editor contents when value is set to null', () => {
      editor.insertText(0, 'Foo', 'user');
      flushValueDebouncer();
      rte.value = null;
      expect(editor.getText()).to.equal('\n');
    });

    it('should clear the editor contents when value is set to undefined', () => {
      editor.insertText(0, 'Foo', 'user');
      flushValueDebouncer();
      rte.value = undefined;
      expect(editor.getText()).to.equal('\n');
    });

    it('should clear the editor contents when value is set to empty string', () => {
      editor.insertText(0, 'Foo', 'user');
      flushValueDebouncer();
      rte.value = '';
      expect(editor.getText()).to.equal('\n');
    });
  });

  describe('htmlValue', () => {
    let el;

    function setValueAndFormatLine(format, value = true) {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);
      editor.formatLine(0, 1, format, value);
      flushValueDebouncer();
    }

    function setValueAndFormatText(format, value = true) {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);
      editor.formatText(0, 3, format, value);
      flushValueDebouncer();
    }

    const getHtml = (htmlValue) => {
      const div = document.createElement('div');
      div.innerHTML = htmlValue;
      return div.firstChild;
    };

    it('should update htmlValue and value on dangerously setting of the editor htmlValue', () => {
      rte.dangerouslySetHtmlValue('<h3><i>Foo</i>Bar</h3>');
      flushValueDebouncer();
      const delta =
        '[{"attributes":{"italic":true},"insert":"Foo"},{"insert":"Bar"},{"attributes":{"header":3},"insert":"\\n"}]';
      expect(rte.value).to.equal(delta);
      // Quill is converting the italic font to use appropriate tag
      expect(rte.htmlValue).to.equal('<h3><em>Foo</em>Bar</h3>');
    });

    it('should return the quill editor innerHTML', () => {
      expect(rte.htmlValue).to.equal('<p><br></p>');
    });

    it('should be updated from user input to Quill', () => {
      editor.insertText(0, 'Foo', 'user');
      flushValueDebouncer();
      expect(rte.htmlValue).to.be.eql('<p>Foo</p>');
    });

    it('should be updated on value property change', () => {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);
      expect(rte.htmlValue).to.be.eql('<p>Foo</p>');
    });

    it('should be read only property', () => {
      rte.htmlValue = '<h1>Foo</h1>';
      expect(rte.htmlValue).not.to.be.eql('<h1>Foo</h1>');
    });

    it('should use <p> tag to wrap inline text', () => {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('p');
      expect(el.className).to.equal('');
    });

    it('should use <strong> tag for bold formatting', () => {
      setValueAndFormatText('bold');
      el = getHtml(rte.htmlValue).firstChild;
      expect(el.localName).to.equal('strong');
    });

    it('should use <em> tag for italic formatting', () => {
      setValueAndFormatText('italic');
      el = getHtml(rte.htmlValue).firstChild;
      expect(el.localName).to.equal('em');
    });

    it('should use <u> tag for underline formatting', () => {
      setValueAndFormatText('underline');
      el = getHtml(rte.htmlValue).firstChild;
      expect(el.localName).to.equal('u');
    });

    it('should use <s> tag for strike formatting', () => {
      setValueAndFormatText('strike');
      el = getHtml(rte.htmlValue).firstChild;
      expect(el.localName).to.equal('s');
    });

    it('should use <h1> tag for level 1 header', () => {
      setValueAndFormatLine('header', 1);
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('h1');
    });

    it('should use <h2> tag for level 2 header', () => {
      setValueAndFormatLine('header', 2);
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('h2');
    });

    it('should use <sub> tag for subscript', () => {
      setValueAndFormatText('script', 'sub');
      el = getHtml(rte.htmlValue);
      expect(el.firstChild.localName).to.equal('sub');
    });

    it('should use <sup> tag for superscript', () => {
      setValueAndFormatText('script', 'super');
      el = getHtml(rte.htmlValue);
      expect(el.firstChild.localName).to.equal('sup');
    });

    it('should use <ol> tag for ordered list', () => {
      setValueAndFormatLine('list', 'ordered');
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('ol');
      expect(el.firstChild.localName).to.equal('li');
    });

    it('should use <ul> tag for bullet list', () => {
      setValueAndFormatLine('list', 'bullet');
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('ul');
      expect(el.firstChild.localName).to.equal('li');
    });

    it('should use <blockquote> tag for quote', () => {
      setValueAndFormatLine('blockquote');
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('blockquote');
    });

    it('should use <pre> tag for code block', () => {
      setValueAndFormatLine('code-block');
      el = getHtml(rte.htmlValue);
      expect(el.localName).to.equal('pre');
      expect(el.className).to.equal('');
    });

    it('should use inline styles for text alignment', () => {
      ['rtl', 'ltr'].forEach((dir) => {
        ['center', dir === 'rtl' ? 'left' : 'right'].forEach((align) => {
          rte.setAttribute('dir', dir);
          setValueAndFormatLine('align', align);
          el = getHtml(rte.htmlValue);
          expect(el.style.textAlign).to.equal(align);
          rte.removeAttribute('dir');
        });
      });
    });
  });

  describe('disabled', () => {
    it('should be set to false by default', () => {
      expect(rte.disabled).to.be.false;
    });

    it('should reflect to attribute', () => {
      rte.disabled = true;
      expect(rte.hasAttribute('disabled')).to.be.true;
    });

    it('should invoke the editor methods', () => {
      const spy = sinon.spy(editor, 'enable');
      rte.disabled = true;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0]).to.equal(false);
      rte.disabled = false;
      expect(spy.calledTwice).to.be.true;
      expect(spy.secondCall.args).to.have.length(0);
    });

    it('should disallow interactions with the editor', () => {
      rte.disabled = true;
      expect(getComputedStyle(rte).pointerEvents).to.equal('none');
    });

    it('should disable the toolbar buttons', () => {
      const buttons = Array.from(rte.shadowRoot.querySelectorAll('[part~="toolbar-button"]'));
      rte.disabled = true;
      expect(buttons.every((btn) => btn.hasAttribute('disabled'))).to.be.true;
      rte.disabled = false;
      expect(buttons.every((btn) => btn.hasAttribute('disabled'))).to.be.false;
    });
  });

  describe('readonly', () => {
    it('should be set to false by default', () => {
      expect(rte.readonly).to.be.false;
    });

    it('should reflect to attribute', () => {
      rte.readonly = true;
      expect(rte.hasAttribute('readonly')).to.be.true;
    });

    it('should update value on API call', () => {
      rte.readonly = true;
      rte.dangerouslySetHtmlValue('<h3><i>Foo</i>Bar</h3>');
      flushValueDebouncer();
      const delta =
        '[{"attributes":{"italic":true},"insert":"Foo"},{"insert":"Bar"},{"attributes":{"header":3},"insert":"\\n"}]';
      expect(rte.value).to.equal(delta);
      // Quill is converting the italic font to use appropriate tag
      expect(rte.htmlValue).to.equal('<h3><em>Foo</em>Bar</h3>');
    });

    it('should invoke the editor methods', () => {
      const spy = sinon.spy(editor, 'enable');
      rte.readonly = true;
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0]).to.equal(false);
      rte.readonly = false;
      expect(spy.calledTwice).to.be.true;
      expect(spy.secondCall.args).to.have.length(0);
    });

    it('should hide the toolbar', () => {
      rte.readonly = true;
      expect(getComputedStyle(rte.shadowRoot.querySelector('[part="toolbar"]')).display).to.equal('none');
    });
  });

  describe('undo and redo', () => {
    let btn;

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

  describe('shadow selection polyfill', () => {
    it('should return correct selection when `quill.format` is called', () => {
      rte.value = JSON.stringify([{ insert: 'Foo' }]);
      editor.setSelection(0, 3);
      editor.format('bold', true);
      expect(editor.getSelection().length).to.equal(3);
    });

    it('should not throw when inserting newline in the list', () => {
      rte.value = JSON.stringify([
        { insert: '12' },
        { attributes: { list: 'bullet' }, insert: '\n' },
        { insert: '34' },
        { attributes: { list: 'bullet' }, insert: '\n' }
      ]);
      editor.focus();
      editor.setSelection(4, 0);
      editor.insertText(4, '\n', { list: 'bullet' }, 'user');
      flushValueDebouncer();

      expect(rte.value).to.equal(
        JSON.stringify([
          { insert: '12' },
          { attributes: { list: 'bullet' }, insert: '\n' },
          { insert: '3' },
          { attributes: { list: 'bullet' }, insert: '\n' },
          { insert: '4' },
          { attributes: { list: 'bullet' }, insert: '\n' }
        ])
      );
    });
  });
});
