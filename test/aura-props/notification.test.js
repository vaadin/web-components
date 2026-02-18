import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/notification/src/vaadin-notification.js';

// TODO: --vaadin-notification-shadow fails because Aura theme's overlay.css:32 sets
// box-shadow on ::part(overlay) to a compound value combining --aura-overlay-outline-shadow
// with var(--vaadin-overlay-shadow, var(--aura-overlay-shadow)), which overrides the
// notification base styles' box-shadow: var(--vaadin-notification-shadow, ...) entirely.

export const props = [
  // === Notification Card ===
  {
    name: '--vaadin-notification-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-notification-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-notification-border-radius',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-notification-border-width',
    value: '5px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-notification-padding',
    value: '30px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-notification-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('box-shadow').trim();
    },
  },
  {
    name: '--vaadin-notification-width',
    value: '500px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const card = element._card;
      const overlay = card.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlay).getPropertyValue('width').trim();
    },
  },

  // === Notification Container ===
  {
    name: '--vaadin-notification-container-gap',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const container = element._container;
      return getComputedStyle(container).getPropertyValue('--_gap').trim();
    },
  },
  {
    name: '--vaadin-notification-viewport-inset',
    value: '30px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const container = element._container;
      return getComputedStyle(container).getPropertyValue('--_padding').trim();
    },
  },
];

describe('notification', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-notification duration="0"></vaadin-notification>');
    element.renderer = (root) => {
      root.textContent = 'Test notification';
    };
    await nextUpdate(element);
  });

  afterEach(() => {
    element.opened = false;
    // Clean up properties set on document root
    props.forEach(({ name }) => {
      document.documentElement.style.removeProperty(name);
    });
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      // Notification card is placed in a global container outside the component,
      // so custom properties must be set on the document root to cascade properly.
      document.documentElement.style.setProperty(name, value);
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
