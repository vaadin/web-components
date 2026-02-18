import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/login/src/vaadin-login-form.js';
import '@vaadin/login/src/vaadin-login-overlay.js';

// TODO: --vaadin-login-overlay-background fails because Aura theme's overlay.css:29 sets
// background directly on ::part(overlay) with --aura-surface-color and surface opacity,
// overriding the login-specific custom property fallback chain.
//
// TODO: --vaadin-login-overlay-shadow fails because Aura theme combines it with
// --aura-overlay-outline-shadow in overlay.css:32, so the computed box-shadow doesn't
// match the custom property value alone.
//
// TODO: --vaadin-login-overlay-brand-padding fails because Aura theme's login.css:32 sets
// padding-bottom: 0 on ::part(brand), so the computed padding shorthand includes "0px"
// for the bottom value instead of matching the custom property value.

export const formProps = [
  // === Form Surface ===
  {
    name: '--vaadin-login-form-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      return getComputedStyle(wrapper).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-login-form-border-radius',
    value: '20px',
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      return getComputedStyle(wrapper).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-login-form-gap',
    value: '30px',
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      return getComputedStyle(wrapper).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-login-form-padding',
    value: '40px',
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      return getComputedStyle(wrapper).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-login-form-width',
    value: '500px',
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      return getComputedStyle(wrapper).getPropertyValue('width').trim();
    },
  },

  // === Form Title ===
  {
    name: '--vaadin-login-form-title-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const title = element.shadowRoot.querySelector('[part="form-title"]');
      return getComputedStyle(title).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-login-form-title-font-size',
    value: '30px',
    compute(element) {
      const title = element.shadowRoot.querySelector('[part="form-title"]');
      return getComputedStyle(title).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-login-form-title-font-weight',
    value: '800',
    compute(element) {
      const title = element.shadowRoot.querySelector('[part="form-title"]');
      return getComputedStyle(title).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-login-form-title-line-height',
    value: '40px',
    compute(element) {
      const title = element.shadowRoot.querySelector('[part="form-title"]');
      return getComputedStyle(title).getPropertyValue('line-height').trim();
    },
  },

  // === Form Error Message ===
  {
    name: '--vaadin-login-form-error-color',
    value: 'rgb(200, 50, 50)',
    setup(element) {
      element.error = true;
    },
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      const errorMessage = wrapper.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(errorMessage).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-login-form-error-font-size',
    value: '18px',
    setup(element) {
      element.error = true;
    },
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      const errorMessage = wrapper.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(errorMessage).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-login-form-error-font-weight',
    value: '700',
    setup(element) {
      element.error = true;
    },
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      const errorMessage = wrapper.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(errorMessage).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-login-form-error-gap',
    value: '20px',
    setup(element) {
      element.error = true;
    },
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      const errorMessage = wrapper.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(errorMessage).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-login-form-error-line-height',
    value: '24px',
    setup(element) {
      element.error = true;
    },
    compute(element) {
      const wrapper = element.shadowRoot.querySelector('[part="form"]');
      const errorMessage = wrapper.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(errorMessage).getPropertyValue('line-height').trim();
    },
  },
];

export const overlayProps = [
  // === Overlay Surface ===
  {
    name: '--vaadin-login-overlay-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-border-radius',
    value: '20px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-border-width',
    value: '5px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },

  // === Overlay Brand ===
  {
    name: '--vaadin-login-overlay-brand-background',
    value: 'rgb(100, 0, 200)',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const brand = overlay.shadowRoot.querySelector('[part="brand"]');
      return getComputedStyle(brand).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-brand-padding',
    value: '50px',
    async setup(element) {
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const brand = overlay.shadowRoot.querySelector('[part="brand"]');
      return getComputedStyle(brand).getPropertyValue('padding').trim();
    },
  },

  // === Overlay Title ===
  {
    name: '--vaadin-login-overlay-title-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      element.title = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const titleSlot = element.querySelector('[slot="title"]');
      return getComputedStyle(titleSlot).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-title-font-size',
    value: '30px',
    async setup(element) {
      element.title = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const titleSlot = element.querySelector('[slot="title"]');
      return getComputedStyle(titleSlot).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-title-font-weight',
    value: '800',
    async setup(element) {
      element.title = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const titleSlot = element.querySelector('[slot="title"]');
      return getComputedStyle(titleSlot).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-title-line-height',
    value: '40px',
    async setup(element) {
      element.title = 'Test Title';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const titleSlot = element.querySelector('[slot="title"]');
      return getComputedStyle(titleSlot).getPropertyValue('line-height').trim();
    },
  },

  // === Overlay Description ===
  {
    name: '--vaadin-login-overlay-description-color',
    value: 'rgb(150, 100, 50)',
    async setup(element) {
      element.description = 'Test Description';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const description = overlay.shadowRoot.querySelector('[part="description"]');
      return getComputedStyle(description).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-description-font-size',
    value: '20px',
    async setup(element) {
      element.description = 'Test Description';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const description = overlay.shadowRoot.querySelector('[part="description"]');
      return getComputedStyle(description).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-description-font-weight',
    value: '700',
    async setup(element) {
      element.description = 'Test Description';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const description = overlay.shadowRoot.querySelector('[part="description"]');
      return getComputedStyle(description).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-login-overlay-description-line-height',
    value: '28px',
    async setup(element) {
      element.description = 'Test Description';
      element.opened = true;
      await nextRender();
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const description = overlay.shadowRoot.querySelector('[part="description"]');
      return getComputedStyle(description).getPropertyValue('line-height').trim();
    },
  },
];

describe('login-form', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-login-form></vaadin-login-form>');
    await nextRender();
  });

  formProps.forEach(({ name, value, setup, compute }) => {
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

describe('login-overlay', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-login-overlay></vaadin-login-overlay>');
    await nextUpdate(element);
  });

  afterEach(() => {
    element.opened = false;
  });

  overlayProps.forEach(({ name, value, setup, compute }) => {
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
