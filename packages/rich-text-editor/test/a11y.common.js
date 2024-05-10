import { expect } from '@esm-bundle/chai';
import {
  down,
  fixtureSync,
  focusin,
  isFirefox,
  keyboardEventFor,
  nextRender,
  nextUpdate,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('accessibility', () => {
  let rte, content, buttons, announcer, editor;

  const flushFormatAnnouncer = () => {
    rte.__debounceAnnounceFormatting?.flush();
  };

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  beforeEach(async () => {
    rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    await nextRender();
    editor = rte._editor;
    buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
    content = rte.shadowRoot.querySelector('[contenteditable]');
    announcer = rte.shadowRoot.querySelector('[aria-live=polite]');
  });

  describe('screen readers', () => {
    it('should have default tooltips for the buttons', () => {
      buttons.forEach((button, index) => {
        const expectedLabel = rte.i18n[Object.keys(rte.i18n)[index]];
        const tooltip = rte.shadowRoot.querySelector(`[for="${button.id}"]`);
        expect(tooltip.text).to.equal(expectedLabel);
      });
    });

    it('should localize tooltips for the buttons', async () => {
      const defaultI18n = rte.i18n;

      const localized = {};
      Object.keys(defaultI18n).forEach((key) => {
        localized[key] = `${defaultI18n[key]} localized`;
      });
      rte.i18n = localized;
      await nextUpdate(rte);

      buttons.forEach((button, index) => {
        const expectedLabel = `${defaultI18n[Object.keys(defaultI18n)[index]]} localized`;
        const tooltip = rte.shadowRoot.querySelector(`[for="${button.id}"]`);
        expect(tooltip.text).to.equal(expectedLabel);
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

  describe('keyboard navigation', () => {
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
      const e = keyboardEventFor('keydown', 121, ['alt']);
      content.dispatchEvent(e);
    });

    it('should focus a toolbar button on shift-tab combo', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(done);
      editor.focus();
      const e = keyboardEventFor('keydown', 9, ['shift']);
      content.dispatchEvent(e);
    });

    it('should mark toolbar as focused before focusing it on shift-tab', (done) => {
      const spy = sinon.spy(rte, '_markToolbarFocused');
      sinon.stub(buttons[0], 'focus').callsFake(() => {
        expect(spy.calledOnce).to.be.true;
        done();
      });
      editor.focus();
      const e = keyboardEventFor('keydown', 9, ['shift']);
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
      e.shiftKey = false;
      const result = buttons[0].dispatchEvent(e);
      expect(result).to.be.false; // DispatchEvent returns false when preventDefault is called
    });

    it('should preserve the text selection on shift-tab', (done) => {
      sinon.stub(buttons[0], 'focus').callsFake(() => {
        expect(editor.getSelection()).to.deep.equal({ index: 0, length: 2 });
        done();
      });
      rte.value = '[{"attributes":{"list":"bullet"},"insert":"Foo\\n"}]';
      editor.focus();
      editor.setSelection(0, 2);
      const e = keyboardEventFor('keydown', 9, ['shift']);
      content.dispatchEvent(e);
    });

    it('should move focus to next element after esc followed by tab are pressed', async () => {
      const wrapper = fixtureSync(`<div>
        <vaadin-rich-text-editor></vaadin-rich-text-editor>
        <button>button</button>
      </div>`);
      await nextRender();
      const [rte, button] = wrapper.children;
      editor = rte._editor;
      editor.focus();
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(button);
    });

    it('should move focus to the first toolbar button after esc followed by shift-tab are pressed', async () => {
      editor.focus();
      await sendKeys({ press: 'Escape' });
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore default Tab behavior after multiple Esc and then Tab', async () => {
      const wrapper = fixtureSync(`<div>
        <vaadin-rich-text-editor></vaadin-rich-text-editor>
        <button>button</button>
      </div>`);
      await nextRender();
      const [rte, button] = wrapper.children;
      editor = rte._editor;
      editor.focus();
      // Hitting Escape multiple times and Tab should move focus to next element
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Escape' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(button);

      // Checking that default Tab behavior is restored
      editor.focus();
      await sendKeys({ press: 'Tab' });
      if (rte.__debounceSetValue) {
        rte.__debounceSetValue.flush();
      }
      expect(rte.htmlValue).to.equal('<p>\t</p>');
    });

    it('should change indentation and prevent shift-tab keydown in the code block', () => {
      rte.value = '[{"insert":"  foo"},{"attributes":{"code-block":true},"insert":"\\n"}]';
      editor.focus();
      editor.setSelection(2, 0);
      const e = keyboardEventFor('keydown', 9, ['shift']);
      content.dispatchEvent(e);
      flushValueDebouncer();
      expect(rte.value).to.equal('[{"insert":"foo"},{"attributes":{"code-block":true},"insert":"\\n"}]');
      expect(e.defaultPrevented).to.be.true;
    });

    (isFirefox ? it : it.skip)('should focus the fake target on content focusin', (done) => {
      const spy = sinon.spy(rte, '__createFakeFocusTarget');
      sinon.stub(editor, 'focus').callsFake(() => {
        expect(spy.calledOnce).to.be.true;
        const fake = spy.firstCall.returnValue;
        const style = getComputedStyle(fake);
        expect(style.position).to.equal('absolute');
        expect(style.left).to.equal('-9999px');
        expect(style.top).to.equal(`${document.documentElement.scrollTop}px`);
        done();
      });
      focusin(content);
    });

    (isFirefox ? it : it.skip)('should focus the fake target on mousedown when content is not focused', (done) => {
      const spy = sinon.spy(rte, '__createFakeFocusTarget');
      sinon.stub(editor, 'focus').callsFake(() => {
        expect(spy.calledOnce).to.be.true;
        const fake = spy.firstCall.returnValue;
        const style = getComputedStyle(fake);
        expect(style.position).to.equal('absolute');
        expect(style.left).to.equal('-9999px');
        expect(style.top).to.equal(`${document.documentElement.scrollTop}px`);
        done();
      });
      down(content);
    });
  });
});
