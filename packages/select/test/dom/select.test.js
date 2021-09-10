import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-select.js';

describe('vaadin-select', () => {
  let select;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for']
  };

  beforeEach(() => {
    select = fixtureSync('<vaadin-select></vaadin-select>');
  });

  it('default', async () => {
    await expect(select).shadowDom.to.equalSnapshot();
  });

  it('disabled', async () => {
    select.disabled = true;
    await expect(select).shadowDom.to.equalSnapshot();
  });

  it('readonly', async () => {
    select.readonly = true;
    await expect(select).shadowDom.to.equalSnapshot();
  });

  it('invalid', async () => {
    select.invalid = true;
    await expect(select).shadowDom.to.equalSnapshot();
  });

  it('theme', async () => {
    select.setAttribute('theme', 'align-right');
    await expect(select).shadowDom.to.equalSnapshot();
  });

  it('slots', async () => {
    await expect(select).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
