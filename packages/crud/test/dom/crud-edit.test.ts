import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-crud-edit.js';

describe('vaadin-crud-edit', () => {
  describe('host', () => {
    it('default', async () => {
      const edit = fixtureSync('<vaadin-crud-edit></vaadin-crud-edit>');
      await expect(edit).dom.to.equalSnapshot();
    });

    it('custom aria-label', async () => {
      const edit = fixtureSync('<vaadin-crud-edit aria-label="Edit item"></vaadin-crud-edit>');
      await expect(edit).dom.to.equalSnapshot();
    });
  });
});
