import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-grid.js';
import { flushGrid } from '../../helpers.js';
import { users } from '../users.js';

describe('grid', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
        <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
        <vaadin-grid-column path="email"></vaadin-grid-column>
      </vaadin-grid>
    `);
    element.items = users;
    flushGrid(element);
    await nextRender();
  });

  it('basic', async () => {
    await visualDiff(element, 'basic');
  });

  it('column-borders', async () => {
    element.setAttribute('theme', 'column-borders');
    await visualDiff(element, 'column-borders');
  });

  it('no-row-borders', async () => {
    element.setAttribute('theme', 'no-row-borders');
    await visualDiff(element, 'no-row-borders');
  });

  it('selected-row', async () => {
    element.selectedItems = [element.items[0]];
    await visualDiff(element, 'selected-row');
  });
});
