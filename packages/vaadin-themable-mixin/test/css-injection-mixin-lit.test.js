import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { css, html, LitElement } from 'lit';
import { CssInjectionMixin } from '../css-injection-mixin.js';
import { registerStyles, ThemableMixin } from '../vaadin-themable-mixin.js';

class TestFoo extends CssInjectionMixin(ThemableMixin(LitElement)) {
  static get is() {
    return 'test-foo';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      [part='content'] {
        transition: background-color 1ms linear;
      }
    `;
  }

  render() {
    return html`<div part="content">Content</div>`;
  }
}

customElements.define(TestFoo.is, TestFoo);

class TestBar extends CssInjectionMixin(LitElement) {
  static get is() {
    return 'test-bar';
  }

  render() {
    return html`<test-foo></test-foo>`;
  }
}

customElements.define(TestBar.is, TestBar);

const TEST_FOO_STYLES = `
  html, :host {
    --test-foo-css-inject: 1;
  }

  @media test-foo {
    [part='content'] {
      background-color: green;
    }
  }
`;

function createTestFooStyleSheet() {
  const path = import.meta.url.split('/').slice(0, -1).join('/');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${path}/css-injection-test-foo.css`;
  return link;
}

describe('CSS injection', () => {
  let element, content;

  async function contentTransition() {
    // Use custom 1ms background transition on the content part to not
    // rely on global transitions used by StyleObserver under the hood.
    await oneEvent(content, 'transitionend');
  }

  function assertStyleApplies() {
    expect(getComputedStyle(content).backgroundColor).to.equal('rgb(0, 128, 0)');
  }

  function assertStyleDoesNotApply() {
    expect(getComputedStyle(content).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
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
        assertStyleApplies();

        style.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to document using link element', async () => {
        const link = createTestFooStyleSheet();
        document.head.appendChild(link);

        await contentTransition();
        assertStyleApplies();

        link.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to document using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        document.adoptedStyleSheets.push(sheet);

        await contentTransition();
        assertStyleApplies();

        document.adoptedStyleSheets.pop();

        await contentTransition();
        assertStyleDoesNotApply();
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
        assertStyleApplies();

        style.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to document using link element', async () => {
        const link = createTestFooStyleSheet();
        document.head.appendChild(link);
        await nextRender();

        document.body.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');
        assertStyleApplies();

        link.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to document using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        document.adoptedStyleSheets.push(sheet);
        await nextRender();

        document.body.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertStyleApplies();

        document.adoptedStyleSheets.pop();

        await contentTransition();
        assertStyleDoesNotApply();
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
        assertStyleApplies();

        style.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to document using link element when in shadow scope', async () => {
        const link = createTestFooStyleSheet();
        document.head.appendChild(link);

        await contentTransition();
        assertStyleApplies();

        link.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to document using adoptedStyleSheets when in shadow scope', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        document.adoptedStyleSheets.push(sheet);

        await contentTransition();
        assertStyleApplies();

        document.adoptedStyleSheets.pop();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to enclosing shadow root using style tag', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        host.shadowRoot.appendChild(style);

        await contentTransition();
        assertStyleApplies();

        style.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to enclosing shadow root using link element', async () => {
        const link = createTestFooStyleSheet();
        host.shadowRoot.appendChild(link);

        await contentTransition();
        assertStyleApplies();

        link.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to enclosing shadow root using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        host.shadowRoot.adoptedStyleSheets.push(sheet);

        await contentTransition();
        assertStyleApplies();

        host.shadowRoot.adoptedStyleSheets.pop();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should not apply styles added to enclosing shadow root after moving to document', async () => {
        const style = document.createElement('style');
        style.textContent = TEST_FOO_STYLES;
        host.shadowRoot.appendChild(style);

        await contentTransition();
        assertStyleApplies();

        document.body.appendChild(element);
        assertStyleDoesNotApply();

        host.shadowRoot.appendChild(element);
        assertStyleApplies();
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

        assertStyleApplies();

        style.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to enclosing shadow root using link element', async () => {
        const link = createTestFooStyleSheet();
        host.shadowRoot.appendChild(link);
        await nextRender();

        host.shadowRoot.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertStyleApplies();

        link.remove();

        await contentTransition();
        assertStyleDoesNotApply();
      });

      it('should inject matching styles added to enclosing shadow root using adoptedStyleSheets', async () => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(TEST_FOO_STYLES);
        host.shadowRoot.adoptedStyleSheets.push(sheet);
        await nextRender();

        host.shadowRoot.appendChild(element);
        await nextRender();
        content = element.shadowRoot.querySelector('[part="content"]');

        assertStyleApplies();

        host.shadowRoot.adoptedStyleSheets.pop();

        await contentTransition();
        assertStyleDoesNotApply();
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
      assertStyleApplies();

      style.remove();

      await contentTransition();
      assertStyleDoesNotApply();
    });

    it('should inject matching styles after moving to parent shadow host', async () => {
      host.shadowRoot.appendChild(wrapper);
      await nextRender();

      element = wrapper.shadowRoot.querySelector('test-foo');
      content = element.shadowRoot.querySelector('[part="content"]');

      host.shadowRoot.appendChild(element);

      assertStyleApplies();
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
      assertStyleApplies();

      registerStyles(
        'test-foo',
        css`
          :host {
            color: white;
          }
        `,
      );

      assertStyleApplies();
    });

    it('should override styles from injected stylesheets when calling registerStyles()', async () => {
      assertStyleApplies();

      registerStyles(
        'test-foo',
        css`
          [part='content'] {
            background-color: initial;
          }
        `,
      );

      await contentTransition();

      assertStyleDoesNotApply();
    });
  });
});
