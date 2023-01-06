import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-avatar-group.js';

describe('vaadin-avatar-group', () => {
  let group;

  beforeEach(() => {
    group = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>');
  });

  it('default', async () => {
    await expect(group).shadowDom.to.equalSnapshot();
  });

  it('items', async () => {
    group.items = [{ abbr: 'YY' }, { name: 'Tomi Virkki' }];
    await nextFrame();
    await expect(group).shadowDom.to.equalSnapshot();
  });

  it('theme', async () => {
    group.items = [{ abbr: 'YY' }, { name: 'Tomi Virkki' }];
    await nextFrame();
    group.setAttribute('theme', 'small');
    await expect(group).shadowDom.to.equalSnapshot();
  });

  describe('opened', () => {
    const SNAPSHOT_CONFIG = {
      // Some inline CSS styles related to the overlay's position
      // may slightly change depending on the environment, so ignore them.
      ignoreAttributes: ['style'],
    };

    beforeEach(async () => {
      group.maxItemsVisible = 3;
      group.items = [{ name: 'Abc Def' }, { name: 'Ghi Jkl' }, { name: 'Mno Pqr' }, { name: 'Stu Vwx' }];
      await nextRender();
      group._overflow.click();
      await nextRender();
    });

    it('default', async () => {
      await expect(group).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('overlay', async () => {
      await expect(group.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });
});
