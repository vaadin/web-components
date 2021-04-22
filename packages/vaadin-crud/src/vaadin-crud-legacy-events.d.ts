import {
  CrudCancelEvent,
  CrudDeleteEvent,
  CrudEditedItemChangedEvent,
  CrudEditEvent,
  CrudEditorOpenedChangedEvent,
  CrudItemsChangedEvent,
  CrudNewEvent,
  CrudSaveEvent,
  CrudSizeChangedEvent
} from './interfaces.js';

/**
 * @deprecated Please use `CrudEditorOpenedChangedEvent` instead.
 */
export type CrudEditorOpenedChanged = CrudEditorOpenedChangedEvent;

/**
 * @deprecated Please use `CrudEditedItemChangedEvent` instead.
 */
export type CrudEditedItemChanged<T> = CrudEditedItemChangedEvent<T>;

/**
 * @deprecated Please use `CrudItemsChangedEvent` instead.
 */
export type CrudItemsChanged<T> = CrudItemsChangedEvent<T>;

/**
 * @deprecated Please use `CrudSizeChangedEvent` instead.
 */
export type CrudSizeChanged = CrudSizeChangedEvent;

/**
 * @deprecated Please use `CrudNewEvent` instead.
 */
export type CrudNew = CrudNewEvent;

/**
 * @deprecated Please use `CrudEditEvent` instead.
 */
export type CrudEdit<T> = CrudEditEvent<T>;

/**
 * @deprecated Please use `CrudDeleteEvent` instead.
 */
export type CrudDelete<T> = CrudDeleteEvent<T>;

/**
 * @deprecated Please use `CrudCancelEvent` instead.
 */
export type CrudCancel<T> = CrudCancelEvent<T>;

/**
 * @deprecated Please use `CrudSaveEvent` instead.
 */
export type CrudSave<T> = CrudSaveEvent<T>;
