import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/badge.css';
import '@vaadin/icon';
import '@vaadin/icons';
import '../../../vaadin-badge.js';
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

  it('empty', async () => {
    await visualDiff(div, 'empty');
  });

  it('primary', async () => {
    element.textContent = 'Badge';
    element.setAttribute('theme', 'primary');
    await visualDiff(div, 'primary');
  });

  it('small', async () => {
    element.textContent = 'Badge';
    element.setAttribute('theme', 'small');
    await visualDiff(div, 'small');
  });

  it('small empty', async () => {
    element.setAttribute('theme', 'small');
    await visualDiff(div, 'small-empty');
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

  ['success', 'error', 'warning', 'contrast'].forEach((variant) => {
    describe(variant, () => {
      it(variant, async () => {
        element.textContent = 'Badge';
        element.setAttribute('theme', variant);
        await visualDiff(div, variant);
      });

      it(`${variant} primary`, async () => {
        element.textContent = 'Badge';
        element.setAttribute('theme', `${variant} primary`);
        await visualDiff(div, `${variant}-primary`);
      });

      it(`${variant} empty`, async () => {
        element.setAttribute('theme', variant);
        await visualDiff(div, `${variant}-empty`);
      });
    });
  });
});
