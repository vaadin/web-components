/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { renderMarkdownToElement } from './markdown-helpers.js';

/**
 * `<vaadin-markdown>` is a web component for rendering Markdown content.
 * It takes Markdown source as input and renders the corresponding HTML.
 *
 * ### Styling
 *
 * The component does not have specific shadow DOM parts for styling the rendered Markdown content itself,
 * as the content is rendered directly into the component's light DOM via a slot.
 * You can style the rendered HTML elements using standard CSS selectors targeting the `vaadin-markdown` element.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Markdown extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-markdown';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The Markdown content.
       *
       * @type {string}
       */
      content: {
        type: String,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    if (props.has('content')) {
      renderMarkdownToElement(this, this.content);
    }
  }
}

defineCustomElement(Markdown);

export { Markdown };
