window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/master-detail-layout/src/vaadin-master-detail-layout.js';

// TODO: --vaadin-master-detail-layout-detail-background fails because Aura theme
// overrides background directly on ::part(detail) in master-detail-layout.css:3
// with `var(--aura-surface-color) padding-box`, which takes precedence.

export const props = [
  // === Border ===
  {
    name: '--vaadin-master-detail-layout-border-color',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      // Border is visible in non-drawer/non-stack mode when detail content is present
      const detail = document.createElement('div');
      detail.setAttribute('slot', 'detail');
      detail.textContent = 'Detail';
      element.appendChild(detail);
    },
    compute(element) {
      const detail = element.shadowRoot.querySelector('[part="detail"]');
      return getComputedStyle(detail).getPropertyValue('border-inline-start-color').trim();
    },
  },
  {
    name: '--vaadin-master-detail-layout-border-width',
    value: '5px',
    setup(element) {
      const detail = document.createElement('div');
      detail.setAttribute('slot', 'detail');
      detail.textContent = 'Detail';
      element.appendChild(detail);
    },
    compute(element) {
      const detail = element.shadowRoot.querySelector('[part="detail"]');
      return getComputedStyle(detail).getPropertyValue('border-inline-start-width').trim();
    },
  },

  // === Detail Area (drawer/stack mode) ===
  {
    name: '--vaadin-master-detail-layout-detail-background',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      element.forceOverlay = true;
      element.stackOverlay = true;
      const detail = document.createElement('div');
      detail.setAttribute('slot', 'detail');
      detail.textContent = 'Detail';
      element.appendChild(detail);
    },
    compute(element) {
      const detail = element.shadowRoot.querySelector('[part="detail"]');
      return getComputedStyle(detail).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-master-detail-layout-detail-shadow',
    value: 'rgb(0, 0, 255) 0px 0px 10px 0px',
    setup(element) {
      element.forceOverlay = true;
      element.stackOverlay = true;
      const detail = document.createElement('div');
      detail.setAttribute('slot', 'detail');
      detail.textContent = 'Detail';
      element.appendChild(detail);
    },
    compute(element) {
      const detail = element.shadowRoot.querySelector('[part="detail"]');
      return getComputedStyle(detail).getPropertyValue('box-shadow').trim();
    },
  },

  // === Backdrop (drawer mode) ===
  {
    name: '--vaadin-overlay-backdrop-background',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.forceOverlay = true;
      const detail = document.createElement('div');
      detail.setAttribute('slot', 'detail');
      detail.textContent = 'Detail';
      element.appendChild(detail);
    },
    compute(element) {
      const backdrop = element.shadowRoot.querySelector('[part="backdrop"]');
      return getComputedStyle(backdrop).getPropertyValue('background-color').trim();
    },
  },
];

describe('master-detail-layout', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-master-detail-layout style="width: 600px; height: 400px;">
        <div>Master</div>
      </vaadin-master-detail-layout>
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
