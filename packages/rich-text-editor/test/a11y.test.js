import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, keyboardEventFor, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-rich-text-editor.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('accessibility', () => {
  let rte, content, buttons, announcer, editor;

  const flushFormatAnnouncer = () => {
    rte.__debounceAnnounceFormatting?.flush();
  };

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  describe('screen readers', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      content = rte.shadowRoot.querySelector('[contenteditable]');
      announcer = rte.shadowRoot.querySelector('[aria-live=polite]');
    });

    it('should have aria-label for the buttons', () => {
      buttons.forEach((button, index) => {
        const expectedLabel = rte.i18n[Object.keys(rte.i18n)[index]];
        expect(button.ariaLabel).to.equal(expectedLabel);
      });
    });

    it('should localize aria-label for the buttons', async () => {
      const defaultI18n = rte.i18n;

      const localized = {};
      Object.keys(defaultI18n).forEach((key) => {
        localized[key] = `${defaultI18n[key]} localized`;
      });
      rte.i18n = localized;
      await nextUpdate(rte);

      buttons.forEach((button, index) => {
        const expectedLabel = `${defaultI18n[Object.keys(defaultI18n)[index]]} localized`;
        expect(button.ariaLabel).to.equal(expectedLabel);
      });
    });

    it('should have an invisible aria-live element', () => {
      const clip = getComputedStyle(announcer).clip;
      expect(clip).to.equal('rect(0px, 0px, 0px, 0px)');
    });

    it('should have textbox role', () => {
      expect(content.getAttribute('role')).to.equal('textbox');
    });

    it('should be decorated with aria-multiline', () => {
      expect(content.getAttribute('aria-multiline')).to.equal('true');
    });

    it('should announce the default formatting', () => {
      rte.value = '[{"insert": "foo "}, {"attributes": {"bold": true}, "insert": "bar"}, {"insert": "\\n"}]';
      editor.setSelection(1, 1);
      flushFormatAnnouncer();
      expect(announcer.textContent).to.equal('align left');
    });

    it('should announce custom formatting', (done) => {
      rte.value = '[{"insert": "foo "}, {"attributes": {"bold": true}, "insert": "bar"}, {"insert": "\\n"}]';
      editor.on('selection-change', () => {
        flushFormatAnnouncer();
        if (announcer.textContent === 'bold, align left') {
          done();
        }
      });
      editor.setSelection(5, 1);
    });

    it('should have role toolbar on the toolbar', () => {
      const toolbar = rte.shadowRoot.querySelector('[part=toolbar]');
      expect(toolbar.getAttribute('role')).to.be.equal('toolbar');
    });
  });

  describe('toolbar navigation', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should have only one tabbable button in toolbar', () => {
      const tabbables = rte.shadowRoot.querySelectorAll(`[part=toolbar] button:not([tabindex="-1"])`);
      expect(tabbables.length).to.equal(1);
      expect(tabbables[0]).to.eql(buttons[0]);
    });

    it('should focus the next button on right-arrow', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      const e = keyboardEventFor('keydown', 39);
      buttons[buttons.length - 1].dispatchEvent(e);
    });

    it('should focus the previous button on left-arrow', (done) => {
      sinon.stub(buttons[buttons.length - 1], 'focus').callsFake(done);
      const e = keyboardEventFor('keydown', 37);
      buttons[0].dispatchEvent(e);
    });

    it('should change the tabbable button on arrow navigation', () => {
      const e = keyboardEventFor('keydown', 39);
      buttons[0].dispatchEvent(e);
      expect(buttons[0].getAttribute('tabindex')).to.equal('-1');
      expect(buttons[1].getAttribute('tabindex')).not.to.be.ok;
    });

    // This is a common pattern in popular rich text editors so users might expect
    // the combo to work. The toolbar is still accessible with the tab key normally.
    it('should focus a toolbar button on meta-f10 combo', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      editor.focus();
      const e = keyboardEventFor('keydown', 121, ['alt'], 'F10');
      content.dispatchEvent(e);
    });

    it('should focus a toolbar button on shift-tab combo', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      editor.focus();
      const e = keyboardEventFor('keydown', 9, ['shift'], 'Tab');
      content.dispatchEvent(e);
    });

    it('should mark toolbar as focused before focusing it on shift-tab', (done) => {
      const spy = sinon.spy(rte, '_markToolbarFocused');
      sinon.stub(buttons[0], 'focus').callsFake(() => {
        expect(spy.calledOnce).to.be.true;
        done();
      });
      editor.focus();
      const e = keyboardEventFor('keydown', 9, ['shift'], 'Tab');
      content.dispatchEvent(e);
    });

    it('should prevent keydown and focus the editor on esc', (done) => {
      sinon.stub(editor, 'focus').callsFake(done);
      const e = new CustomEvent('keydown', { bubbles: true });
      e.keyCode = 27;
      const result = buttons[0].dispatchEvent(e);
      expect(result).to.be.false; // DispatchEvent returns false when preventDefault is called
    });

    it('should prevent keydown and focus the editor on tab', (done) => {
      sinon.stub(editor, 'focus').callsFake(done);
      const e = new CustomEvent('keydown', { bubbles: true });
      e.keyCode = 9;
      e.key = 'Tab';
      e.shiftKey = false;
      const result = buttons[0].dispatchEvent(e);
      expect(result).to.be.false; // DispatchEvent returns false when preventDefault is called
    });
  });

  describe('lists', () => {
    const getListItems = () => rte.shadowRoot.querySelectorAll('.ql-editor li');

    const getListItemsWithIndent = (indentLevel) =>
      rte.shadowRoot.querySelectorAll(`.ql-editor li.ql-indent-${indentLevel}`);

    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should create new list item on enter', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ type: 'Item 2' });
      flushValueDebouncer();

      expect(getListItems()).to.have.length(2);
      expect(rte.htmlValue).to.include('Item 1');
      expect(rte.htmlValue).to.include('Item 2');
      expect(rte.htmlValue).to.equal('<ul><li>Item 1</li><li>Item 2</li></ul>');
    });

    it('should exit list on double enter', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ type: 'Some input' });
      flushValueDebouncer();

      expect(getListItems()).to.have.length(1);
      expect(rte.htmlValue).to.equal('<ul><li>Item 1</li></ul><p>Some input</p>');
    });

    it('should increase list indentation with Tab', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 2' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 3' });
      flushValueDebouncer();

      for (let indentLevel = 1; indentLevel < 3; indentLevel++) {
        const indentedItems = getListItemsWithIndent(indentLevel);
        expect(indentedItems).to.have.length(1);
        expect(indentedItems[0].textContent.trim()).to.equal(`Item ${indentLevel + 1}`);
        expect(indentedItems[0].classList.contains(`ql-indent-${indentLevel}`)).to.be.true;
      }
      expect(rte.htmlValue).to.equal('<ul><li>Item 1<ul><li>Item 2<ul><li>Item 3</li></ul></li></ul></li></ul>');
    });

    it('should decrease list indentation with Shift + Tab', async () => {
      editor.focus();
      await sendKeys({ type: 'Item 1' });
      editor.format('list', 'bullet');
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 2' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ type: 'Item 3' });
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Shift+Tab' });
      await sendKeys({ type: 'Item 4' });
      flushValueDebouncer();

      const indentedItems = getListItemsWithIndent(1);
      expect(indentedItems).to.have.length(2);
      expect(indentedItems[0].textContent.trim()).to.equal('Item 2');
      expect(indentedItems[0].classList.contains('ql-indent-1')).to.be.true;
      expect(indentedItems[1].textContent.trim()).to.equal('Item 4');
      expect(indentedItems[1].classList.contains('ql-indent-1')).to.be.true;
      expect(rte.htmlValue).to.equal(
        '<ul><li>Item 1<ul><li>Item 2<ul><li>Item 3</li></ul></li><li>Item 4</li></ul></li></ul>',
      );
    });

    it('should focus the toolbar on Shift + Tab at the end of the list item', async () => {
      const button = rte.shadowRoot.querySelector('[part=toolbar] button');
      const spy = sinon.stub(button, 'focus');
      rte.value = '[{"attributes":{"list":"bullet"},"insert":"Foo\\n"}]';
      editor.focus();
      editor.setSelection(3, 0);
      await sendKeys({ press: 'Shift+Tab' });
      expect(spy).to.be.calledOnce;
    });
  });

  describe('indent', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should represent indentation correctly', () => {
      rte.value = JSON.stringify([
        { insert: 'Indent 1\n', attributes: { indent: 1 } },
        { insert: 'Indent 2\n', attributes: { indent: 2 } },
      ]);
      expect(content.innerHTML).to.equal('<p class="ql-indent-1">Indent 1</p><p class="ql-indent-2">Indent 2</p>');
    });

    it('should convert ql-indent-* classes to tabs in htmlValue', () => {
      rte.value = JSON.stringify([
        { insert: 'Indent 1\n', attributes: { indent: 1 } },
        { insert: 'Indent 2\n', attributes: { indent: 2 } },
      ]);
      expect(rte.htmlValue).to.equal('<p>\tIndent 1</p><p>\t\tIndent 2</p>');
    });

    it('should handle empty indented elements', () => {
      rte.value = JSON.stringify([
        { insert: 'Before\n' },
        { insert: '\n', attributes: { indent: 1 } },
        { insert: '\n', attributes: { indent: 2 } },
        { insert: 'After\n' },
      ]);
      expect(rte.htmlValue).to.equal('<p>Before</p><p>\t</p><p>\t\t</p><p>After</p>');
    });

    it('should handle indentation with alignment', () => {
      rte.value = JSON.stringify([
        { insert: 'Normal\n' },
        { insert: 'Indented and aligned\n', attributes: { indent: 1, align: 'center' } },
        { insert: 'More indented\n', attributes: { indent: 2 } },
      ]);
      expect(rte.htmlValue).to.equal(
        '<p>Normal</p><p style="text-align: center">\tIndented and aligned</p><p>\t\tMore indented</p>',
      );
    });

    it('should preserve existing tab characters in content', () => {
      rte.dangerouslySetHtmlValue('<p>Already has\ttab</p><p class="ql-indent-1">Needs indent</p>');
      flushValueDebouncer();
      expect(rte.htmlValue).to.include('Already has\ttab');
      expect(rte.htmlValue).to.include('\tNeeds indent');
      expect(rte.htmlValue).to.not.include('ql-indent');
    });

    it('should handle high indentation levels', () => {
      rte.value = JSON.stringify([
        { insert: 'Level 7\n', attributes: { indent: 7 } },
        { insert: 'Level 8\n', attributes: { indent: 8 } },
      ]);
      expect(rte.htmlValue).to.include(`${'\t'.repeat(7)}Level 7`);
      expect(rte.htmlValue).to.include(`${'\t'.repeat(8)}Level 8`);
    });

    it('should handle nested elements with indentation', () => {
      rte.value = JSON.stringify([
        { insert: 'Normal\n' },
        { insert: 'Indented with ', attributes: { indent: 1 } },
        { insert: 'nested', attributes: { bold: true, indent: 1 } },
        { insert: ' content\n', attributes: { indent: 1 } },
      ]);
      expect(rte.htmlValue).to.equal('<p>Normal</p><p>\tIndented with <strong>nested</strong> content</p>');
    });
  });

  describe('code block', () => {
    beforeEach(async () => {
      rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
      await nextRender();
      editor = rte._editor;
      content = rte.shadowRoot.querySelector('[contenteditable]');
    });

    it('should change indentation on Tab in the code block', async () => {
      rte.value = '[{"insert":"foo"},{"attributes":{"code-block":true},"insert":"\\n"}]';
      editor.focus();
      await sendKeys({ press: 'Tab' });
      flushValueDebouncer();
      expect(rte.value).to.equal('[{"insert":"  foo"},{"attributes":{"code-block":true},"insert":"\\n"}]');
    });

    it('should change indentation on Shift + Tab in the code block', async () => {
      rte.value = '[{"insert":"  foo"},{"attributes":{"code-block":true},"insert":"\\n"}]';
      editor.focus();
      editor.setSelection(2, 0);
      await sendKeys({ press: 'Shift+Tab' });
      flushValueDebouncer();
      expect(rte.value).to.equal('[{"insert":"foo"},{"attributes":{"code-block":true},"insert":"\\n"}]');
    });
  });

  describe('Tab behavior', () => {
    let lastGlobalFocusable;

    beforeEach(async () => {
      [rte, lastGlobalFocusable] = fixtureSync(
        `<div>
          <vaadin-rich-text-editor></vaadin-rich-text-editor>
          <input id="last-global-focusable" />
        </div>`,
      ).children;
      await nextRender();
      buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
      editor = rte._editor;
      editor.focus();
    });

    it('should move focus to next element after esc followed by tab are pressed', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);
    });

    it('should move focus to the first toolbar button after esc followed by shift-tab are pressed', async () => {
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore default Tab behavior after multiple Esc and then Tab', async () => {
      // Hitting Escape multiple times and Tab should move focus to next element
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);

      // Checking that default Tab behavior is restored
      editor.focus();
      await sendKeys({ press: 'Tab' });
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal('<p>\t</p>');
    });
  });
});
