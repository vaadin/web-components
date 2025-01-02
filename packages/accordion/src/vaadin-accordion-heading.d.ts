/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * The accordion heading element.
 *
 * `vaadin-accordion-heading` is the element for the headings in the accordion.
 * As recommended by the WAI ARIA Best Practices, each heading needs to wrap a
 * `<button>`. This element puts that button in the Shadow DOM, as it is more
 * convenient to use and doesn't make styling of the heading more problematic.
 *
 * The WAI ARIA Best Practices also recommend setting `aria-level` depending
 * on what level the headings are. It is hard to determine the level of a heading
 * algorithmically, and setting it is not strictly required to have an accessible
 * accordion. To keep things easier to use, this element does not set `aria-level`
 * attribute but leaves that to the developer creating an accordion.
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name  | Description
 * -----------|-------------------
 * `toggle`   | The icon element
 * `content`  | The content wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `active`     | Set when the element is pressed down, either with mouse, touch or the keyboard.
 * `opened`     | Set when the collapsible content is expanded and visible.
 * `disabled`   | Set when the element is disabled.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class AccordionHeading extends ActiveMixin(DirMixin(ThemableMixin(HTMLElement))) {
  /**
   * When true, the element is opened.
   */
  opened: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-accordion-heading': AccordionHeading;
  }
}

export { AccordionHeading };
