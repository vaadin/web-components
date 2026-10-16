import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-date-range-picker.js';
import type { DateRangePicker } from '../vaadin-date-range-picker.js';

describe('vaadin-date-range-picker', () => {
  let picker: DateRangePicker;

  beforeEach(async () => {
    picker = fixtureSync('<vaadin-date-range-picker></vaadin-date-range-picker>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = picker.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });
});
