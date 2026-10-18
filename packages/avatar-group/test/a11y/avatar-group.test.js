import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../avatar-group-test-styles.js';
import '../../src/vaadin-avatar-group.js';

describe('vaadin-avatar-group', () => {
  let group;

  beforeEach(async () => {
    group = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>');
    group.items = [
      { abbr: 'PM' },
      { name: 'Yuriy Yevstihnyeyev' },
      { name: 'Serhii Kulykov' },
      { name: 'Jens Jansson' },
    ];
    await nextRender();
  });

  it('default', async () => {
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('overflow', async () => {
    group.maxItemsVisible = 2;
    await nextRender();
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });

  it('overflow opened', async () => {
    group.maxItemsVisible = 2;
    await nextRender();
    group._overflow.click();
    await oneEvent(group.$.overlay, 'vaadin-overlay-open');
    await expect(group).to.equalA11yTreeSnapshot();
    // Known issue: menu items have `aria-selected`, which `role="menuitem"` does not support.
    // See https://github.com/vaadin/web-components/issues/165
    await expect(group).to.be.accessible({ expectedViolations: ['aria-allowed-attr'] });
  });

  it('overflow by width', async () => {
    group.style.width = '110px';
    await nextResize(group);
    await expect(group).to.equalA11yTreeSnapshot();
    await expect(group).to.be.accessible();
  });
});
