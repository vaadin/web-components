/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
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
 * @customElement vaadin-markdown
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes SlotStylesMixin
 */
class Markdown extends SlotStylesMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
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

  /** @protected */
  get slotStyles() {
    return [
      `
      @layer vaadin.base {
        ${this.localName} {
          line-height: 1.6;

          h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            line-height: 1.25;
            text-wrap: balance;
          }

          h1 {
            font-size: 1.75em;
            margin-top: 1.8em;
            margin-bottom: 0.9em;
          }

          h2 {
            font-size: 1.5em;
            margin-top: 1.6em;
            margin-bottom: 0.8em;
          }

          h3 {
            font-size: 1.25em;
            margin-top: 1.4em;
            margin-bottom: 0.7em;
          }

          h4 {
            font-size: 1.125em;
            margin-top: 1.2em;
            margin-bottom: 0.6em;
          }

          h5 {
            font-size: 1em;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }

          h6 {
            font-size: 0.875em;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }

          p, ul, ol, blockquote, table, figure {
            margin-inline: 0;
            margin-block: 1.25em;
          }

          code {
            font-family: ui-monospace, monospace;
            font-size: 0.9em;
            line-height: 1.25;
            font-weight: 500;

            &::before,
            &::after {
              content: "\`";
              color: var(--vaadin-text-color-secondary);
            }
          }

          pre {
            background-color: light-dark(var(--vaadin-text-color), var(--vaadin-background-container));
            border-radius: var(--vaadin-radius-m);
            color: light-dark(var(--vaadin-background-color), var(--vaadin-text-color));
            padding: var(--vaadin-padding-m);

            code {
              font-weight: 500;

              &::before,
              &::after {
                content: "";
              }
            }
          }

          hr {
            height: 0;
            border: 0;
            border-top: 1px solid var(--vaadin-border-color-secondary);
            margin-block: 3em;
          }

          b, strong {
            font-weight: 600;
          }

          blockquote {
            font-weight: 500;
            font-style: italic;
            border-left: 0.25rem solid var(--vaadin-border-color);
            quotes: "\\201C""\\201D""\\2018""\\2019";
            margin-inline: 0;
            padding-inline-start: 1em;
          }

          ul {
            list-style-type: disc;
          }

          ul, ol {
            padding-inline-start: 1.625em;
          }

          li {
            margin-block: 0.5em;
            padding-inline-start: 0.375em;

            &::marker {
              color: var(--vaadin-text-color-disabled);
            }
          }

          ol li::marker {
            font-weight: 400;
            color: var(--vaadin-text-color-secondary);
          }

          ul:has(> li > input[type="checkbox"]:first-child) {
            list-style: none;
            padding-inline-start: 0;
          }

          img, video, svg, canvas, audio, iframe, embed, object {
            display: block;
          }

          img, video {
            max-width: 100%;
            height: auto;
            border-radius: var(--vaadin-radius-m);
          }

          figcaption {
            font-size: 0.875em;
            line-height: 1.125;
            color: var(--vaadin-text-color-secondary);
            margin-top: 0.75em;
          }

          table {
            min-width: 100%;
            border-spacing: 0;
          }

          th {
            text-align: start;
            font-weight: 500;
            background: var(--vaadin-background-container);
          }

          th, td {
            padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
          }

          tr:not(:last-child) {
            th, td {
              border-bottom: 1px solid var(--vaadin-border-color-secondary);
            }
          }
        }
      }
      `,
    ];
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
