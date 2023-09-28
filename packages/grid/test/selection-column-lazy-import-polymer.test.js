import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';

it('should not throw when grid with items imported lazily after selection column', async () => {
  fixtureSync(`
    <vaadin-grid items="[]">
      <vaadin-grid-selection-column></vaadin-grid-selection-column>
    </vaadin-grid>
  `);

  // The order of imports matters in this test
  await import('../vaadin-grid-selection-column.js');
  await import('../vaadin-grid.js');
});
