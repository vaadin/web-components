import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-radio-group.js';

describe('vaadin-radio-group', () => {
  let group;

  beforeEach(async () => {
    group = fixtureSync(`
      <vaadin-radio-group label="Size">
        <vaadin-radio-button value="s" label="Small"></vaadin-radio-button>
        <vaadin-radio-button value="m" label="Medium"></vaadin-radio-button>
        <vaadin-radio-button value="l" label="Large"></vaadin-radio-button>
      </vaadin-radio-group>
    `);
    await nextUpdate(group);
  });

  it('default', async () => {
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('value', async () => {
    group.value = 'm';
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('disabled', async () => {
    group.disabled = true;
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('readonly', async () => {
    group.value = 'm';
    group.readonly = true;
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('required', async () => {
    group.required = true;
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('helper', async () => {
    group.helperText = 'Choose one';
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('error', async () => {
    group.errorMessage = 'Choose a size';
    group.invalid = true;
    await aTimeout(0);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });
});
