import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/badge.css';
import '../../../src/vaadin-badge.js';

describe('badge', () => {
  let div, _element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
  });

  it('theme variants', async () => {
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';

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

    const html = variants
      .map((variant) => {
        const text = variant === 'default' ? 'Default' : variant.charAt(0).toUpperCase() + variant.slice(1);
        const themeAttr = variant === 'default' ? '' : ` theme="${variant}"`;
        return `<vaadin-badge${themeAttr}>${text}</vaadin-badge>`;
      })
      .join('\n');

    _element = fixtureSync(html, div);
    await visualDiff(div, 'theme-variants');
  });

  it('size variants', async () => {
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';

    _element = fixtureSync(
      `
      <vaadin-badge>Regular</vaadin-badge>
      <vaadin-badge theme="small">Small</vaadin-badge>
    `,
      div,
    );

    await visualDiff(div, 'size-variants');
  });

  it('pill variant', async () => {
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';

    _element = fixtureSync(
      `
      <vaadin-badge>Regular</vaadin-badge>
      <vaadin-badge theme="pill">Pill</vaadin-badge>
      <vaadin-badge theme="pill primary">Pill Primary</vaadin-badge>
    `,
      div,
    );

    await visualDiff(div, 'pill-variant');
  });

  it('empty badges', async () => {
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.style.gap = '8px';
    div.style.alignItems = 'center';

    const variants = ['default', 'primary', 'success', 'error', 'warning', 'contrast'];
    const html = variants
      .map((variant) => {
        const themeAttr = variant === 'default' ? '' : ` theme="${variant}"`;
        return `<vaadin-badge${themeAttr}></vaadin-badge>`;
      })
      .join('\n');

    _element = fixtureSync(html, div);
    await visualDiff(div, 'empty-badges');
  });

  it('empty small badges', async () => {
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.style.gap = '8px';
    div.style.alignItems = 'center';

    const variants = ['default', 'primary', 'success', 'error', 'warning', 'contrast'];
    const html = variants
      .map((variant) => {
        const theme = variant === 'default' ? 'small' : `${variant} small`;
        return `<vaadin-badge theme="${theme}"></vaadin-badge>`;
      })
      .join('\n');

    _element = fixtureSync(html, div);
    await visualDiff(div, 'empty-small-badges');
  });

  it('combinations', async () => {
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '8px';

    _element = fixtureSync(
      `
      <vaadin-badge theme="error small">Error Small</vaadin-badge>
      <vaadin-badge theme="success primary pill">Success Primary Pill</vaadin-badge>
      <vaadin-badge theme="error primary">99+</vaadin-badge>
      <vaadin-badge theme="success">New</vaadin-badge>
      <vaadin-badge theme="warning primary small">!</vaadin-badge>
    `,
      div,
    );

    await visualDiff(div, 'combinations');
  });
});
