import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-time-picker.js';

describe('vaadin-date-time-picker', () => {
  let dateTimePicker;

  beforeEach(() => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker></vaadin-date-time-picker>');
  });

  it('default', async () => {
    await expect(dateTimePicker).shadowDom.to.equalSnapshot();
  });
});
