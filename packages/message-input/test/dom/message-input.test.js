import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-message-input.js';

describe('vaadin-message-input', () => {
  let input;

  // Ignore generated attributes to prevent failures
  // when running snapshot tests in a different order
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['id', 'aria-describedby', 'aria-labelledby', 'for', 'pattern'],
  };

  beforeEach(() => {
    input = fixtureSync('<vaadin-message-input></vaadin-message-input>');
  });

  it('default', async () => {
    await expect(input).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('disabled', async () => {
    input.disabled = true;
    await expect(input).shadowDom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
