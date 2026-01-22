import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../src/vaadin-badge.js';

describe('badge', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';
    div.style.padding = '10px';
  });

  it('theme variants', async () => {
    const variants = [
      'default',
      'primary',
      'success',
      'error',
      'warning',
      'contrast',
      'success primary',
      'error primary',
      'warning primary',
      'contrast primary',
    ];

    variants.forEach((variant) => {
      const badge = fixtureSync('<vaadin-badge></vaadin-badge>', div);
      badge.textContent = variant === 'default' ? 'Default' : variant.charAt(0).toUpperCase() + variant.slice(1);
      if (variant !== 'default') {
        badge.setAttribute('theme', variant);
      }
    });

    await visualDiff(div, 'theme-variants');
  });

  it('size variants', async () => {
    const regular = fixtureSync('<vaadin-badge></vaadin-badge>', div);
    regular.textContent = 'Regular';

    const small = fixtureSync('<vaadin-badge></vaadin-badge>', div);
    small.textContent = 'Small';
    small.setAttribute('theme', 'small');

    await visualDiff(div, 'size-variants');
  });

  it('pill variant', async () => {
    const regular = fixtureSync('<vaadin-badge></vaadin-badge>', div);
    regular.textContent = 'Regular';

    const pill = fixtureSync('<vaadin-badge></vaadin-badge>', div);
    pill.textContent = 'Pill';
    pill.setAttribute('theme', 'pill');

    const pillPrimary = fixtureSync('<vaadin-badge></vaadin-badge>', div);
    pillPrimary.textContent = 'Pill Primary';
    pillPrimary.setAttribute('theme', 'pill primary');

    await visualDiff(div, 'pill-variant');
  });

  it('empty badges', async () => {
    const variants = ['default', 'primary', 'success', 'error', 'warning', 'contrast'];

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    div.appendChild(row);

    variants.forEach((variant) => {
      const badge = fixtureSync('<vaadin-badge></vaadin-badge>', row);
      if (variant !== 'default') {
        badge.setAttribute('theme', variant);
      }
    });

    await visualDiff(div, 'empty-badges');
  });

  it('empty small badges', async () => {
    const variants = ['default', 'primary', 'success', 'error', 'warning', 'contrast'];

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    div.appendChild(row);

    variants.forEach((variant) => {
      const badge = fixtureSync('<vaadin-badge></vaadin-badge>', row);
      if (variant === 'default') {
        badge.setAttribute('theme', 'small');
      } else {
        badge.setAttribute('theme', `${variant} small`);
      }
    });

    await visualDiff(div, 'empty-small-badges');
  });

  it('combinations', async () => {
    const combinations = [
      { text: 'Error Small', theme: 'error small' },
      { text: 'Success Primary Pill', theme: 'success primary pill' },
      { text: '99+', theme: 'error primary' },
      { text: 'New', theme: 'success' },
      { text: '!', theme: 'warning primary small' },
    ];

    combinations.forEach((combo) => {
      const badge = fixtureSync('<vaadin-badge></vaadin-badge>', div);
      badge.textContent = combo.text;
      badge.setAttribute('theme', combo.theme);
    });

    await visualDiff(div, 'combinations');
  });
});
