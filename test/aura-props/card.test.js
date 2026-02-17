import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/card/src/vaadin-card.js';

// TODO: --vaadin-card-padding fails because Aura theme recalculates --_padding as
// calc(var(--vaadin-card-padding) - var(--vaadin-card-border-width, 1px)) in card.css:16,
// so the computed padding doesn't directly match the custom property value.

export const props = [
  // === Card Surface ===
  {
    name: '--vaadin-card-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-card-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element, '::before').getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-card-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-card-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element, '::before').getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-card-gap',
    value: '30px',
    setup(element) {
      const title = document.createElement('div');
      title.slot = 'title';
      title.textContent = 'Title';
      element.appendChild(title);
      const content = document.createElement('div');
      content.textContent = 'Content';
      element.appendChild(content);
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-card-padding',
    value: '30px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-card-shadow',
    value: 'rgb(255, 0, 0) 0px 0px 10px 0px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('box-shadow').trim();
    },
  },

  // === Media ===
  {
    name: '--vaadin-card-media-aspect-ratio',
    value: '4 / 3',
    setup(element) {
      element.setAttribute('theme', 'cover-media');
      const img = document.createElement('img');
      img.slot = 'media';
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      img.alt = '';
      element.appendChild(img);
    },
    compute(element) {
      const img = element.querySelector('[slot="media"]');
      return getComputedStyle(img).getPropertyValue('aspect-ratio').trim();
    },
  },

  // === Title ===
  {
    name: '--vaadin-card-title-color',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      const title = document.createElement('div');
      title.slot = 'title';
      title.textContent = 'Test Title';
      element.appendChild(title);
    },
    compute(element) {
      const title = element.querySelector('[slot="title"]');
      return getComputedStyle(title).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-card-title-font-size',
    value: '24px',
    setup(element) {
      const title = document.createElement('div');
      title.slot = 'title';
      title.textContent = 'Test Title';
      element.appendChild(title);
    },
    compute(element) {
      const title = element.querySelector('[slot="title"]');
      return getComputedStyle(title).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-card-title-font-weight',
    value: '800',
    setup(element) {
      const title = document.createElement('div');
      title.slot = 'title';
      title.textContent = 'Test Title';
      element.appendChild(title);
    },
    compute(element) {
      const title = element.querySelector('[slot="title"]');
      return getComputedStyle(title).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-card-title-line-height',
    value: '40px',
    setup(element) {
      const title = document.createElement('div');
      title.slot = 'title';
      title.textContent = 'Test Title';
      element.appendChild(title);
    },
    compute(element) {
      const title = element.querySelector('[slot="title"]');
      return getComputedStyle(title).getPropertyValue('line-height').trim();
    },
  },

  // === Subtitle ===
  {
    name: '--vaadin-card-subtitle-color',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      const subtitle = document.createElement('div');
      subtitle.slot = 'subtitle';
      subtitle.textContent = 'Test Subtitle';
      element.appendChild(subtitle);
    },
    compute(element) {
      const subtitle = element.querySelector('[slot="subtitle"]');
      return getComputedStyle(subtitle).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-card-subtitle-font-size',
    value: '18px',
    setup(element) {
      const subtitle = document.createElement('div');
      subtitle.slot = 'subtitle';
      subtitle.textContent = 'Test Subtitle';
      element.appendChild(subtitle);
    },
    compute(element) {
      const subtitle = element.querySelector('[slot="subtitle"]');
      return getComputedStyle(subtitle).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-card-subtitle-font-weight',
    value: '700',
    setup(element) {
      const subtitle = document.createElement('div');
      subtitle.slot = 'subtitle';
      subtitle.textContent = 'Test Subtitle';
      element.appendChild(subtitle);
    },
    compute(element) {
      const subtitle = element.querySelector('[slot="subtitle"]');
      return getComputedStyle(subtitle).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-card-subtitle-line-height',
    value: '30px',
    setup(element) {
      const subtitle = document.createElement('div');
      subtitle.slot = 'subtitle';
      subtitle.textContent = 'Test Subtitle';
      element.appendChild(subtitle);
    },
    compute(element) {
      const subtitle = element.querySelector('[slot="subtitle"]');
      return getComputedStyle(subtitle).getPropertyValue('line-height').trim();
    },
  },
];

describe('card', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-card></vaadin-card>');
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
