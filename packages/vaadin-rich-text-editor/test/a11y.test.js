import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { down, fixtureSync, focusin, isFirefox, keyboardEventFor } from '@vaadin/testing-helpers';
import '../vaadin-rich-text-editor.js';

describe('accessibility', () => {
  'use strict';

  const flushFormatAnnouncer = () => {
    rte.__debounceAnnounceFormatting && rte.__debounceAnnounceFormatting.flush();
  };

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  let rte, content, buttons, announcer, editor;

  beforeEach(() => {
    rte = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>');
    editor = rte._editor;
    buttons = Array.from(rte.shadowRoot.querySelectorAll(`[part=toolbar] button`));
    content = rte.shadowRoot.querySelector('[contenteditable]');
    announcer = rte.shadowRoot.querySelector('[aria-live=polite]');
  });

  describe('screen readers', () => {
    it('should have default titles for the buttons', () => {
      buttons.forEach((button, index) => {
        const expectedLabel = rte.i18n[Object.keys(rte.i18n)[index]];
        expect(button.getAttribute('title')).to.equal(expectedLabel);
      });
    });

    it('should localize titles for the buttons', () => {
      const defaultI18n = rte.i18n;

      const localized = {};
      Object.keys(defaultI18n).forEach((key) => (localized[key] = defaultI18n[key] + ' localized'));
      rte.i18n = localized;

      buttons.forEach((button, index) => {
        const expectedLabel = defaultI18n[Object.keys(defaultI18n)[index]] + ' localized';
        expect(button.getAttribute('title')).to.equal(expectedLabel);
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
      expect(result).to.be.false; // dispatchEvent returns false when preventDefault is called
    });

    it('should prevent keydown and focus the editor on tab', (done) => {
      sinon.stub(editor, 'focus').callsFake(done);
      const e = new CustomEvent('keydown', { bubbles: true });
      e.keyCode = 9;
      e.shiftKey = false;
      const result = buttons[0].dispatchEvent(e);
      expect(result).to.be.false; // dispatchEvent returns false when preventDefault is called
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
        expect(style.top).to.equal(document.documentElement.scrollTop + 'px');
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
        expect(style.top).to.equal(document.documentElement.scrollTop + 'px');
        done();
      });
      down(content);
    });
  });
});
