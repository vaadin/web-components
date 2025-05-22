import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, focusout, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-rich-text-editor.js';

describe('rich text editor', () => {
  let rte, editor;

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  const getButton = (fmt) => rte.shadowRoot.querySelector(`[part~="toolbar-button-${fmt}"]`);

  beforeEach(async () => {
    rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    await nextRender();
    editor = rte._editor;
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = rte.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('change event', () => {
    let content;

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
      focusout(content);

      expect(spy.calledOnce).to.be.true;
    });

    it('should not dispatch change event on focusout when value set from outside', () => {
      const spy = sinon.spy();
      rte.addEventListener('change', spy);

      rte.value = JSON.stringify([{ insert: 'Foo\n' }]);
      editor.focus();
      content.blur();
      focusout(content);

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
      content.blur();
      focusout(content, btn);
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
      focusout(content);

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

    it('should filter out ql-* class names', () => {
      // Modify the editor content directly, as setDangerouslyHtmlValue() strips
      // classes
      rte.shadowRoot.querySelector('.ql-editor').innerHTML =
        '<pre class="ql-syntax foo ql-cursor"><code>console.log("hello")</code></pre>';
      rte.__updateHtmlValue();
      expect(rte.htmlValue).to.equal('<pre class="foo"><code>console.log("hello")</code></pre>');
    });

    it('should not filter out ql-* in content', () => {
      rte.dangerouslySetHtmlValue('<p>mysql-driver</p>');
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal('<p>mysql-driver</p>');
    });

    it('should filter out empty span elements from the resulting htmlValue', () => {
      rte.dangerouslySetHtmlValue(
        '<p><strong>Hello </strong></p><p><strong><span class="ql-cursor"></span>world</strong></p>',
      );
      flushValueDebouncer();
      // Empty span should be stripped
      expect(rte.htmlValue).to.equal('<p><strong>Hello </strong></p><p><strong>world</strong></p>');
    });

    it('should not filter out span elements with style from the resulting htmlValue', () => {
      setValueAndFormatText('color', '#e60000');
      // Empty span should be stripped
      expect(rte.htmlValue).to.equal('<p><span style="color: rgb(230, 0, 0);">Foo</span></p>');
    });

    it('should not lose leading tab characters from the resulting htmlValue', () => {
      const htmlWithLeadingTab = '<p>\tTab</p>';
      rte.dangerouslySetHtmlValue(htmlWithLeadingTab);
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal(htmlWithLeadingTab);
    });

    it('should not lose extra space characters from the resulting htmlValue', () => {
      const htmlWithExtraSpaces = '<p>Extra   spaces</p>';
      rte.dangerouslySetHtmlValue(htmlWithExtraSpaces);
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal(htmlWithExtraSpaces);
    });

    it('should not break code block attributes', () => {
      const htmlWithCodeBlock = `<pre spellcheck="false">code\n</pre>`;
      rte.dangerouslySetHtmlValue(htmlWithCodeBlock);
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal(htmlWithCodeBlock);
    });

    it('should support double spaces inside html tags', () => {
      const htmlWithCodeBlock = `<pre  spellcheck="false">code\n</pre>`;
      rte.dangerouslySetHtmlValue(htmlWithCodeBlock);
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal(`<pre spellcheck="false">code\n</pre>`);
    });

    it('should support tabs inside html tags', () => {
      const htmlWithCodeBlock = `<pre\tspellcheck="false">code\n</pre>`;
      rte.dangerouslySetHtmlValue(htmlWithCodeBlock);
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal(`<pre spellcheck="false">code\n</pre>`);
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

    it('should reflect to attribute', async () => {
      rte.disabled = true;
      await nextUpdate(rte);
      expect(rte.hasAttribute('disabled')).to.be.true;
    });

    it('should invoke the editor methods', async () => {
      const spy = sinon.spy(editor, 'enable');
      rte.disabled = true;
      await nextUpdate(rte);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0]).to.equal(false);

      rte.disabled = false;
      await nextUpdate(rte);
      expect(spy.calledTwice).to.be.true;
      expect(spy.secondCall.args).to.have.length(0);
    });

    it('should disallow interactions with the editor', async () => {
      rte.disabled = true;
      await nextUpdate(rte);
      expect(getComputedStyle(rte).pointerEvents).to.equal('none');
    });

    it('should disable the toolbar buttons', async () => {
      const buttons = Array.from(rte.shadowRoot.querySelectorAll('[part~="toolbar-button"]'));
      rte.disabled = true;
      await nextUpdate(rte);
      expect(buttons.every((btn) => btn.hasAttribute('disabled'))).to.be.true;

      rte.disabled = false;
      await nextUpdate(rte);
      expect(buttons.every((btn) => btn.hasAttribute('disabled'))).to.be.false;
    });
  });

  describe('readonly', () => {
    it('should be set to false by default', () => {
      expect(rte.readonly).to.be.false;
    });

    it('should reflect to attribute', async () => {
      rte.readonly = true;
      await nextUpdate(rte);
      expect(rte.hasAttribute('readonly')).to.be.true;
    });

    it('should update value on API call', async () => {
      rte.readonly = true;
      await nextUpdate(rte);
      rte.dangerouslySetHtmlValue('<h3><i>Foo</i>Bar</h3>');
      flushValueDebouncer();
      const delta =
        '[{"attributes":{"italic":true},"insert":"Foo"},{"insert":"Bar"},{"attributes":{"header":3},"insert":"\\n"}]';
      expect(rte.value).to.equal(delta);
      // Quill is converting the italic font to use appropriate tag
      expect(rte.htmlValue).to.equal('<h3><em>Foo</em>Bar</h3>');
    });

    it('should invoke the editor methods', async () => {
      const spy = sinon.spy(editor, 'enable');
      rte.readonly = true;
      await nextUpdate(rte);
      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0]).to.equal(false);

      rte.readonly = false;
      await nextUpdate(rte);
      expect(spy.calledTwice).to.be.true;
      expect(spy.secondCall.args).to.have.length(0);
    });

    it('should hide the toolbar', async () => {
      rte.readonly = true;
      await nextUpdate(rte);
      expect(getComputedStyle(rte.shadowRoot.querySelector('[part="toolbar"]')).display).to.equal('none');
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
        { attributes: { list: 'bullet' }, insert: '\n' },
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
          { attributes: { list: 'bullet' }, insert: '\n' },
        ]),
      );
    });
  });
});
