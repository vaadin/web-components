/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-scroller>` provides a simple way to enable scrolling when its content is overflowing.
 *
 * ```
 * <vaadin-scroller>
 *   <div>Content</div>
 * </vaadin-scroller>
 * ```
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Scroller extends FocusMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host([hidden]) {
          display: none !important;
        }

        :host {
          display: block;
          overflow: auto;
        }

        :host([scroll-direction='vertical']) {
          overflow-x: hidden;
        }

        :host([scroll-direction='horizontal']) {
          overflow-y: hidden;
        }

        :host([scroll-direction='none']) {
          overflow: hidden;
        }
      </style>

      <slot></slot>
    `;
  }

  static get is() {
    return 'vaadin-scroller';
  }

  static get properties() {
    return {
      /**
       * This property indicates the scroll direction. Supported values are `vertical`, `horizontal`, `none`.
       * When `scrollDirection` is undefined scrollbars will be shown in both directions.
       */
      scrollDirection: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
       * @protected
       */
      tabindex: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Override method inherited from `FocusMixin` to mark the scroller as focused
   * only when the host is focused.
   * @param {Event} event
   * @return {boolean}
   * @protected
   */
  _shouldSetFocus(event) {
    return event.target === this;
  }
}

customElements.define(Scroller.is, Scroller);

export { Scroller };
