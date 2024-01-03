/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { AccordionMixin } from './vaadin-accordion-mixin.js';
import type { AccordionPanel } from './vaadin-accordion-panel.js';

/**
 * Fired when the `items` property changes.
 */
export type AccordionItemsChangedEvent = CustomEvent<{ value: AccordionPanel[] }>;

/**
 * Fired when the `opened` property changes.
 */
export type AccordionOpenedChangedEvent = CustomEvent<{ value: number | null }>;

export interface AccordionCustomEventMap {
  'items-changed': AccordionItemsChangedEvent;

  'opened-changed': AccordionOpenedChangedEvent;
}

export type AccordionEventMap = AccordionCustomEventMap & HTMLElementEventMap;

/**
 * `<vaadin-accordion>` is a Web Component implementing accordion widget:
 * a vertically stacked set of expandable panels. The component should be
 * used as a wrapper for two or more `<vaadin-accordion-panel>` components.
 *
 * Panel headings function as controls that enable users to open (expand)
 * or hide (collapse) their associated sections of content. The user can
 * toggle panels by mouse click, Enter and Space keys.
 *
 * Only one panel can be opened at a time, opening a new one forces
 * previous panel to close and hide its content.
 *
 * ```
 * <vaadin-accordion>
 *   <vaadin-accordion-panel>
 *     <vaadin-accordion-heading slot="summary">Panel 1</vaadin-accordion-heading>
 *     <div>This panel is opened, so the text is visible by default.</div>
 *   </vaadin-accordion-panel>
 *   <vaadin-accordion-panel>
 *     <vaadin-accordion-heading slot="summary">Panel 2</vaadin-accordion-heading>
 *     <div>After opening this panel, the first one becomes closed.</div>
 *   </vaadin-accordion-panel>
 * </vaadin-accordion>
 * ```
 *
 * ### Styling
 *
 * See the [`<vaadin-accordion-panel>`](#/elements/vaadin-accordion-panel)
 * documentation for the available state attributes and stylable shadow parts.
 *
 * **Note:** You can apply the theme to `<vaadin-accordion>` component itself,
 * especially by using the following CSS selector:
 *
 * ```
 * :host ::slotted(vaadin-accordion-panel) {
 *   margin-bottom: 5px;
 * }
 * ```
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class Accordion extends AccordionMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof AccordionEventMap>(
    type: K,
    listener: (this: Accordion, ev: AccordionEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof AccordionEventMap>(
    type: K,
    listener: (this: Accordion, ev: AccordionEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-accordion': Accordion;
  }
}

export { Accordion };
