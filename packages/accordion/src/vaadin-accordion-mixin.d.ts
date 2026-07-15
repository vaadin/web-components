/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
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
   * The ARIA heading level applied to every panel heading, used to set
   * the `aria-level` attribute on the `<vaadin-accordion-heading>` element
   * of each panel.
   *
   * By default, no `aria-level` is set and the headings are announced by
   * screen readers using their default level. Set this property to expose
   * the headings at the level that matches the surrounding page structure.
   *
   * @attr {number} heading-level
   */
  headingLevel: number | null | undefined;

  /**
   * The list of `<vaadin-accordion-panel>` child elements.
   * It is populated from the elements passed to the light DOM,
   * and updated dynamically when adding or removing panels.
   */
  readonly items: HTMLElement[];
}
