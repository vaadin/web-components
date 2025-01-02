/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectListMixin } from './vaadin-multi-select-list-mixin.js';

/**
 * Fired when the `items` property changes.
 */
export type ListBoxItemsChangedEvent = CustomEvent<{ value: Element[] }>;

/**
 * Fired when the `selected` property changes.
 */
export type ListBoxSelectedChangedEvent = CustomEvent<{ value: number }>;

/**
 * Fired when the `selectedValues` property changes.
 */
export type ListBoxSelectedValuesChangedEvent = CustomEvent<{ value: number[] }>;

export interface ListBoxCustomEventMap {
  'items-changed': ListBoxItemsChangedEvent;

  'selected-changed': ListBoxSelectedChangedEvent;

  'selected-values-changed': ListBoxSelectedValuesChangedEvent;
}

export interface ListBoxEventMap extends HTMLElementEventMap, ListBoxCustomEventMap {}

/**
 * `<vaadin-list-box>` is a Web Component for creating menus.
 *
 * ```
 *   <vaadin-list-box selected="2">
 *     <vaadin-item>Item 1</vaadin-item>
 *     <vaadin-item>Item 2</vaadin-item>
 *     <vaadin-item>Item 3</vaadin-item>
 *     <vaadin-item>Item 4</vaadin-item>
 *   </vaadin-list-box>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|------------------------
 * `items`           | The items container
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 * @fires {CustomEvent} selected-values-changed - Fired when the `selectedValues` property changes.
 */
declare class ListBox extends MultiSelectListMixin(ThemableMixin(ElementMixin(ControllerMixin(HTMLElement)))) {
  focused: Element | null;

  addEventListener<K extends keyof ListBoxEventMap>(
    type: K,
    listener: (this: ListBox, ev: ListBoxEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof ListBoxEventMap>(
    type: K,
    listener: (this: ListBox, ev: ListBoxEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-list-box': ListBox;
  }
}

export { ListBox };
