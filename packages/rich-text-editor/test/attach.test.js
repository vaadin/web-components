import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-rich-text-editor.js';

describe('attach/detach', () => {
  let rte, editor;

  const flushValueDebouncer = () => rte.__debounceSetValue && rte.__debounceSetValue.flush();

  async function attach(shadow = false) {
    const parent = fixtureSync('<div></div>');
    if (shadow) {
      parent.attachShadow({ mode: 'open' });
    }
    parent.appendChild(rte);
    await nextRender();
    flushValueDebouncer();
  }

  beforeEach(async () => {
    rte = fixtureSync('<vaadin-rich-text-editor></vaaddin-rich-text-editor>');
    await nextRender();
    flushValueDebouncer();
    editor = rte._editor;
  });

  describe('detach and re-attach', () => {
    it('should disconnect the emitter when detached', () => {
      const spy = sinon.spy(editor.emitter, 'disconnect');

      rte.parentNode.removeChild(rte);

      expect(spy).to.be.calledOnce;
    });

    it('should re-connect the emitter when detached and re-attached', async () => {
      const parent = rte.parentNode;
      parent.removeChild(rte);

      const spy = sinon.spy(editor.emitter, 'connect');

      parent.appendChild(rte);
      await nextUpdate(rte);

      expect(spy).to.be.calledOnce;
    });

    it('should parse htmlValue correctly when element is attached but not rendered', async () => {
      await attach(true);
      rte.dangerouslySetHtmlValue('<p>Foo</p><ul><li>Bar</li><li>Baz</li></ul>');
      rte.parentNode.shadowRoot.innerHTML = '<slot></slot>';
      await nextRender();
      await nextRender();
      flushValueDebouncer();
      expect(rte.htmlValue).to.equal('<p>Foo</p><ul><li>Bar</li><li>Baz</li></ul>');
    });
  });

  describe('unattached rich text editor', () => {
    beforeEach(() => {
      rte = document.createElement('vaadin-rich-text-editor');
    });

    it('should not throw when setting html value', () => {
      expect(() => rte.dangerouslySetHtmlValue('<h1>Foo</h1>')).to.not.throw(Error);
    });

    it('should have the html value once attached', async () => {
      rte.dangerouslySetHtmlValue('<h1>Foo</h1>');
      await attach();

      expect(rte.htmlValue).to.equal('<h1>Foo</h1>');
    });

    it('should override the htmlValue', async () => {
      rte.dangerouslySetHtmlValue('<h1>Foo</h1>');
      rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
      await attach();

      expect(rte.htmlValue).to.equal('<p>Vaadin</p>');
    });

    it('should override the value', async () => {
      rte.value = JSON.stringify([{ insert: 'Vaadin' }]);
      rte.dangerouslySetHtmlValue('<h1>Foo</h1>');
      await attach();

      expect(rte.htmlValue).to.equal('<h1>Foo</h1>');
    });
  });
});
