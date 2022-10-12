import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-message-input.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-message-input', () => {
  let input;

  beforeEach(() => {
    resetUniqueId();
    input = fixtureSync('<vaadin-message-input></vaadin-message-input>');
  });

  it('default', async () => {
    await expect(input).dom.to.equalSnapshot();
  });

  it('disabled', async () => {
    input.disabled = true;
    await expect(input).dom.to.equalSnapshot();
  });
});
