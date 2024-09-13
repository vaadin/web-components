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
 * Fired when item reordering starts
 */
export type DashboardItemReorderStartEvent = CustomEvent;

/**
 * Fired when item reordering ends
 */
export type DashboardItemReorderEndEvent = CustomEvent;

/**
 * Fired when an items will be reordered by dragging
 */
export type DashboardItemDragReorderEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem | DashboardSectionItem<TItem>;
  targetIndex: number;
}>;

/**
 * Fired when item resizing starts
 */
export type DashboardItemResizeStartEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;
}>;

/**
 * Fired when item resizing ends
 */
export type DashboardItemResizeEndEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;
}>;

/**
 * Fired when an item will be resized by dragging
 */
export type DashboardItemDragResizeEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;
  colspan: number;
  rowspan: number;
}>;

/**
 * Fired when an item will be removed
 */
export type DashboardItemRemoveEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;
}>;

export interface DashboardCustomEventMap<TItem extends DashboardItem> {
  'dashboard-item-reorder-start': DashboardItemReorderStartEvent;

  'dashboard-item-reorder-end': DashboardItemReorderEndEvent;

  'dashboard-item-drag-reorder': DashboardItemDragReorderEvent<TItem>;

  'dashboard-item-resize-start': DashboardItemResizeStartEvent<TItem>;

  'dashboard-item-resize-end': DashboardItemResizeEndEvent<TItem>;

  'dashboard-item-drag-resize': DashboardItemDragResizeEvent<TItem>;

  'dashboard-item-remove': DashboardItemRemoveEvent<TItem>;
}

export type DashboardEventMap<TItem extends DashboardItem> = DashboardCustomEventMap<TItem> & HTMLElementEventMap;

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
   * Placing something else than a widget in the cell is not supported.
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
