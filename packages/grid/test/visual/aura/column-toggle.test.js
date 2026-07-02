import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-grid.js';
import '../../../vaadin-grid-column.js';
import { flushGrid } from '../../helpers.js';

describe('column-toggle', () => {
  let grid;

  beforeEach(async () => {
    // The toggle button is rendered by the grid itself in its top inline-end
    // corner, so a screenshot of the grid covers both the icon and its
    // placement (which the theme styles must preserve).
    grid = fixtureSync(`
      <vaadin-grid style="width: 400px; height: 200px">
        <vaadin-grid-column path="name" header="Name" hideable></vaadin-grid-column>
        <vaadin-grid-column path="email" header="Email" hideable></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.items = [{ name: 'John', email: 'john@example.com' }];
    flushGrid(grid);
    await nextRender(grid);
  });

  it('basic', async () => {
    await visualDiff(grid, 'column-toggle');
  });
});
