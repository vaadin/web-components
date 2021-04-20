import '../../vaadin-crud';
import {
  CrudElement,
  CrudEditedItemChanged,
  CrudEditorOpenedChanged,
  CrudCancel,
  CrudDelete,
  CrudEdit,
  CrudItemsChanged,
  CrudNew,
  CrudSave,
  CrudSizeChanged
} from '../../vaadin-crud';

const assertType = <TExpected>(actual: TExpected) => actual;

type User = {
  name: {
    first: string;
    last: string;
  };
};

const crud: CrudElement<User> = document.createElement('vaadin-crud');

crud.addEventListener('editor-opened-changed', (event) => {
  assertType<CrudEditorOpenedChanged>(event);
});

crud.addEventListener('edited-item-changed', (event) => {
  assertType<CrudEditedItemChanged<User>>(event);
});

crud.addEventListener('items-changed', (event) => {
  assertType<CrudItemsChanged<User>>(event);
});

crud.addEventListener('size-changed', (event) => {
  assertType<CrudSizeChanged>(event);
});

crud.addEventListener('new', (event) => {
  assertType<CrudNew>(event);
});

crud.addEventListener('edit', (event) => {
  assertType<CrudEdit<User>>(event);
});

crud.addEventListener('delete', (event) => {
  assertType<CrudDelete<User>>(event);
});

crud.addEventListener('cancel', (event) => {
  assertType<CrudCancel<User>>(event);
});

crud.addEventListener('save', (event) => {
  assertType<CrudSave<User>>(event);
});
