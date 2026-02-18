import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon';
import '@vaadin/icons';
import '../../../src/vaadin-badge.js';
import type { Icon } from '@vaadin/icon';
import type { Badge } from '../../../src/vaadin-badge.js';

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
    beforeEach(() => {
      element.number = 3;
      const icon = document.createElement('vaadin-icon');
      icon.setAttribute('slot', 'icon');
      icon.icon = 'vaadin:check';
      element.appendChild(icon);
      element.append('Completed');
    });

    it('icon-only', async () => {
      element.setAttribute('theme', 'icon-only');
      await visualDiff(div, 'theme-icon-only');
    });

    it('number-only', async () => {
      element.setAttribute('theme', 'number-only');
      await visualDiff(div, 'theme-number-only');
    });

    it('dot', async () => {
      element.setAttribute('theme', 'dot');
      await visualDiff(div, 'theme-dot');
    });
  });
});
