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
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

export interface DashboardItem {
  /**
   * The id of the item.
   * The identifier should be unique among the dashboard items.
   * If a unique identifier is not provided, reassigning new item instances
   * to the dashboard while a widget is focused may cause the focus to be lost.
   */
  id?: unknown;

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
   * The id of the item.
   * The identifier should be unique among the dashboard items.
   * If a unique identifier is not provided, reassigning new item instances
   * to the dashboard while a widget is focused may cause the focus to be lost.
   */
  id?: unknown;

  /**
   * The title of the section
   */
  title?: string;

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
  item: TItem | DashboardSectionItem<TItem>;

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

/**
 * Fired when an item selected state changed
 */
export type DashboardItemSelectedChangedEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem | DashboardSectionItem<TItem>;
  value: boolean;
}>;

/**
 * Fired when an item move mode changed
 */
export type DashboardItemMoveModeChangedEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem | DashboardSectionItem<TItem>;
  value: boolean;
}>;

/**
 * Fired when an item resize mode changed
 */
export type DashboardItemResizeModeChangedEvent<TItem extends DashboardItem> = CustomEvent<{
  item: TItem;
  value: boolean;
}>;

export interface DashboardCustomEventMap<TItem extends DashboardItem> {
  'dashboard-item-moved': DashboardItemMovedEvent<TItem>;

  'dashboard-item-resized': DashboardItemResizedEvent<TItem>;

  'dashboard-item-removed': DashboardItemRemovedEvent<TItem>;

  'dashboard-item-selected-changed': DashboardItemSelectedChangedEvent<TItem>;

  'dashboard-item-move-mode-changed': DashboardItemMoveModeChangedEvent<TItem>;

  'dashboard-item-resize-mode-changed': DashboardItemResizeModeChangedEvent<TItem>;
}

export type DashboardEventMap<TItem extends DashboardItem> = DashboardCustomEventMap<TItem> & HTMLElementEventMap;

export interface DashboardI18n {
  selectWidget: string;
  selectSection: string;
  remove: string;
  resize: string;
  resizeApply: string;
  resizeShrinkWidth: string;
  resizeGrowWidth: string;
  resizeShrinkHeight: string;
  resizeGrowHeight: string;
  move: string;
  moveApply: string;
  moveForward: string;
  moveBackward: string;
}

/**
 * A responsive, grid-based dashboard layout component
 *
 * ### Quick Start
 *
 * Assign an array to the [`items`](#/elements/vaadin-dashboard#property-items) property.
 * Set a renderer function to the [`renderer`](#/elements/vaadin-dashboard#property-renderer) property.
 *
 * The widgets and the sections will be generated and configured based on the renderer and the items provided.
 *
 * ```html
 * <vaadin-dashboard></vaadin-dashboard>
 * ```
 *
 * ```js
 * const dashboard = document.querySelector('vaadin-dashboard');
 *
 * dashboard.items = [
 *   { title: 'Widget 1 title', content: 'Text 1', rowspan: 2 },
 *   { title: 'Widget 2 title', content: 'Text 2', colspan: 2 },
 *   {
 *     title: 'Section title',
 *     items: [{ title: 'Widget in section title', content: 'Text 3' }]
 *   },
 *   // ... more items
 * ];
 *
 * dashboard.renderer = (root, _dashboard, { item }) => {
 *   const widget = root.firstElementChild || document.createElement('vaadin-dashboard-widget');
 *   if (!root.contains(widget)) {
 *     root.appendChild(widget);
 *   }
 *   widget.widgetTitle = item.title;
 *   widget.textContent = item.content;
 * };
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available:
 *
 * Custom Property                     | Description
 * ------------------------------------|-------------
 * `--vaadin-dashboard-col-min-width`  | minimum column width of the dashboard
 * `--vaadin-dashboard-col-max-width`  | maximum column width of the dashboard
 * `--vaadin-dashboard-row-min-height` | minimum row height of the dashboard
 * `--vaadin-dashboard-col-max-count`  | maximum column count of the dashboard
 * `--vaadin-dashboard-gap`            | gap between child elements. Must be in length units (0 is not allowed, 0px is)
 * `--vaadin-dashboard-padding`        | space around the dashboard's outer edges. Must be in length units (0 is not allowed, 0px is)
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `editable`     | Set when the dashboard is editable.
 * `dense-layout` | Set when the dashboard is in dense mode.
 * `item-selected`| Set when an item is selected.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} dashboard-item-moved - Fired when an item was moved
 * @fires {CustomEvent} dashboard-item-resized - Fired when an item was resized
 * @fires {CustomEvent} dashboard-item-removed - Fired when an item was removed
 * @fires {CustomEvent} dashboard-item-selected-changed - Fired when an item selected state changed
 * @fires {CustomEvent} dashboard-item-move-mode-changed - Fired when an item move mode changed
 * @fires {CustomEvent} dashboard-item-resize-mode-changed - Fired when an item resize mode changed
 */
declare class Dashboard<TItem extends DashboardItem = DashboardItem> extends DashboardLayoutMixin(
  ElementMixin(ThemableMixin(HTMLElement)),
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
   *   selectSection: 'Select section for editing',
   *   selectWidget: 'Select widget for editing',
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
