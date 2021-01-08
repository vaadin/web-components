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
export type CrudEditorOpenedChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `items` property changes.
 */
export type CrudItemsChanged<T> = CustomEvent<{ value: Array<T> }>;

/**
 * Fired when the `size` property changes.
 */
export type CrudSizeChanged = CustomEvent<{ value: number }>;

/**
 * Fired when user wants to create a new item.
 */
export type CrudNew = CustomEvent<{ item: null }>;

/**
 * Fired when user wants to edit an existing item.
 */
export type CrudEdit<T> = CustomEvent<{ item: T }>;

/**
 * Fired when user wants to delete item.
 */
export type CrudDelete<T> = CustomEvent<{ item: T }>;

/**
 * Fired when user discards edition.
 */
export type CrudCancel<T> = CustomEvent<{ item: T }>;

/**
 * Fired when user wants to save a new or an existing item.
 */
export type CrudSave<T> = CustomEvent<{ item: T; new: boolean }>;

export type CrudElementEventMap<T> = {
  'editor-opened-changed': CrudEditorOpenedChanged;

  'items-changed': CrudItemsChanged<T>;

  'size-changed': CrudSizeChanged;

  'new': CrudNew;

  'cancel': CrudCancel<T>;

  'delete': CrudDelete<T>;

  'edit': CrudEdit<T>;

  'save': CrudSave<T>;
}

export type CrudEventMap<T> = HTMLElementEventMap & CrudElementEventMap<T>;
