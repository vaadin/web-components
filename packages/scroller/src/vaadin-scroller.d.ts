/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
 * The following attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 */
declare class Scroller extends FocusMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  /**
   * This property indicates the scroll direction. Supported values are `vertical`, `horizontal`, `none`.
   * When `scrollDirection` is undefined scrollbars will be shown in both directions.
   */
  scrollDirection: 'horizontal' | 'vertical' | 'none' | undefined;

  /**
   * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
   */
  tabindex: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-scroller': Scroller;
  }
}

export { Scroller };
