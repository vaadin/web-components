import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-button.js';

describe('vaadin-button', () => {
  let button;

  beforeEach(async () => {
    button = fixtureSync('<vaadin-button>Confirm</vaadin-button>');
    await nextUpdate(button);
  });

  it('default', async () => {
    await expect(button).to.equalAriaSnapshot();
    await expect(button).to.be.accessible();
  });

  it('disabled', async () => {
    button.disabled = true;
    await nextUpdate(button);
    await expect(button).to.equalAriaSnapshot();
    await expect(button).to.be.accessible();
  });

  it('aria-label', async () => {
    button.setAttribute('aria-label', 'Confirm order');
    await expect(button).to.equalAriaSnapshot();
    await expect(button).to.be.accessible();
  });

  it('prefix and suffix', async () => {
    button = fixtureSync(`
      <vaadin-button>
        <span slot="prefix" aria-hidden="true">+</span>
        Add
        <span slot="suffix">(3)</span>
      </vaadin-button>
    `);
    await nextUpdate(button);
    await expect(button).to.equalAriaSnapshot();
    await expect(button).to.be.accessible();
  });

  it('pressed', async () => {
    button.setAttribute('aria-pressed', 'true');
    await expect(button).to.equalAriaSnapshot();
    await expect(button).to.be.accessible();
  });
});
