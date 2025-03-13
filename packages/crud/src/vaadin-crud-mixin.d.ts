/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { GridFilterDefinition, GridSorterDefinition } from '@vaadin/grid/src/vaadin-grid.js';

export type CrudDataProviderCallback<T> = (items: T[], size?: number) => void;

export type CrudDataProviderParams = {
  page: number;
  pageSize: number;
  filters: GridFilterDefinition[];
  sortOrders: GridSorterDefinition[];
};

export type CrudDataProvider<T> = (params: CrudDataProviderParams, callback: CrudDataProviderCallback<T>) => void;

export type CrudEditorPosition = '' | 'aside' | 'bottom';

export interface CrudI18n {
  newItem?: string;
  editItem?: string;
  saveItem?: string;
  cancel?: string;
  deleteItem?: string;
  editLabel?: string;
  confirm?: {
    delete?: {
      title?: string;
      content?: string;
      button?: {
        confirm?: string;
        dismiss?: string;
      };
    };
    cancel?: {
      title?: string;
      content?: string;
      button?: {
        confirm?: string;
        dismiss?: string;
      };
    };
  };
}

/**
 * Fired when the `editorOpened` property changes.
 */
export type CrudEditorOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `editedItem` property changes.
 */
export type CrudEditedItemChangedEvent<T> = CustomEvent<{ value: T }>;

/**
 * Fired when the `items` property changes.
 */
export type CrudItemsChangedEvent<T> = CustomEvent<{ value: T[] }>;

/**
 * Fired when the `size` property changes.
 */
export type CrudSizeChangedEvent = CustomEvent<{ value: number }>;

/**
 * Fired when user wants to create a new item.
 */
export type CrudNewEvent = CustomEvent<{ item: null }>;

/**
 * Fired when user wants to edit an existing item.
 */
export type CrudEditEvent<T> = CustomEvent<{ item: T; index: number }>;

/**
 * Fired when user wants to delete item.
 */
export type CrudDeleteEvent<T> = CustomEvent<{ item: T }>;

/**
 * Fired when user discards edition.
 */
export type CrudCancelEvent<T> = CustomEvent<{ item: T }>;

/**
 * Fired when user wants to save a new or an existing item.
 */
export type CrudSaveEvent<T> = CustomEvent<{ item: T; new: boolean }>;

export type CrudCustomEventMap<T> = {
  'editor-opened-changed': CrudEditorOpenedChangedEvent;

  'edited-item-changed': CrudEditedItemChangedEvent<T>;

  'items-changed': CrudItemsChangedEvent<T>;

  'size-changed': CrudSizeChangedEvent;

  new: CrudNewEvent;

  cancel: CrudCancelEvent<T>;

  delete: CrudDeleteEvent<T>;

  edit: CrudEditEvent<T>;

  save: CrudSaveEvent<T>;
};

export type CrudEventMap<T> = CrudCustomEventMap<T> & HTMLElementEventMap;

/**
 * A mixin providing common crud functionality.
 */
export declare function CrudMixin<Item, T extends Constructor<HTMLElement> = Constructor<HTMLElement>>(
  base: T,
): Constructor<CrudMixinClass<Item>> & Constructor<I18nMixinClass<CrudI18n>> & T;

export declare class CrudMixinClass<Item> {
  /**
   * An array containing the items which will be stamped to the column template instances.
   */
  items: Item[] | null | undefined;

  /**
   * The item being edited in the dialog.
   */
  editedItem: Item | null | undefined;

  /**
   * Sets how editor will be presented on desktop screen.
   *
   * Accepted values are:
   *   - `` (default) - form will open as overlay
   *   - `bottom` - form will open below the grid
   *   - `aside` - form will open on the grid side (_right_, if lft and _left_ if rtl)
   * @attr {bottom|aside} editor-position
   */
  editorPosition: CrudEditorPosition;

  /**
   * Enables user to click on row to edit it.
   * Note: When enabled, auto-generated grid won't show the edit column.
   * @attr {boolean} edit-on-click
   */
  editOnClick: boolean;

  /**
   * Function that provides items lazily. Receives arguments `params`, `callback`
   *
   * `params.page` Requested page index
   * `params.pageSize` Current page size
   * `params.filters` Currently applied filters
   * `params.sortOrders` Currently applied sorting orders
   *
   * `callback(items, size)` Callback function with arguments:
   *   - `items` Current page of items
   *   - `size` Total number of items
   */
  dataProvider: CrudDataProvider<Item> | null | undefined;

  /**
   * Disable filtering when grid is autoconfigured.
   * @attr {boolean} no-filter
   */
  noFilter: boolean | null | undefined;

  /**
   * Disable sorting when grid is autoconfigured.
   * @attr {boolean} no-sort
   */
  noSort: boolean | null | undefined;

  /**
   * Remove grid headers when it is autoconfigured.
   * @attr {boolean} no-head
   */
  noHead: boolean | null | undefined;

  /**
   * A comma-separated list of fields to include in the generated grid and the generated editor.
   *
   * It can be used to explicitly define the field order.
   *
   * When it is defined [`exclude`](#/elements/vaadin-crud#property-exclude) is ignored.
   *
   * Default is undefined meaning that all properties in the object should be mapped to fields.
   */
  include: string | null | undefined;

  /**
   * A comma-separated list of fields to be excluded from the generated grid and the generated editor.
   *
   * When [`include`](#/elements/vaadin-crud#property-include) is defined, this parameter is ignored.
   *
   * Default is to exclude all private fields (those properties starting with underscore)
   */
  exclude: string | null | undefined;

  /**
   * Reflects the opened status of the editor.
   */
  editorOpened: boolean | null | undefined;

  /**
   * Number of items in the data set which is reported by the grid.
   * Typically it reflects the number of filtered items displayed in the grid.
   */
  readonly size: number | null | undefined;

  /**
   * Controls visibility state of toolbar.
   * When set to false toolbar is hidden and shown when set to true.
   * @attr {boolean} no-toolbar
   */
  noToolbar: boolean;

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   newItem: 'New item',
   *   editItem: 'Edit item',
   *   saveItem: 'Save',
   *   cancel: 'Cancel',
   *   deleteItem: 'Delete...',
   *   editLabel: 'Edit',
   *   confirm: {
   *     delete: {
   *       title: 'Confirm delete',
   *       content: 'Are you sure you want to delete the selected item? This action cannot be undone.',
   *       button: {
   *         confirm: 'Delete',
   *         dismiss: 'Cancel'
   *       }
   *     },
   *     cancel: {
   *       title: 'Unsaved changes',
   *       content: 'There are unsaved modifications to the item.',
   *       button: {
   *         confirm: 'Discard',
   *         dismiss: 'Continue editing'
   *       }
   *     }
   *   }
   * }
   * ```
   */
  i18n: CrudI18n;

  /**
   * A reference to all fields inside the [`_form`](#/elements/vaadin-crud#property-_form) element
   */
  protected readonly _fields: HTMLElement[];
}
