/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';

/**
 * A mixin providing common accordion functionality.
 */
export declare function AccordionMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<AccordionMixinClass> & Constructor<KeyboardDirectionMixinClass> & T;

export declare class AccordionMixinClass {
  /**
   * The index of currently opened panel. First panel is opened by
   * default. Only one panel can be opened at the same time.
   * Setting null or undefined closes all the accordion panels.
   */
  opened: number | null;

  /**
   * The list of `<vaadin-accordion-panel>` child elements.
   * It is populated from the elements passed to the light DOM,
   * and updated dynamically when adding or removing panels.
   */
  readonly items: HTMLElement[];
}
