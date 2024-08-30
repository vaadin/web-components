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
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard': Dashboard<DashboardItem>;
  }
}

export { Dashboard };
