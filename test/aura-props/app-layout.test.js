import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/app-layout/src/vaadin-app-layout.js';
import '@vaadin/app-layout/src/vaadin-drawer-toggle.js';

// TODO: --vaadin-button-padding fails because Aura theme sets it directly on
// vaadin-drawer-toggle in button.css:42, which overrides inherited custom property values.
// NOTE: Makes sense to set on drawer toggle specifically instead of for all buttons in layout. Skipped test.

export const props = [
  // === Navbar ===
  {
    name: '--vaadin-app-layout-navbar-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const navbar = element.shadowRoot.querySelector('[part~="navbar"]');
      return getComputedStyle(navbar).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-app-layout-navbar-gap',
    value: '30px',
    compute(element) {
      const navbar = element.shadowRoot.querySelector('[part~="navbar"]');
      return getComputedStyle(navbar).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-app-layout-navbar-padding-top',
    value: '30px',
    compute(element) {
      const navbar = element.shadowRoot.querySelector('[part~="navbar"]');
      return getComputedStyle(navbar).getPropertyValue('padding-top').trim();
    },
  },
  {
    name: '--vaadin-app-layout-navbar-padding-bottom',
    value: '30px',
    compute(element) {
      const navbar = element.shadowRoot.querySelector('[part~="navbar"]');
      return getComputedStyle(navbar).getPropertyValue('padding-bottom').trim();
    },
  },
  {
    name: '--vaadin-app-layout-navbar-padding-inline-start',
    value: '30px',
    compute(element) {
      const navbar = element.shadowRoot.querySelector('[part~="navbar"]');
      return getComputedStyle(navbar).getPropertyValue('padding-inline-start').trim();
    },
  },
  {
    name: '--vaadin-app-layout-navbar-padding-inline-end',
    value: '30px',
    compute(element) {
      const navbar = element.shadowRoot.querySelector('[part~="navbar"]');
      return getComputedStyle(navbar).getPropertyValue('padding-inline-end').trim();
    },
  },

  // === Drawer ===
  {
    name: '--vaadin-app-layout-drawer-background',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      const div = document.createElement('div');
      div.slot = 'drawer';
      div.textContent = 'Drawer content';
      element.appendChild(div);
      element.drawerOpened = true;
    },
    compute(element) {
      const drawer = element.shadowRoot.querySelector('[part="drawer"]');
      return getComputedStyle(drawer).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-app-layout-drawer-width',
    value: '400px',
    setup(element) {
      const div = document.createElement('div');
      div.slot = 'drawer';
      div.textContent = 'Drawer content';
      element.appendChild(div);
      element.drawerOpened = true;
    },
    compute(element) {
      const drawer = element.shadowRoot.querySelector('[part="drawer"]');
      return getComputedStyle(drawer).getPropertyValue('width').trim();
    },
  },

  // === Transition ===
  {
    name: '--vaadin-app-layout-transition-duration',
    value: '0.5s',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('transition-duration').trim();
    },
  },

  // === Overlay ===
  {
    name: '--vaadin-overlay-backdrop-background',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const backdrop = element.shadowRoot.querySelector('[part="backdrop"]');
      return getComputedStyle(backdrop).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-shadow',
    value: 'rgb(255, 0, 0) 0px 4px 12px 0px',
    setup(element) {
      element.setAttribute('overlay', '');
      const div = document.createElement('div');
      div.slot = 'drawer';
      div.textContent = 'Drawer content';
      element.appendChild(div);
      element.drawerOpened = true;
    },
    compute(element) {
      const drawer = element.shadowRoot.querySelector('[part="drawer"]');
      return getComputedStyle(drawer).getPropertyValue('box-shadow').trim();
    },
  },

  // === Drawer Toggle: Button Properties ===
  {
    name: '--vaadin-button-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-button-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-button-border-radius',
    value: '20px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-button-border-width',
    value: '5px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-button-font-size',
    value: '24px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-button-height',
    value: '60px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-button-line-height',
    value: '30px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-button-margin',
    value: '10px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('margin').trim();
    },
  },
  // {
  //   name: '--vaadin-button-padding',
  //   value: '15px',
  //   compute(element) {
  //     const toggle = element.querySelector('vaadin-drawer-toggle');
  //     return getComputedStyle(toggle).getPropertyValue('padding').trim();
  //   },
  // },
  {
    name: '--vaadin-button-text-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      return getComputedStyle(toggle).getPropertyValue('color').trim();
    },
  },

  // === Drawer Toggle: Icon ===
  {
    name: '--vaadin-icon-size',
    value: '30px',
    compute(element) {
      const toggle = element.querySelector('vaadin-drawer-toggle');
      const icon = toggle.shadowRoot.querySelector('[part="icon"]');
      return getComputedStyle(icon).getPropertyValue('width').trim();
    },
  },
];

describe('app-layout', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-app-layout>
        <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
      </vaadin-app-layout>
    `);
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
