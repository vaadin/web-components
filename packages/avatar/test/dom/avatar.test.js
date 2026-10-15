import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-avatar.js';

describe('vaadin-avatar', () => {
  let avatar;

  beforeEach(() => {
    avatar = fixtureSync('<vaadin-avatar></vaadin-avatar>');
  });

  it('default', async () => {
    await expect(avatar).shadowDom.to.equalSnapshot();
  });

  it('img', async () => {
    avatar.img = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    await nextUpdate(avatar);
    await expect(avatar).shadowDom.to.equalSnapshot();
  });
});
