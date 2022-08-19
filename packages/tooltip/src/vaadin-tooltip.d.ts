/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * `<vaadin-tooltip>` is a Web Component for creating tooltips.
 */
declare class Tooltip extends ThemePropertyMixin(ElementMixin(HTMLElement)) {
  /**
   * The id of the element used as a tooltip trigger.
   */
  for: string | undefined;

  /**
   * Reference to the element used as a tooltip trigger.
   * The target must be placed in the same shadow scope.
   * Defaults to an element referenced with `for`.
   */
  target: HTMLElement | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
