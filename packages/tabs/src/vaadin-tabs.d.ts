/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ListMixin } from '@vaadin/vaadin-list-mixin/vaadin-list-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Fired when the `items` property changes.
 */
export type TabsItemsChangedEvent = CustomEvent<{ value: Element[] }>;

/**
 * Fired when the `selected` property changes.
 */
export type TabsSelectedChangedEvent = CustomEvent<{ value: number }>;

export interface TabsCustomEventMap {
  'items-changed': TabsItemsChangedEvent;

  'selected-changed': TabsSelectedChangedEvent;
}

export interface TabsEventMap extends HTMLElementEventMap, TabsCustomEventMap {}

/**
 * `<vaadin-tabs>` is a Web Component for organizing and grouping content into sections.
 *
 * ```
 *   <vaadin-tabs selected="4">
 *     <vaadin-tab>Page 1</vaadin-tab>
 *     <vaadin-tab>Page 2</vaadin-tab>
 *     <vaadin-tab>Page 3</vaadin-tab>
 *     <vaadin-tab>Page 4</vaadin-tab>
 *   </vaadin-tabs>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|--------------------------------------
 * `back-button`     | Button for moving the scroll back
 * `tabs`            | The tabs container
 * `forward-button`  | Button for moving the scroll forward
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `orientation` | Tabs disposition, valid values are `horizontal` and `vertical`. | :host
 * `overflow` | It's set to `start`, `end`, none or both. | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 */
declare class Tabs extends ResizeMixin(ElementMixin(ListMixin(ThemableMixin(HTMLElement)))) {
  /**
   * The index of the selected tab.
   */
  selected: number | null | undefined;

  /**
   * Set tabs disposition. Possible values are `horizontal|vertical`
   */
  orientation: TabsOrientation;

  addEventListener<K extends keyof TabsEventMap>(
    type: K,
    listener: (this: Tabs, ev: TabsEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof TabsEventMap>(
    type: K,
    listener: (this: Tabs, ev: TabsEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tabs': Tabs;
  }
}

export { Tabs };
