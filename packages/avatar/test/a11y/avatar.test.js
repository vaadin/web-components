import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-avatar.js';

describe('vaadin-avatar', () => {
  let avatar;

  beforeEach(async () => {
    avatar = fixtureSync('<vaadin-avatar></vaadin-avatar>');
    await nextRender();
  });

  it('default', async () => {
    await expect(avatar).to.equalA11yTreeSnapshot();
    // Known issue: with no name and no abbr, `role="img"` has no accessible name.
    // The `anonymous` i18n string is only used for the tooltip.
    await expect(avatar).to.be.accessible({ expectedViolations: ['role-img-alt'] });
  });

  it('name', async () => {
    avatar.name = 'Jens Jansson';
    await nextUpdate(avatar);
    await expect(avatar).to.equalA11yTreeSnapshot();
    await expect(avatar).to.be.accessible();
  });

  it('abbr', async () => {
    avatar.abbr = 'JJ';
    await nextUpdate(avatar);
    await expect(avatar).to.equalA11yTreeSnapshot();
    await expect(avatar).to.be.accessible();
  });

  it('img', async () => {
    avatar.name = 'Jens Jansson';
    avatar.img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    await nextUpdate(avatar);
    await expect(avatar).to.equalA11yTreeSnapshot();
    await expect(avatar).to.be.accessible();
  });

  it('with tooltip', async () => {
    avatar.name = 'Jens Jansson';
    avatar.withTooltip = true;
    await nextUpdate(avatar);
    await expect(avatar).to.equalA11yTreeSnapshot();
    await expect(avatar).to.be.accessible();
  });
});
