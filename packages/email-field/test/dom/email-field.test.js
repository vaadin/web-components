import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-email-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-email-field', () => {
  let field;

  // Ignore pattern because of escape characters
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['pattern'],
  };

  beforeEach(async () => {
    resetUniqueId();
    field = fixtureSync('<vaadin-email-field></vaadin-email-field>');
    await nextUpdate(field);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(field).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('helper', async () => {
      field.helperText = 'Helper';
      await nextUpdate(field);
      await expect(field).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('error', async () => {
      field.errorMessage = 'Error';
      field.invalid = true;
      await nextUpdate(field);
      await aTimeout(0);
      await expect(field).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      field.disabled = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      field.readonly = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      field.invalid = true;
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      field.setAttribute('theme', 'align-right');
      await nextUpdate(field);
      await expect(field).shadowDom.to.equalSnapshot();
    });
  });
});
