import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/avatar-group/src/vaadin-avatar-group.js';

// TODO: --vaadin-avatar-group-overlap fails because the base styles wrap the value in max()
// (vaadin-avatar-group-base-styles.js:34), so the computed --_overlap value includes max().
//
// TODO: --vaadin-avatar-group-gap fails because the base styles wrap the value in max()
// (vaadin-avatar-group-base-styles.js:35), so the computed --_gap value includes max().
//
// TODO: --vaadin-user-color-0 through --vaadin-user-color-9 fail because Aura theme transforms
// user colors through --aura-accent-surface (avatar.css:11-16), so background-color doesn't
// directly match the custom property value.
//
// TODO: --vaadin-overlay-shadow fails because Aura theme combines it with --aura-overlay-outline-shadow
// in overlay.css:32, so the computed box-shadow doesn't match the custom property value alone.
//
// TODO: --vaadin-icon-visual-size fails because Aura theme sets it to 75% on ::part(checkmark)
// in item-overlay.css:34, which overrides custom values set on the host.

export const props = [
  // === Avatar Properties ===
  {
    name: '--vaadin-avatar-background',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-avatar-text-color',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-avatar-border-color',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar, '::before').getPropertyValue('outline-color').trim();
    },
  },
  {
    name: '--vaadin-avatar-border-width',
    value: '5px',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar, '::before').getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-avatar-size',
    value: '100px',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('height').trim();
    },
  },

  // === Avatar Group Layout ===
  {
    name: '--vaadin-avatar-group-overlap',
    value: '20px',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-avatar-group-overlap').trim();
    },
  },
  {
    name: '--vaadin-avatar-group-gap',
    value: '10px',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-avatar-group-gap').trim();
    },
  },

  // === Focus Ring ===
  {
    name: '--vaadin-focus-ring-width',
    value: '5px',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      avatar.setAttribute('focus-ring', '');
      return getComputedStyle(avatar).getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-focus-ring-color',
    value: 'rgb(255, 100, 0)',
    setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      avatar.setAttribute('focus-ring', '');
      return getComputedStyle(avatar).getPropertyValue('outline-color').trim();
    },
  },

  // === User Colors ===
  {
    name: '--vaadin-user-color-0',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 0 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-1',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 1 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-2',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 2 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-3',
    value: 'rgb(255, 255, 0)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 3 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-4',
    value: 'rgb(255, 0, 255)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 4 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-5',
    value: 'rgb(0, 255, 255)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 5 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-6',
    value: 'rgb(128, 0, 0)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 6 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-7',
    value: 'rgb(0, 128, 0)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 7 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-8',
    value: 'rgb(0, 0, 128)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 8 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },
  {
    name: '--vaadin-user-color-9',
    value: 'rgb(128, 128, 0)',
    setup(element) {
      element.items = [{ name: 'Alice', colorIndex: 9 }];
    },
    compute(element) {
      const avatar = element.querySelector('vaadin-avatar');
      return getComputedStyle(avatar).getPropertyValue('--vaadin-avatar-user-color').trim();
    },
  },

  // === Overlay ===
  {
    name: '--vaadin-overlay-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-radius',
    value: '20px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-width',
    value: '5px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-overlay-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part~="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },
  {
    name: '--vaadin-item-overlay-padding',
    value: '20px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const menu = element.querySelector('[slot="overlay"]');
      return getComputedStyle(menu).getPropertyValue('padding').trim();
    },
  },

  // === Overlay Items ===
  {
    name: '--vaadin-item-border-radius',
    value: '10px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      return getComputedStyle(item).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-item-checkmark-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-icon-size',
    value: '30px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark, '::before').getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-icon-visual-size',
    value: '80%',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark, '::before').getPropertyValue('mask-size').trim();
    },
  },
  {
    name: '--vaadin-item-gap',
    value: '20px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('column-gap').trim();
    },
  },
  {
    name: '--vaadin-item-height',
    value: '100px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      return getComputedStyle(item).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-item-padding',
    value: '20px',
    async setup(element) {
      element.items = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
      element.maxItemsVisible = 2;
      await nextUpdate(element);
      element._opened = true;
      await nextRender();
    },
    compute(element) {
      const item = element.querySelector('vaadin-avatar-group-menu-item');
      return getComputedStyle(item).getPropertyValue('padding-top').trim();
    },
  },
];

describe('avatar-group', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-avatar-group></vaadin-avatar-group>');
    await nextUpdate(element);
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
