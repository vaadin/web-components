/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-dashboard-widget.js';
import './vaadin-dashboard-section.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import type { DashboardItemI18n } from './vaadin-dashboard-item-mixin.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

export interface DashboardItem {
  /**
   * The column span of the item
   */
  colspan?: number;

  /**
   * The row span of the item
   */
  rowspan?: number;
}

export interface DashboardSectionItem<TItem extends DashboardItem> {
  /**
   * The title of the section
   */
  title?: string | null;

  /**
   * The items of the section
   */
  items: TItem[];
}

export interface DashboardItemModel<TItem> {
  item: TItem;
}

export type DashboardRenderer<TItem extends DashboardItem> = (
  root: HTMLElement,
  owner: Dashboard<TItem>,
  model: DashboardItemModel<TItem>,
) => void;

/**
 * Fired when an item was moved
 */
export type DashboardItemMovedEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;

  items: Array<TItem | DashboardSectionItem<TItem>>;

  section: DashboardSectionItem<TItem> | undefined;
}>;

/**
 * Fired when an item was resized
 */
export type DashboardItemResizedEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;

  items: Array<TItem | DashboardSectionItem<TItem>>;
}>;

/**
 * Fired when an item was removed
 */
export type DashboardItemRemovedEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem | DashboardSectionItem<TItem>;

  items: Array<TItem | DashboardSectionItem<TItem>>;
}>;

export interface DashboardCustomEventMap<TItem extends DashboardItem> {
  'dashboard-item-moved': DashboardItemMovedEvent<TItem>;

  'dashboard-item-resized': DashboardItemResizedEvent<TItem>;

  'dashboard-item-removed': DashboardItemRemovedEvent<TItem>;
}

export type DashboardEventMap<TItem extends DashboardItem> = DashboardCustomEventMap<TItem> & HTMLElementEventMap;

export interface DashboardI18n extends DashboardItemI18n {}

/**
 * A responsive, grid-based dashboard layout component
 */
declare class Dashboard<TItem extends DashboardItem = DashboardItem> extends DashboardLayoutMixin(
  ElementMixin(HTMLElement),
) {
  /**
   * An array containing the items of the dashboard
   */
  items: Array<TItem | DashboardSectionItem<TItem>>;

  /**
   * Custom function for rendering a widget for each dashboard item.
   * Placing something else than a widget in the wrapper is not supported.
   * Receives three arguments:
   *
   * - `root` The container for the widget.
   * - `dashboard` The reference to the `<vaadin-dashboard>` element.
   * - `model` The object with the properties related with the rendered
   *   item, contains:
   *   - `model.item` The item.
   */
  renderer: DashboardRenderer<TItem> | null | undefined;

  /**
   * Whether the dashboard is editable.
   */
  editable: boolean;

  /**
   * The object used to localize this component.
   *
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * The object has the following structure and default values:
   * ```
   * {
   *   selectSectionTitleForEditing: 'Select section title for editing',
   *   selectWidgetTitleForEditing: 'Select widget title for editing',
   *   remove: 'Remove',
   *   resize: 'Resize',
   *   resizeApply: 'Apply',
   *   resizeShrinkWidth: 'Shrink width',
   *   resizeGrowWidth: 'Grow width',
   *   resizeShrinkHeight: 'Shrink height',
   *   resizeGrowHeight: 'Grow height',
   *   move: 'Move',
   *   moveApply: 'Apply',
   *   moveForward: 'Move Forward',
   *   moveBackward: 'Move Backward',
   * }
   * ```
   */
  i18n: DashboardI18n;

  addEventListener<K extends keyof DashboardEventMap<TItem>>(
    type: K,
    listener: (this: Dashboard, ev: DashboardEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DashboardEventMap<TItem>>(
    type: K,
    listener: (this: Dashboard, ev: DashboardEventMap<TItem>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard': Dashboard<DashboardItem>;
  }
}

export { Dashboard };
