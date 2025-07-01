import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { css, html, LitElement } from 'lit';
import { LumoInjectionMixin } from '../lumo-injection-mixin.js';
import { registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

class TestFoo extends LumoInjectionMixin(ThemableMixin(LitElement)) {
  static get is() {
    return 'test-foo';
  }

  static get version() {
    return '1.0.0';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      [part='content'] {
        transition: background-color 1ms linear;
        background-color: yellow;
      }
    `;
  }

  render() {
    return html`<div part="content">Content</div>`;
  }
}

customElements.define(TestFoo.is, TestFoo);

class TestBar extends LumoInjectionMixin(LitElement) {
  static get is() {
    return 'test-bar';
  }

  static get version() {
    return '1.0.0';
  }

  render() {
    return html`<test-foo></test-foo>`;
  }
}

customElements.define(TestBar.is, TestBar);

class TestBaz extends TestFoo {
  static get is() {
    return 'test-baz';
  }

  static get version() {
    return '1.0.0';
  }

  render() {
    return html`<div part="content">Baz Content</div>`;
  }
}

customElements.define(TestBaz.is, TestBaz);

const TEST_FOO_STYLES = `
  html, :host {
    --test-foo-lumo-inject: 1;
    --test-foo-lumo-inject-modules: lumo_foo, lumo_non-existing-module;
  }

  @media lumo_foo {
    [part='content'] {
      background-color: green;
    }
  }
`;

function createTestFooStyleSheet() {
  const path = import.meta.url.split('/').slice(0, -1).join('/');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${path}/lumo-injection-test-foo.css`;
  return link;
}

describe('Lumo injection', () => {
  let element, content;

  async function contentTransition() {
    // Use custom 1ms background transition on the content part to not
    // rely on global transitions used by StyleObserver under the hood.
    await oneEvent(content, 'transitionend');
  }

  function assertInjectedStyle() {
    // background-color: green
    expect(getComputedStyle(content).backgroundColor).to.equal('rgb(0, 128, 0)');
  }

  function assertBaseStyle() {
    // background-color: yellow
    expect(getComputedStyle(content).backgroundColor).to.equal('rgb(255, 255, 0)');
  }

  function assertThemeStyle() {
    // background-color: cyan
    expect(getComputedStyle(content).backgroundColor).to.equal('rgb(0, 255, 255)');
  }

  describe('in global scope', () => {
    describe('styles added after element is connected', () => {
      beforeEach(async () => {
        element = fixtureSync('<test-foo></test-foo>');
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');
      });

      it('should inject matching styles added to document using style tag', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        document.head.appendChild(style);

        await contentTransition();
        assertInjectedStyle();

        style.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to document using link element', async () => {
        const link = createTestFooStyleSheet();
        document.head.appendChild(link);

        await contentTransition();
        assertInjectedStyle();

        link.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to document using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        document.adoptedStyleSheets.push(sheet);

        await contentTransition();
        assertInjectedStyle();

        document.adoptedStyleSheets.pop();

        await contentTransition();
        assertBaseStyle();
      });
    });

    describe('styles added before element is connected', () => {
      beforeEach(() => {
        element = document.createElement('test-foo');
      });

      afterEach(() => {
        element.remove();
      });

      it('should inject matching styles added to document using style tag', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        document.head.appendChild(style);
        await nextRender();

        document.body.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');
        assertInjectedStyle();

        style.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to document using link element', async () => {
        const link = createTestFooStyleSheet();
        document.head.appendChild(link);
        await nextRender();

        document.body.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');
        assertInjectedStyle();

        link.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to document using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        document.adoptedStyleSheets.push(sheet);
        await nextRender();

        document.body.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertInjectedStyle();

        document.adoptedStyleSheets.pop();

        await contentTransition();
        assertBaseStyle();
      });
    });
  });

  describe('in shadow scope', () => {
    let host;

    beforeEach(() => {
      host = fixtureSync('<div></div>');
      host.attachShadow({ mode: 'open' });
      element = document.createElement('test-foo');
    });

    describe('styles added after element is connected', () => {
      beforeEach(async () => {
        host.shadowRoot.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');
      });

      it('should inject matching styles added to document using style tag when in shadow scope', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        document.head.appendChild(style);

        await contentTransition();
        assertInjectedStyle();

        style.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to document using link element when in shadow scope', async () => {
        const link = createTestFooStyleSheet();
        document.head.appendChild(link);

        await contentTransition();
        assertInjectedStyle();

        link.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to document using adoptedStyleSheets when in shadow scope', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        document.adoptedStyleSheets.push(sheet);

        await contentTransition();
        assertInjectedStyle();

        document.adoptedStyleSheets.pop();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to enclosing shadow root using style tag', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        host.shadowRoot.appendChild(style);

        await contentTransition();
        assertInjectedStyle();

        style.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to enclosing shadow root using link element', async () => {
        const link = createTestFooStyleSheet();
        host.shadowRoot.appendChild(link);

        await contentTransition();
        assertInjectedStyle();

        link.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to enclosing shadow root using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        host.shadowRoot.adoptedStyleSheets.push(sheet);

        await contentTransition();
        assertInjectedStyle();

        host.shadowRoot.adoptedStyleSheets.pop();

        await contentTransition();
        assertBaseStyle();
      });

      it('should not apply styles added to enclosing shadow root after moving to document', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        host.shadowRoot.appendChild(style);

        await contentTransition();
        assertInjectedStyle();

        document.body.appendChild(element);
        assertBaseStyle();

        host.shadowRoot.appendChild(element);
        assertInjectedStyle();
      });
    });

    describe('styles added before element is connected', () => {
      it('should inject matching styles added to enclosing shadow root using style tag', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        host.shadowRoot.appendChild(style);
        await nextRender();

        host.shadowRoot.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertInjectedStyle();

        style.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to enclosing shadow root using link element', async () => {
        const link = createTestFooStyleSheet();
        host.shadowRoot.appendChild(link);
        await nextRender();

        host.shadowRoot.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertInjectedStyle();

        link.remove();

        await contentTransition();
        assertBaseStyle();
      });

      it('should inject matching styles added to enclosing shadow root using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        host.shadowRoot.adoptedStyleSheets.push(sheet);
        await nextRender();

        host.shadowRoot.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertInjectedStyle();

        host.shadowRoot.adoptedStyleSheets.pop();

        await contentTransition();
        assertBaseStyle();
      });
    });
  });

  describe('nested component', () => {
    let host, wrapper, style;

    beforeEach(async () => {
      host = fixtureSync('<div></div>');
      host.attachShadow({ mode: 'open' });

      style = document.createElement('style');
      style.textContent = TEST_FOO_STYLES;
      host.shadowRoot.appendChild(style);
      await nextRender();

      wrapper = document.createElement('test-bar');
    });

    it('should inject matching styles added to parent shadow host', async () => {
      host.shadowRoot.appendChild(wrapper);
      await nextRender();

      element = wrapper.shadowRoot.querySelector('test-foo');
      content = element.shadowRoot.querySelector('[part="content"]');
      assertInjectedStyle();

      style.remove();

      await contentTransition();
      assertBaseStyle();
    });

    it('should inject matching styles after moving to parent shadow host', async () => {
      host.shadowRoot.appendChild(wrapper);
      await nextRender();

      element = wrapper.shadowRoot.querySelector('test-foo');
      content = element.shadowRoot.querySelector('[part="content"]');

      host.shadowRoot.appendChild(element);

      assertInjectedStyle();
    });
  });

  describe('extending class', () => {
    beforeEach(async () => {
      element = fixtureSync('<test-baz></test-baz>');
      await nextRender();
      content = element.shadowRoot.querySelector('[part="content"]');
    });

    it('should inject matching styles for the extending component', async () => {
      const style = document.createElement('style');
      style.textContent = TEST_FOO_STYLES.replaceAll('foo', 'baz');
      document.head.appendChild(style);

      await contentTransition();
      assertInjectedStyle();

      style.remove();

      await contentTransition();
      assertBaseStyle();
    });
  });

  describe('registerStyles', () => {
    let style;

    before(() => {
      // Suppress console warning
      Object.assign(window, { Vaadin: { suppressPostFinalizeStylesWarning: true } });
    });

    beforeEach(async () => {
      style = document.createElement('style');
      style.textContent = TEST_FOO_STYLES;
      document.head.appendChild(style);
      await nextRender();

      element = fixtureSync('<test-foo></test-foo>');
      await nextRender();
      content = element.shadowRoot.querySelector('[part="content"]');
    });

    afterEach(() => {
      style.remove();
    });

    it('should not remove styles from injected stylesheets when calling registerStyles()', () => {
      assertInjectedStyle();

      registerStyles(
        'test-foo',
        css`
          :host {
            color: white;
          }
        `,
      );

      assertInjectedStyle();
    });

    it('should override styles from injected stylesheets when calling registerStyles()', async () => {
      assertInjectedStyle();

      registerStyles(
        'test-foo',
        css`
          [part='content'] {
            background-color: cyan;
          }
        `,
      );

      await contentTransition();

      assertThemeStyle();
    });
  });
});
