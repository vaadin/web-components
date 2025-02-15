import '../../vaadin-crud.js';
import type {
  Crud,
  CrudCancelEvent,
  CrudDeleteEvent,
  CrudEditedItemChangedEvent,
  CrudEditEvent,
  CrudEditorOpenedChangedEvent,
  CrudI18n,
  CrudItemsChangedEvent,
  CrudNewEvent,
  CrudSaveEvent,
  CrudSizeChangedEvent,
} from '../../vaadin-crud.js';
import type { CrudEdit } from '../../vaadin-crud-edit.js';
import type { CrudEditColumn } from '../../vaadin-crud-edit-column.js';

const assertType = <TExpected>(actual: TExpected) => actual;

type User = {
  name: {
    first: string;
    last: string;
  };
};

const genericCrud = document.createElement('vaadin-crud');
assertType<Crud>(genericCrud);

const crud = genericCrud as Crud<User>;

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
  assertType<number>(event.detail.index);
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

const edit: CrudEdit = document.createElement('vaadin-crud-edit');
assertType<boolean>(edit.disabled);

const column: CrudEditColumn = document.createElement('vaadin-crud-edit-column');
assertType<string>(column.ariaLabel);

// I18n
assertType<CrudI18n>({});
assertType<CrudI18n>({ cancel: 'cancel' });
assertType<CrudI18n>({ confirm: { cancel: { title: 'title' } } });
