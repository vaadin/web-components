import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-avatar-group.js';

describe('vaadin-avatar-group', () => {
  let group;

  beforeEach(() => {
    group = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>');
  });

  it('default', async () => {
    await expect(group).dom.to.equalSnapshot();
  });

  it('items', async () => {
    group.items = [{ abbr: 'YY' }, { name: 'Tomi Virkki' }];
    await nextFrame();
    await expect(group).dom.to.equalSnapshot();
  });

  it('theme', async () => {
    group.items = [{ abbr: 'YY' }, { name: 'Tomi Virkki' }];
    await nextFrame();
    group.setAttribute('theme', 'small');
    await expect(group).dom.to.equalSnapshot();
  });
});
