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
