/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { BoardRowMixin } from './vaadin-board-row-mixin.js';

/**
 * `<vaadin-board-row>` is a web component that together with `<vaadin-board>` component allows
 * to create flexible responsive layouts and build nice looking dashboard.
 *
 * Each row can contain up to four elements (fewer if colspan is used) and is automatically responsive.
 * The row changes between `large`, `medium` and `small` modes depending on the available width and
 * the set breakpoints.
 *
 * In `large` mode, typically all content is shown side-by-side, in `medium` half of the content is
 * side by side and in `small` mode, content is laid out vertically.
 *
 * The breakpoints can be set using custom CSS properties.
 * By default the breakpoints are `small: <600px`, `medium: < 960px`, `large >= 960px`.
 *
 * ```html
 * <vaadin-board>
 *   <vaadin-board-row>
 *     <div>This could be chart 1</div>
 *     <div>This could be chart 2</div>
 *     <div>This could be chart 3</div>
 *     <div>This could be chart 4</div>
 *   </vaadin-board-row>
 * </vaadin-board>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vaadin-board-width-small` | Determines the width where mode changes from `small` to `medium` | `600px`
 * `--vaadin-board-width-medium` | Determines the width where mode changes from `medium` to `large` | `960px`
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes BoardRowMixin
 */
class BoardRow extends BoardRowMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-flow: row wrap;
          align-items: stretch;
          --small-size: var(--vaadin-board-width-small, 600px);
          --medium-size: var(--vaadin-board-width-medium, 960px);
        }

        :host([hidden]) {
          display: none !important;
        }

        :host ::slotted(*) {
          box-sizing: border-box;
          flex-grow: 1;
          overflow: hidden;
        }
      </style>
      <slot id="insertionPoint"></slot>
    `;
  }

  static get is() {
    return 'vaadin-board-row';
  }
}

defineCustomElement(BoardRow);

export { BoardRow };
