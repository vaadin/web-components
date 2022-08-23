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
   * Object with properties passed to `textGenerator`
   * function to be used for generating tooltip text.
   */
  context: Record<string, unknown>;

  /**
   * The id of the element used as a tooltip trigger.
   * The element should be in the DOM by the time when
   * the attribute is set, otherwise a warning is shown.
   */
  for: string | undefined;

  /**
   * When true, the tooltip is controlled programmatically
   * instead of reacting to focus and mouse events.
   */
  manual: boolean;

  /**
   * When true, the tooltip is opened programmatically.
   * Only works if `manual` is set to `true`.
   */
  opened: boolean;

  /**
   * Reference to the element used as a tooltip trigger.
   * The target must be placed in the same shadow scope.
   * Defaults to an element referenced with `for`.
   */
  target: HTMLElement | undefined;

  /**
   * String used as a tooltip content.
   */
  text: string | null | undefined;

  /**
   * Function used to generate the tooltip content.
   * When provided, it overrides the `text` property.
   * Use the `context` property to provide argument
   * that can be passed to the generator function.
   */
  textGenerator: (context: Record<string, unknown>) => string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tooltip': Tooltip;
  }
}

export { Tooltip };
