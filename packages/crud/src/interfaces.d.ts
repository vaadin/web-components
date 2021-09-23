import { GridFilter, GridSorter } from '@vaadin/vaadin-grid';

export type CrudDataProviderCallback<T> = (items: Array<T>, size?: number) => void;

export type CrudDataProviderParams = {
  page: number;
  pageSize: number;
  filters: Array<GridFilter>;
  sortOrders: Array<GridSorter>;
};

export type CrudDataProvider<T> = (params: CrudDataProviderParams, callback: CrudDataProviderCallback<T>) => void;

export type CrudEditorPosition = '' | 'bottom' | 'aside';

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
export type CrudItemsChangedEvent<T> = CustomEvent<{ value: Array<T> }>;

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
export type CrudEditEvent<T> = CustomEvent<{ item: T }>;

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

export type CrudElementEventMap<T> = {
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

export type CrudEventMap<T> = HTMLElementEventMap & CrudElementEventMap<T>;
