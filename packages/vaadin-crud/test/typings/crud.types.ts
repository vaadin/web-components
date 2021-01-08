import { CrudElement } from '../../src/vaadin-crud';
import '../../src/vaadin-crud';

const assert = <T>(value: T) => value;

type User = {
  name: {
    first: string;
    last: string;
  };
};

const crud: CrudElement<User> = document.createElement('vaadin-crud');

crud.addEventListener('editor-opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

crud.addEventListener('items-changed', (event) => {
  assert<User[]>(event.detail.value);
});

crud.addEventListener('size-changed', (event) => {
  assert<number>(event.detail.value);
});

crud.addEventListener('new', (event) => {
  assert<null>(event.detail.item);
});

crud.addEventListener('edit', (event) => {
  assert<User>(event.detail.item);
});

crud.addEventListener('delete', (event) => {
  assert<User>(event.detail.item);
});

crud.addEventListener('cancel', (event) => {
  assert<User>(event.detail.item);
});

crud.addEventListener('save', (event) => {
  assert<User>(event.detail.item);
  assert<boolean>(event.detail.new);
});
