import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../../../theme/lumo/vaadin-grid.js';
import '../../../theme/lumo/vaadin-grid-column-group.js';
import '../../../theme/lumo/vaadin-grid-sorter.js';
import '../../../theme/lumo/vaadin-grid-sort-column.js';
import '../../../theme/lumo/vaadin-grid-tree-column.js';
import '../grid.common.js';
import { flushGrid } from '../../helpers.js';
import { users } from '../users.js';

describe('theme', () => {
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
    await nextRender(element);
  });

  it('column-borders', async () => {
    element.setAttribute('theme', 'column-borders');
    await visualDiff(element, 'theme-column-borders');
  });

  it('compact', async () => {
    element.setAttribute('theme', 'compact');
    await visualDiff(element, 'theme-compact');
  });

  it('no-row-borders', async () => {
    element.setAttribute('theme', 'no-row-borders');
    await visualDiff(element, 'theme-no-row-borders');
  });

  it('row-stripes', async () => {
    element.setAttribute('theme', 'row-stripes');
    await visualDiff(element, 'theme-row-stripes');
  });
});
