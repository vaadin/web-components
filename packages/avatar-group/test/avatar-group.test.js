import { expect } from '@esm-bundle/chai';
import { enterKeyDown, escKeyDown, fixtureSync, nextRender, spaceKeyDown, tabKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-avatar-group.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

/**
 * Resolves once the function is invoked on the given object.
 */
function onceInvoked(object, functionName) {
  return new Promise((resolve) => {
    sinon.replace(object, functionName, (...args) => {
      sinon.restore();
      object[functionName](...args);
      resolve();
    });
  });
}

/**
 * Resolves once the ResizeObserver in AvatarGroup has processed a resize.
 */
async function onceResized(group) {
  await onceInvoked(group, '__setItemsInView');
}

describe('avatar-group', () => {
  let group;

  beforeEach(() => {
    group = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = group.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('items property', () => {
    beforeEach(async () => {
      group.items = [{ abbr: 'PM' }, { name: 'Yuriy Yevstihnyeyev' }, { abbr: 'SK' }, { name: 'Jens Jansson' }];
      await nextRender(group);
    });

    it('should render avatar for each item, plus overflow avatar', () => {
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(items.length).to.equal(group.items.length + 1);
    });

    it('should propagate theme attribute to all avatars', () => {
      group.setAttribute('theme', 'small');
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      items.forEach((avatar) => expect(avatar.getAttribute('theme')).to.equal('small'));
    });
  });

  describe('maxItemsVisible property', () => {
    beforeEach(async () => {
      group.items = [{ abbr: 'PM' }, { name: 'Yuriy Yevstihnyeyev' }, { name: 'Serhii Kulykov' }, { abbr: 'JJ' }, {}];
      group.maxItemsVisible = 3;
      await nextRender(group);
    });

    it('should render avatar based on maxItemsVisible, including overflow avatar', () => {
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(items.length).to.equal(group.maxItemsVisible);
    });

    it('should set abbr property on the overflow avatar', () => {
      const overflow = group.$.overflow;
      expect(overflow.abbr).to.equal('+3');
    });

    it('should set text generator on the overflow avatar tooltip', () => {
      const overflow = group.$.overflow;
      const items = group.items;
      const tooltip = overflow.querySelector('vaadin-tooltip');
      const overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
      expect(overlay.textContent).to.equal([items[2].name, items[3].abbr, 'anonymous'].join('\n'));
    });

    it('should show overlay on overflow avatar click', () => {
      const overflow = group.$.overflow;
      overflow.click();
      expect(overflow.hasAttribute('hidden')).to.be.false;
      group.$.overlay.close();
    });

    it('should show at least two avatars if maxItemsVisible is below 2', async () => {
      group.maxItemsVisible = 1;
      await nextRender(group);
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(items.length).to.equal(2);
    });

    it('should set abbr property correctly if maxItemsVisible is below 2', async () => {
      group.maxItemsVisible = 1;
      await nextRender(group);
      const overflow = group.$.overflow;
      expect(overflow.abbr).to.equal('+4');
    });

    it('should show two avatars if maxItemsVisible is below 2', async () => {
      group.items = group.items.slice(0, 2);
      group.maxItemsVisible = 1;
      await nextRender(group);
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar:not([hidden])');
      expect(items.length).to.equal(2);
    });

    it('should hide overflow avatar when maxItemsVisible property is set to null', async () => {
      group.maxItemsVisible = null;
      await nextRender(group);
      expect(group.$.overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should hide overflow avatar when maxItemsVisible property is set to undefined', async () => {
      group.maxItemsVisible = undefined;
      await nextRender(group);
      expect(group.$.overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should hide overflow avatar when items property is changed', async () => {
      group.maxItemsVisible = 2;
      await nextRender(group);
      group.splice('items', 1, 3);
      await nextRender(group);
      expect(group.$.overflow.hasAttribute('hidden')).to.be.true;
    });

    // https://github.com/vaadin/vaadin-avatar/issues/83
    it('should show only maxItemsVisible when setting items after being empty', async () => {
      const maxItemsVisible = 3;
      group.maxItemsVisible = maxItemsVisible;
      await nextRender(group);
      const items = group.items;
      group.items = [];
      group.items = items;
      await nextRender(group);
      const renderedElements = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(renderedElements.length).to.equal(maxItemsVisible);
    });

    describe('width is set', () => {
      beforeEach(async () => {
        group.maxItemsVisible = 4;
        await nextRender(group);
      });

      it('should consider element width when maxItemsVisible is set', async () => {
        group.style.width = '100px';
        await onceResized(group);

        const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
        expect(items.length).to.equal(3);
      });

      it('should set abbr property correctly if maxItemsVisible and width are set', async () => {
        group.style.width = '100px';
        await onceResized(group);

        const overflow = group.$.overflow;
        expect(overflow.abbr).to.equal('+3');
      });
    });
  });

  describe('auto overflow', () => {
    let overlay, overflow;

    beforeEach(async () => {
      group.items = [{ abbr: '01' }, { abbr: '02' }, { abbr: '03' }, { abbr: '04' }, { abbr: '05' }];
      await nextRender(group);
      overlay = group.$.overlay;
      overflow = group.$.overflow;
    });

    afterEach(() => {
      overlay.close();
    });

    it('should render avatars to fit width on resize', async () => {
      group.style.width = '110px';
      await onceResized(group);
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(items.length).to.equal(3);
      expect(overflow.abbr).to.equal('+3');
    });

    it('should always show at least two avatars', async () => {
      group.set('items', group.items.slice(0, 2));
      group.style.width = '50px';
      await onceResized(group);
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar:not([hidden])');
      expect(items.length).to.equal(2);
    });

    it('should not show overlay with only one avatar', async () => {
      group.style.width = '170px';
      await onceResized(group);
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should re-render avatars on items change', async () => {
      group.style.width = '110px';
      group.items = group.items.slice(0, 2);
      await onceResized(group);
      expect(overflow.hasAttribute('hidden')).to.be.true;
    });

    it('should render avatars in the list-box items', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const items = overlay.content.querySelectorAll('[theme="avatar-group-item"]');
        expect(items.length).to.equal(3);
        done();
      });
      group.style.width = '110px';
      onceResized(group).then(() => overflow.click());
    });

    it('should re-render overflowing avatars on resize', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        group.style.width = '75px';
        onceResized(group).then(() => {
          const items = overlay.content.querySelectorAll('[theme="avatar-group-item"]');
          expect(items.length).to.equal(4);
          done();
        });
      });
      group.style.width = '110px';
      onceResized(group).then(() => {
        overflow.click();
      });
    });

    it('should close overlay on resize when all avatars fit', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        group.style.width = '';
        onceResized(group).then(() => {
          expect(overlay.opened).to.be.false;
          done();
        });
      });
      group.style.width = '110px';
      onceResized(group).then(() => overflow.click());
    });
  });

  describe('overlay', () => {
    let overlay, overflow;

    beforeEach(async () => {
      group.items = [
        { abbr: 'PM' },
        { name: 'Yuriy Yevstihnyeyev' },
        { name: 'Serhii Kulykov' },
        { name: 'Jens Jansson' },
      ];
      group.maxItemsVisible = 2;
      await nextRender(group);
      overlay = group.$.overlay;
      overflow = group.$.overflow;
    });

    afterEach(() => {
      overlay.close();
    });

    it('should open overlay on overflow avatar click', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        expect(overlay.opened).to.be.true;
        done();
      });
      overflow.click();
    });

    it('should open overlay on overflow avatar Enter', () => {
      enterKeyDown(overflow);
      expect(overlay.opened).to.be.true;
    });

    it('should open overlay on overflow avatar Space', () => {
      spaceKeyDown(overflow);
      expect(overlay.opened).to.be.true;
    });

    it('should render list-box with items in the overlay', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const list = overlay.content.querySelector('vaadin-avatar-group-list-box');
        expect(list).to.be.ok;
        const items = overlay.content.querySelectorAll('[theme="avatar-group-item"]');
        expect(items.length).to.equal(3);
        done();
      });
      overflow.click();
    });

    it('should render avatar names in the list-box items', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const items = overlay.content.querySelectorAll('[theme="avatar-group-item"]');
        expect(items[0].textContent.trim()).to.equal(group.items[1].name);
        expect(items[1].textContent.trim()).to.equal(group.items[2].name);
        expect(items[2].textContent.trim()).to.equal(group.items[3].name);
        done();
      });
      overflow.click();
    });

    it('should set tabindex="-1" on the avatars in the items', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const avatars = overlay.content.querySelectorAll('vaadin-avatar');
        expect(avatars[0].getAttribute('tabindex')).to.equal('-1');
        expect(avatars[1].getAttribute('tabindex')).to.equal('-1');
        expect(avatars[2].getAttribute('tabindex')).to.equal('-1');
        done();
      });
      overflow.click();
    });

    it('should close overlay on subsequent overflow click', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        overflow.click();

        afterNextRender(overlay, () => {
          expect(overlay.opened).to.be.false;
          done();
        });
      });
      overflow.click();
    });

    it('should close overlay on list-box Escape press', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const list = overlay.content.querySelector('vaadin-avatar-group-list-box');
        escKeyDown(list);

        afterNextRender(overlay, () => {
          expect(overlay.opened).to.be.false;
          done();
        });
      });
      overflow.click();
    });

    it('should close overlay on list-box Tab press', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const list = overlay.content.querySelector('vaadin-avatar-group-list-box');
        tabKeyDown(list);

        afterNextRender(overlay, () => {
          expect(overlay.opened).to.be.false;
          done();
        });
      });
      overflow.click();
    });

    it('should focus overflow avatar on overlay close', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const spy = sinon.spy(overflow, 'focus');
        overflow.click();

        afterNextRender(overlay, () => {
          expect(spy.calledOnce).to.be.true;
          done();
        });
      });
      overflow.click();
    });

    it('should restore focus-ring attribute on overlay close', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        overflow.click();

        afterNextRender(overlay, () => {
          expect(overflow.hasAttribute('focus-ring')).to.be.true;
          done();
        });
      });

      overflow.setAttribute('focus-ring', '');
      overflow.click();
    });

    it('should restore focus-ring attribute on close if closed with keyboard', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const list = overlay.content.querySelector('vaadin-avatar-group-list-box');
        escKeyDown(list);

        afterNextRender(overlay, () => {
          expect(overflow.hasAttribute('focus-ring')).to.be.true;
          done();
        });
      });

      overflow.click();
    });

    it('should not restore focus-ring attribute on close if not set', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const items = overlay.content.querySelectorAll('[theme="avatar-group-item"]');
        items[0].click();

        afterNextRender(overlay, () => {
          expect(overflow.hasAttribute('focus-ring')).to.be.false;
          done();
        });
      });

      overflow.click();
    });
  });

  describe('color index', () => {
    let overlay, overflow;

    beforeEach(async () => {
      group.items = [
        { abbr: 'PM', colorIndex: 0 },
        { name: 'Yuriy Yevstihnyeyev', colorIndex: 1 },
        { name: 'Serhii Kulykov', colorIndex: 2 },
      ];
      await nextRender(group);
      overlay = group.$.overlay;
      overflow = group.$.overflow;
    });

    it('should pass color index to avatars', () => {
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(items[0].colorIndex).to.equal(0);
      expect(items[1].colorIndex).to.equal(1);
      expect(items[2].colorIndex).to.equal(2);
    });

    it('should pass color index to overlay avatars', (done) => {
      group.maxItemsVisible = 1;
      overlay.addEventListener('vaadin-overlay-open', () => {
        const avatars = overlay.content.querySelectorAll('vaadin-avatar');
        expect(avatars[0].colorIndex).to.equal(group.items[1].colorIndex);
        expect(avatars[1].colorIndex).to.equal(group.items[2].colorIndex);
        done();
      });
      overflow.click();
    });
  });

  describe('i18n property', () => {
    let overlay, overflow;

    const customI18n = {
      anonymous: 'someone',
      activeUsers: {
        one: 'One active user',
        many: '{count} active users',
      },
    };

    beforeEach(async () => {
      group.items = [{ abbr: 'PM' }, { name: 'Yuriy Yevstihnyeyev' }, { name: 'Serhii Kulykov' }];
      await nextRender(group);
      overlay = group.$.overlay;
      overflow = group.$.overflow;
    });

    it('should set aria-label based on i18n.activeUsers.many', () => {
      group.i18n = customI18n;
      expect(group.getAttribute('aria-label')).to.equal('3 active users');
    });

    it('should set aria-label based on i18n.activeUsers.one', () => {
      group.i18n = customI18n;
      group.items = [group.items[0]];
      expect(group.getAttribute('aria-label')).to.equal('One active user');
    });

    it('should set aria-label properly when items is empty array', () => {
      group.i18n = customI18n;
      group.items = [];
      expect(group.getAttribute('aria-label')).to.equal('0 active users');
    });

    it('should set aria-label properly when items is null', () => {
      group.i18n = customI18n;
      group.items = null;
      expect(group.getAttribute('aria-label')).to.equal('0 active users');
    });

    it('should pass i18n property to avatars', () => {
      group.i18n = customI18n;
      const items = group.shadowRoot.querySelectorAll('vaadin-avatar');
      expect(items[0].i18n).to.deep.equal(customI18n);
      expect(items[1].i18n).to.deep.equal(customI18n);
      expect(items[2].i18n).to.deep.equal(customI18n);
    });

    it('should pass i18n property to overlay avatars', (done) => {
      group.i18n = customI18n;
      group.maxItemsVisible = 1;
      overlay.addEventListener('vaadin-overlay-open', () => {
        const avatars = overlay.content.querySelectorAll('vaadin-avatar');
        expect(avatars[0].i18n).to.deep.equal(customI18n);
        expect(avatars[1].i18n).to.deep.equal(customI18n);
        done();
      });
      overflow.click();
    });
  });

  describe('ARIA roles', () => {
    let overlay, overflow;

    beforeEach(async () => {
      group.items = [
        { abbr: 'PM' },
        { name: 'Yuriy Yevstihnyeyev' },
        { name: 'Serhii Kulykov' },
        { name: 'Jens Jansson' },
      ];
      group.maxItemsVisible = 2;
      await nextRender(group);
      overlay = group.$.overlay;
      overflow = group.$.overflow;
    });

    afterEach(() => {
      overlay.close();
    });

    it('should set aria-expanded="false" on the overflow avatar', () => {
      expect(overflow.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should set aria-expanded="true" on the overflow avatar on open', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        expect(overflow.getAttribute('aria-expanded')).to.equal('true');
        done();
      });
      overflow.click();
    });

    it('should set role="listbox" on the overlay list-box', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const list = overlay.content.querySelector('vaadin-avatar-group-list-box');
        expect(list.getAttribute('role')).to.equal('listbox');
        done();
      });
      overflow.click();
    });

    it('should set role="option" on the overlay items', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const items = overlay.content.querySelectorAll('[theme="avatar-group-item"]');
        items.forEach((item) => {
          expect(item.getAttribute('role')).to.equal('option');
        });
        done();
      });
      overflow.click();
    });

    it('should remove tooltips from the overlay avatars', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const avatars = overlay.content.querySelectorAll('vaadin-avatar');
        avatars.forEach((avatar) => {
          expect(avatar.querySelector('vaadin-tooltip').target).to.be.null;
        });
        done();
      });
      overflow.click();
    });

    it('should set aria-hidden="true" on the overlay avatars', (done) => {
      overlay.addEventListener('vaadin-overlay-open', () => {
        const avatars = overlay.content.querySelectorAll('vaadin-avatar');
        avatars.forEach((avatar) => {
          expect(avatar.getAttribute('aria-hidden')).to.equal('true');
        });
        done();
      });
      overflow.click();
    });
  });

  describe('announcements', () => {
    let clock;
    let region;

    before(() => {
      region = document.querySelector('[aria-live]');
    });

    beforeEach(async () => {
      group.items = [{ name: 'AA' }, { name: 'BB' }, { name: 'CC' }];
      await nextRender(group);
      clock = sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should announce when adding single item', () => {
      group.splice('items', 2, 0, { name: 'DD' });

      clock.tick(150);

      expect(region.textContent).to.equal('DD joined');
    });

    it('should announce when removing single item', () => {
      group.splice('items', 2, 1);

      clock.tick(150);

      expect(region.textContent).to.equal('CC left');
    });

    it('should announce when adding multiple items', () => {
      group.splice('items', 2, 0, { name: 'DD' }, { name: 'EE' });

      clock.tick(150);

      expect(region.textContent).to.equal('DD joined, EE joined');
    });

    it('should announce when removing multiple items', () => {
      group.splice('items', 1, 2);

      clock.tick(150);

      expect(region.textContent).to.equal('BB left, CC left');
    });

    it('should announce when adding and removing single item', () => {
      group.splice('items', 2, 1, { name: 'DD' });

      clock.tick(150);

      expect(region.textContent).to.equal('CC left, DD joined');
    });

    it('should announce when adding and removing multiple items', () => {
      group.splice('items', 1, 2, { name: 'DD' }, { name: 'EE' });

      clock.tick(150);

      expect(region.textContent).to.equal('BB left, CC left, DD joined, EE joined');
    });

    it('should announce when the items property is reset', () => {
      group.set('items', [group.items[0]]);

      clock.tick(150);

      expect(region.textContent).to.equal('BB left, CC left');
    });
  });
});

describe('avatar group in column flex', () => {
  let layout;
  let group;

  beforeEach(async () => {
    layout = fixtureSync(`
      <div style="display: flex; width: 200px; flex-direction: column; align-items: flex-start;">
        <vaadin-avatar-group></vaadin-avatar-group>
      </div>
    `);
    group = layout.firstElementChild;
    group.items = [
      { abbr: 'PM' },
      { name: 'Yuriy Yevstihnyeyev' },
      { abbr: 'SK' },
      { abbr: 'LA' },
      { name: 'Jens Jansson' },
    ];
    await nextRender(group);
  });

  it('should have width of the parent', () => {
    expect(group.offsetWidth).to.equal(layout.offsetWidth);
  });

  it('should not show overflow avatar', () => {
    expect(group.$.overflow.hasAttribute('hidden')).to.be.true;
  });
});
