import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-crud.js';

describe('crud', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.height = '100%';
    element = fixtureSync('<vaadin-crud></vaadin-crud>', div);
    element.items = [{ name: { first: 'John', last: 'Doe' } }, { name: { first: 'Jane', last: 'Doe' } }];
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('column-borders', async () => {
    element.setAttribute('theme', 'column-borders');
    await visualDiff(element, 'column-borders');
  });

  it('no-row-borders', async () => {
    element.setAttribute('theme', 'no-row-borders');
    await visualDiff(element, 'no-row-borders');
  });
});
