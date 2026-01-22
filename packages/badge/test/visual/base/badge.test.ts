import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
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

  it('primary', async () => {
    element.textContent = 'Badge';
    element.setAttribute('theme', 'primary');
    await visualDiff(div, 'primary');
  });

  it('primary empty', async () => {
    element.setAttribute('theme', 'primary');
    await visualDiff(div, 'primary-empty');
  });
});
