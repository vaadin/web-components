/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-scroller>` provides a simple way to enable scrolling when its content is overflowing.
 *
 * ```
 * <vaadin-scroller>
 *   <div>Content</div>
 * </vaadin-scroller>
 * ```
 */
declare class Scroller extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   * This property indicates the scroll direction. Supported values are `vertical`, `horizontal`, `none`.
   * When `scrollDirection` is undefined scrollbars will be shown in both directions.
   */
  scrollDirection: 'horizontal' | 'vertical' | 'none' | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-scroller': Scroller;
  }
}

export { Scroller };
