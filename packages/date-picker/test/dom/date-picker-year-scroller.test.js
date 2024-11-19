import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-picker-year-scroller.js';

describe('vaadin-date-picker-year-scroller', () => {
  let yearScroller;

  beforeEach(async () => {
    yearScroller = fixtureSync('<vaadin-date-picker-year-scroller></vaadin-date-picker-year-scroller>');
    await nextFrame();
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(yearScroller).shadowDom.to.equalSnapshot();
    });
  });
});
