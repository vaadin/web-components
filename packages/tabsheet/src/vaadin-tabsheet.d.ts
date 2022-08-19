/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import type { Tab } from '@vaadin/tabs/src/vaadin-tab.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type TabSheetOrientation = 'horizontal' | 'vertical';

/**
 * Fired when the `items` property changes.
 */
export type TabSheetItemsChangedEvent = CustomEvent<{ value: Tab[] }>;

/**
 * Fired when the `selected` property changes.
 */
export type TabSheetSelectedChangedEvent = CustomEvent<{ value: number }>;

export interface TabSheetCustomEventMap {
  'items-changed': TabSheetItemsChangedEvent;

  'selected-changed': TabSheetSelectedChangedEvent;
}

export interface TabSheetEventMap extends HTMLElementEventMap, TabSheetCustomEventMap {}

/**
 * `<vaadin-tabsheet>` is a Web Component for organizing and grouping content
 * into scrollable panels. The panels can be switched between by using tabs.
 *
 * ```
 *  <vaadin-tabsheet>
 *    <div slot="prefix">Prefix</div>
 *    <div slot="suffix">Suffix</div>
 *
 *    <vaadin-tabs slot="tabs">
 *      <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
 *      <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
 *      <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
 *    </vaadin-tabs>
 *
 *    <div tab="tab-1">Panel 1</div>
 *    <div tab="tab-2">Panel 2</div>
 *    <div tab="tab-3">Panel 3</div>
 *  </vaadin-tabsheet>
 * ```
 *
 * ### Styling
 *
 * TODO: Styling and theme variants to be implemented separately
 *
 * See [Styling Components](hhttps://vaadin.com/docs/latest/components/ds-resources/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 */
declare class TabSheet extends ControllerMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  /**
   * The index of the selected tab.
   */
  selected: number | null | undefined;

  /**
   * The tabsheet's orientation. Possible values are `horizontal|vertical`
   */
  orientation: TabSheetOrientation;

  /**
   * The list of `<vaadin-tab>`s from which a selection can be made.
   * It is populated from the elements passed inside the slotted
   * `<vaadin-tabs>`, and updated dynamically when adding or removing items.
   *
   * Note: unlike `<vaadin-combo-box>`, this property is read-only.
   */
  readonly items: Tab[] | undefined;

  addEventListener<K extends keyof TabSheetEventMap>(
    type: K,
    listener: (this: TabSheet, ev: TabSheetEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof TabSheetEventMap>(
    type: K,
    listener: (this: TabSheet, ev: TabSheetEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-tabsheet': TabSheet;
  }
}

export { TabSheet };
