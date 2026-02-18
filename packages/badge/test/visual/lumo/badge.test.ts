import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/badge.css';
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

  it('number', async () => {
    element.number = 5;
    await visualDiff(div, 'number');
  });

  it('number-content', async () => {
    element.number = 3;
    element.textContent = 'Messages';
    await visualDiff(div, 'number-content');
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
  });

  describe('theme', () => {
    it('primary', async () => {
      element.textContent = 'Badge';
      element.setAttribute('theme', 'primary');
      await visualDiff(div, 'theme-primary');
    });

    it('small', async () => {
      element.textContent = 'Badge';
      element.setAttribute('theme', 'small');
      await visualDiff(div, 'theme-small');
    });
  });

  ['success', 'error', 'warning', 'contrast'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.textContent = 'Badge';
        element.setAttribute('theme', variant);
        await visualDiff(div, `theme-${variant}`);
      });

      it(`${variant} primary`, async () => {
        element.textContent = 'Badge';
        element.setAttribute('theme', `${variant} primary`);
        await visualDiff(div, `theme-${variant}-primary`);
      });
    });
  });
});
