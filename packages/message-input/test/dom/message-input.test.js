import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-message-input.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-message-input', () => {
  let input;

  beforeEach(async () => {
    resetUniqueId();
    input = fixtureSync('<vaadin-message-input></vaadin-message-input>');
    await nextUpdate(input);
  });

  it('default', async () => {
    await expect(input).dom.to.equalSnapshot();
  });

  it('disabled', async () => {
    input.disabled = true;
    await expect(input).dom.to.equalSnapshot();
  });

  it('theme', async () => {
    input.setAttribute('theme', 'icon-only');
    await nextUpdate(input);
    await expect(input).dom.to.equalSnapshot();
  });
});
