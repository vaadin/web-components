/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ScrollerMixin } from './vaadin-scroller-mixin.js';

/**
 * `<vaadin-scroller>` provides a simple way to enable scrolling when its content is overflowing.
 *
 * ```
 * <vaadin-scroller>
 *   <div>Content</div>
 * </vaadin-scroller>
 * ```
 * The following attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 * `overflow`   | Set to `top`, `bottom`, `start`, `end`, all of them, or none.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ScrollerMixin
 */
class Scroller extends ScrollerMixin(ElementMixin(ThemableMixin(CSSInjectionMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-scroller';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        overflow: auto;
      }

      :host([hidden]) {
        display: none !important;
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
    `;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @protected */
  ready() {
    super.ready();

    this.__overflowController = new OverflowController(this);
    this.addController(this.__overflowController);
  }
}

defineCustomElement(Scroller);

export { Scroller };
