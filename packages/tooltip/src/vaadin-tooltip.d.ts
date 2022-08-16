/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
 */
declare class Tooltip extends ThemePropertyMixin(ElementMixin(HTMLElement)) {
  /**
   * When true, the tooltip is controlled manually
   * instead of reacting to focus and mouse events.
   */
  manual: boolean;

  /**
   * When true, the tooltip is opened programmatically.
   * Only works if `manual` is set to `true`.
   */
  opened: boolean;

  /**
   * An HTML element to attach the tooltip to.
   * The target must be placed in the same shadow scope.
   * Defaults to an element referenced with `targetId`.
   */
  target: HTMLElement | undefined;

  /**
   * An id of the target element.
   * @attr {string} target-id
   */
  targetId: string | undefined;

  /**
   * String used for a tooltip content.
   */
  text: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
