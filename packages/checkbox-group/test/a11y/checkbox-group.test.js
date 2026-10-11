import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-checkbox-group.js';

describe('vaadin-checkbox-group', () => {
  let group;

  beforeEach(async () => {
    group = fixtureSync(`
      <vaadin-checkbox-group label="Toppings">
        <vaadin-checkbox value="cheese" label="Cheese"></vaadin-checkbox>
        <vaadin-checkbox value="ham" label="Ham"></vaadin-checkbox>
        <vaadin-checkbox value="olives" label="Olives"></vaadin-checkbox>
      </vaadin-checkbox-group>
    `);
    await nextUpdate(group);
  });

  it('default', async () => {
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('value', async () => {
    group.value = ['cheese', 'olives'];
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
    group.readonly = true;
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('required', async () => {
    group.required = true;
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    // `role="group"` does not support `aria-required`, but the group keeps it on purpose,
    // because VoiceOver and JAWS announce it.
    // See https://github.com/vaadin/web-components/issues/2931
    await expect(group).to.be.accessible({ ignoredRules: ['aria-allowed-attr'] });
  });

  it('helper', async () => {
    group.helperText = 'Choose up to two';
    await nextUpdate(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('error', async () => {
    group.errorMessage = 'Choose at least one';
    group.invalid = true;
    await aTimeout(0);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });
});
