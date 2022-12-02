/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import type { GridFilterDefinition, GridSorterDefinition } from '@vaadin/grid/src/vaadin-grid.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
  newItem: string;
  editItem: string;
  saveItem: string;
  cancel: string;
  deleteItem: string;
  editLabel: string;
  confirm: {
    delete: {
      title: string;
      content: string;
      button: {
        confirm: string;
        dismiss: string;
      };
    };
    cancel: {
      title: string;
      content: string;
      button: {
        confirm: string;
        dismiss: string;
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
 * `<vaadin-crud>` is a Web Component for [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations.
 *
 * ### Quick Start
 *
 * Assign an array to the [`items`](#/elements/vaadin-crud#property-items) property.
 *
 * A grid and an editor will be automatically generated and configured based on the data structure provided.
 *
 * ```html
 * <vaadin-crud></vaadin-crud>
 * ```
 *
 * ```js
 * const crud = document.querySelector('vaadin-crud');
 *
 * crud.items = [
 *   { name: 'John', surname: 'Lennon', role: 'singer' },
 *   { name: 'Ringo', surname: 'Starr', role: 'drums' },
 *   // ... more items
 * ];
 * ```
 *
 * ### Data Provider Function
 *
 * Otherwise, you can provide a [`dataProvider`](#/elements/vaadin-crud#property-dataProvider) function.
 *
 * ```js
 * const crud = document.querySelector('vaadin-crud');
 *
 * const users = [
 *   { name: 'John', surname: 'Lennon', role: 'singer' },
 *   { name: 'Ringo', surname: 'Starr', role: 'drums' },
 *   // ... more items
 * ];
 *
 * crud.dataProvider = (params, callback) => {
 *   const chunk = users.slice(params.page * params.pageSize, params.page * params.pageSize + params.pageSize);
 *   callback(chunk, people.length);
 * };
 * ```
 *
 * NOTE: The auto-generated editor only supports string types. If you need to handle special cases
 * customizing the editor is discussed below.
 *
 * ### Customization
 *
 * Alternatively you can fully configure the component by using `slot` names.
 *
 * Slot name      | Description
 * ---------------|----------------
 * `grid`         | To replace the auto-generated grid with a custom one.
 * `form`         | To replace the auto-generated form.
 * `save-button`  | To replace the "Save" button.
 * `cancel-button`| To replace the "Cancel" button.
 * `delete-button`| To replace the "Delete" button.
 * `toolbar`      | To replace the toolbar content. Add an element with the attribute `new-button` for the new item action.
 *
 * #### Example:
 *
 * ```html
 * <vaadin-crud id="crud">
 *   <vaadin-grid slot="grid">
 *     <vaadin-crud-edit-column></vaadin-crud-edit-column>
 *     <vaadin-grid-column id="column1"></vaadin-grid-column>
 *     <vaadin-grid-column id="column2"></vaadin-grid-column>
 *   </vaadin-grid>
 *
 *   <vaadin-form-layout slot="form">
 *     <vaadin-text-field label="First" path="name"></vaadin-text-field>
 *     <vaadin-text-field label="Surname" path="surname"></vaadin-text-field>
 *   </vaadin-form-layout>
 *
 *   <div slot="toolbar">
 *     Total singers: [[size]]
 *     <button new-button>New singer</button>
 *   </div>
 *
 *   <button slot="save-button">Save changes</button>
 *   <button slot="cancel-button">Discard changes</button>
 *   <button slot="delete-button">Delete singer</button>
 * </vaadin-crud>
 * ```
 * ```js
 * const crud = document.querySelector('#crud');
 *
 * const column1 = document.querySelector('#column1');
 * column1.headerRenderer = (root, column) => {
 *   root.textContent = 'Name';
 * };
 * column1.renderer = (root, column, model) => {
 *   root.textContent = model.item.name;
 * };
 *
 * const column2 = document.querySelector('#column2');
 * column2.headerRenderer = (root, column) => {
 *   root.textContent = 'Surname';
 * };
 * column2.renderer = (root, column, model) => {
 *   root.textContent = model.item.surname;
 * };
 *
 * crud.items = [
 *   { name: 'John', surname: 'Lennon', role: 'singer' },
 *   { name: 'Ringo', surname: 'Starr', role: 'drums' },
 *   // ... more items
 * ];
 * ```
 *
 * ### Helpers
 *
 * The following elements are used to auto-configure the grid and the editor
 * - [`<vaadin-crud-edit-column>`](#/elements/vaadin-crud-edit-column)
 * - `<vaadin-crud-grid>` - can be replaced with custom [`<vaadin-grid>`](#/elements/vaadin-grid)
 * - `<vaadin-crud-form>` - can be replaced with custom [`<vaadin-form-layout>`](#/elements/vaadin-form-layout)
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `toolbar` | Toolbar container at the bottom. By default it contains the the `new` button
 *
 * The following custom properties are available:
 *
 * Custom Property | Description | Default
 * ----------------|----------------
 * --vaadin-crud-editor-max-height | max height of editor when opened on the bottom | 40%
 * --vaadin-crud-editor-max-width | max width of editor when opened on the side | 40%
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} editor-opened-changed - Fired when the `editorOpened` property changes.
 * @fires {CustomEvent} edited-item-changed - Fired when `editedItem` property changes.
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} size-changed - Fired when the `size` property changes.
 * @fires {CustomEvent} new - Fired when user wants to create a new item.
 * @fires {CustomEvent} edit - Fired when user wants to edit an existing item.
 * @fires {CustomEvent} delete - Fired when user wants to delete item.
 * @fires {CustomEvent} save - Fired when user wants to save a new or an existing item.
 * @fires {CustomEvent} cancel - Fired when user discards edition.
 */
declare class Crud<Item> extends ControllerMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * A reference to all fields inside the [`_form`](#/elements/vaadin-crud#property-_form) element
   */
  readonly _fields: HTMLElement[];

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
   * The object used to localize this component.
   * For changing the default localization, change the entire
   * _i18n_ object or just the property you want to modify.
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

  addEventListener<K extends keyof CrudEventMap<Item>>(
    type: K,
    listener: (this: Crud<Item>, ev: CrudEventMap<Item>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof CrudEventMap<Item>>(
    type: K,
    listener: (this: Crud<Item>, ev: CrudEventMap<Item>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud': Crud<any>;
  }
}

export { Crud };
