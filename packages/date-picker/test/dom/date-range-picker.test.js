import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-range-picker.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-date-range-picker', () => {
  let picker;

  beforeEach(async () => {
    resetUniqueId();
    picker = fixtureSync('<vaadin-date-range-picker></vaadin-date-range-picker>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(picker).dom.to.equalSnapshot();
    });

    it('label, helper and placeholders', async () => {
      picker.label = 'Trip dates';
      picker.helperText = 'Pick both dates';
      picker.startPlaceholder = 'Departure';
      picker.endPlaceholder = 'Return';
      await nextRender();
      await expect(picker).dom.to.equalSnapshot();
    });

    it('values', async () => {
      picker.startValue = '2026-03-10';
      picker.endValue = '2026-03-15';
      await nextRender();
      await expect(picker).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      picker.disabled = true;
      await nextRender();
      await expect(picker).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(picker).shadowDom.to.equalSnapshot();
    });
  });
});
