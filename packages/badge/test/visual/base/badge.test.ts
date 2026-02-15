import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/icon';
import '@vaadin/icons';
import '../../../src/vaadin-badge.js';
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

  it('empty', async () => {
    await visualDiff(div, 'empty');
  });

  it('icon', async () => {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('slot', 'icon');
    icon.icon = 'vaadin:check';
    element.appendChild(icon);
    element.append('Completed');
    await visualDiff(div, 'icon');
  });

  it('icon-only', async () => {
    const icon = document.createElement('vaadin-icon');
    icon.setAttribute('slot', 'icon');
    icon.icon = 'vaadin:check';
    element.appendChild(icon);
    await visualDiff(div, 'icon-only');
  });
});
