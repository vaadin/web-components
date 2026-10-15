import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-query-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { QueryField } from '../../src/vaadin-query-field.js';

window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.queryFieldComponent = true;

describe('vaadin-query-field', () => {
  let field: QueryField;

  // The highlights layer is positioned with inline styles that depend on font metrics
  const SNAPSHOT_CONFIG = { ignoreAttributes: ['style'] };

  beforeEach(async () => {
    resetUniqueId();
    field = fixtureSync('<vaadin-query-field></vaadin-query-field>');
    field.filters = [
      { name: 'label', options: ['Warp Records'] },
      { name: 'year', type: 'number' },
    ];
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(field).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('suggestions', async () => {
      field.inputElement!.focus();
      field.value = 'l';
      field.inputElement!.dispatchEvent(new Event('input'));
      await nextUpdate(field);
      await expect(field).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(field).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('tokens', async () => {
      field.value = 'label:"Warp Records" year:abc foo';
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });
});
