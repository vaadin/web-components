import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '@vaadin/icon';
import '@vaadin/icons';
import '../../../vaadin-badge.js';
import type { Icon } from '@vaadin/icon';
import type { Badge } from '../../../vaadin-badge.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.badgeComponent = true;

describe('badge', () => {
  let div: HTMLDivElement;
  let element: Badge;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-badge></vaadin-badge>', div);
  });

  it('basic', async () => {
    element.textContent = 'Badge';
    await visualDiff(div, 'basic');
  });

  describe('number', () => {
    beforeEach(() => {
      element.number = 3;
    });

    it('number', async () => {
      await visualDiff(div, 'number');
    });

    it('number-content', async () => {
      element.textContent = 'Messages';
      await visualDiff(div, 'number-content');
    });

    it('number-only', async () => {
      const icon = document.createElement('vaadin-icon');
      icon.setAttribute('slot', 'icon');
      icon.icon = 'vaadin:check';
      element.appendChild(icon);
      element.append('Completed');
      element.setAttribute('theme', 'number-only');
      await visualDiff(div, 'number-only');
    });
  });

  describe('icon', () => {
    let icon: Icon;

    beforeEach(() => {
      icon = document.createElement('vaadin-icon');
      icon.setAttribute('slot', 'icon');
      icon.icon = 'vaadin:check';
    });

    it('icon', async () => {
      element.appendChild(icon);
      await visualDiff(div, 'icon');
    });

    it('icon-content', async () => {
      element.appendChild(icon);
      element.append('Completed');
      await visualDiff(div, 'icon-content');
    });

    it('icon-number-content', async () => {
      element.number = 3;
      element.appendChild(icon);
      element.append('Completed');
      await visualDiff(div, 'icon-number-content');
    });

    it('icon-only', async () => {
      element.number = 3;
      element.appendChild(icon);
      element.append('Completed');
      element.setAttribute('theme', 'icon-only');
      await visualDiff(div, 'icon-only');
    });
  });

  ['success', 'error', 'warning', 'dot'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.textContent = 'Badge';
        element.setAttribute('theme', variant);
        await visualDiff(div, `theme-${variant}`);
      });
    });
  });

  ['success', 'error', 'warning', 'info', 'neutral'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.textContent = 'Badge';
        element.classList.add(`v-${variant}`);
        await visualDiff(div, `v-${variant}`);
      });

      it(`${variant} filled`, async () => {
        element.textContent = 'Badge';
        element.classList.add(`v-${variant}`);
        element.setAttribute('theme', 'filled');
        await visualDiff(div, `v-${variant}-filled`);
      });
    });
  });
});
