import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-grid-sorter.js';

describe('vaadin-grid-sorter', () => {
  let sorter;

  beforeEach(async () => {
    sorter = fixtureSync('<vaadin-grid-sorter></vaadin-grid-sorter>');
    await nextUpdate(sorter);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(sorter).dom.to.equalSnapshot();
    });

    it('direction asc', async () => {
      sorter.direction = 'asc';
      await nextUpdate(sorter);
      await expect(sorter).dom.to.equalSnapshot();
    });

    it('direction desc', async () => {
      sorter.direction = 'desc';
      await nextUpdate(sorter);
      await expect(sorter).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(sorter).shadowDom.to.equalSnapshot();
    });

    it('order', async () => {
      sorter._order = 1;
      await nextUpdate(sorter);
      await expect(sorter).shadowDom.to.equalSnapshot();
    });
  });
});
