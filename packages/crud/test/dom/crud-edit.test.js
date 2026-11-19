import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-crud-edit.js';

describe('vaadin-crud-edit', () => {
  let edit;

  describe('default', () => {
    beforeEach(() => {
      edit = fixtureSync('<vaadin-crud-edit></vaadin-crud-edit>');
    });

    it('host', async () => {
      await expect(edit).dom.to.equalSnapshot();
    });

    it('shadow', async () => {
      await expect(edit).shadowDom.to.equalSnapshot();
    });
  });

  describe('custom', () => {
    it('aria-label', async () => {
      edit = fixtureSync('<vaadin-crud-edit aria-label="Edit item"></vaadin-crud-edit>');
      await expect(edit).dom.to.equalSnapshot();
    });
  });
});
