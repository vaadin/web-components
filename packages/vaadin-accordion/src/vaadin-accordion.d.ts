import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { AccordionPanelElement } from './vaadin-accordion-panel.js';

/**
 * Fired when the `items` property changes.
 */
export type AccordionItemsChangedEvent = CustomEvent<{ value: AccordionPanelElement[] }>;

/**
 * Fired when the `opened` property changes.
 */
export type AccordionOpenedChangedEvent = CustomEvent<{ value: number | null }>;

export interface AccordionElementEventMap {
  'items-changed': AccordionItemsChangedEvent;

  'opened-changed': AccordionOpenedChangedEvent;
}

export type AccordionEventMap = HTMLElementEventMap & AccordionElementEventMap;

/**
 * `<vaadin-accordion>` is a Web Component implementing accordion widget —
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
 *     <div slot="summary">Panel 1</div>
 *     This panel is opened, so the text is visible by default.
 *   </vaadin-accordion-panel>
 *   <vaadin-accordion-panel>
 *     <div slot="summary">Panel 2</div>
 *     After opening this panel, the first one becomes closed.
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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 */
declare class AccordionElement extends ElementMixin(ThemableMixin(HTMLElement)) {
  readonly focused: Element | null;

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
  readonly items: AccordionPanelElement[];

  _filterItems(array: Element[]): AccordionPanelElement[];

  _onKeydown(event: KeyboardEvent): void;

  _getAvailableIndex(index: number, increment: number): number;

  addEventListener<K extends keyof AccordionEventMap>(
    type: K,
    listener: (this: AccordionElement, ev: AccordionEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof AccordionEventMap>(
    type: K,
    listener: (this: AccordionElement, ev: AccordionEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-accordion': AccordionElement;
  }
}

export { AccordionElement };
