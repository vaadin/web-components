import '../../vaadin-crud.js';
import {
  Crud,
  CrudCancelEvent,
  CrudDeleteEvent,
  CrudEditedItemChangedEvent,
  CrudEditEvent,
  CrudEditorOpenedChangedEvent,
  CrudItemsChangedEvent,
  CrudNewEvent,
  CrudSaveEvent,
  CrudSizeChangedEvent,
} from '../../vaadin-crud.js';

const assertType = <TExpected>(actual: TExpected) => actual;

type User = {
  name: {
    first: string;
    last: string;
  };
};

const crud: Crud<User> = document.createElement('vaadin-crud');

crud.addEventListener('editor-opened-changed', (event) => {
  assertType<CrudEditorOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

crud.addEventListener('edited-item-changed', (event) => {
  assertType<CrudEditedItemChangedEvent<User>>(event);
  assertType<User>(event.detail.value);
});

crud.addEventListener('items-changed', (event) => {
  assertType<CrudItemsChangedEvent<User>>(event);
  assertType<User[]>(event.detail.value);
});

crud.addEventListener('size-changed', (event) => {
  assertType<CrudSizeChangedEvent>(event);
  assertType<number>(event.detail.value);
});

crud.addEventListener('new', (event) => {
  assertType<CrudNewEvent>(event);
  assertType<null>(event.detail.item);
});

crud.addEventListener('edit', (event) => {
  assertType<CrudEditEvent<User>>(event);
  assertType<User>(event.detail.item);
});

crud.addEventListener('delete', (event) => {
  assertType<CrudDeleteEvent<User>>(event);
  assertType<User>(event.detail.item);
});

crud.addEventListener('cancel', (event) => {
  assertType<CrudCancelEvent<User>>(event);
  assertType<User>(event.detail.item);
});

crud.addEventListener('save', (event) => {
  assertType<CrudSaveEvent<User>>(event);
  assertType<User>(event.detail.item);
  assertType<boolean>(event.detail.new);
});
