import '../vaadin-chart-base-theme.js';
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const chartColors = css`
  :host {
    --vaadin-charts-color-0: #5ac2f7;
    --vaadin-charts-color-1: #1676f3;
    --vaadin-charts-color-2: #ff7d94;
    --vaadin-charts-color-3: #c5164e;
    --vaadin-charts-color-4: #15c15d;
    --vaadin-charts-color-5: #0e8151;
    --vaadin-charts-color-6: #c18ed2;
    --vaadin-charts-color-7: #9233b3;
    --vaadin-charts-color-8: #fda253;
    --vaadin-charts-color-9: #e24932;
    --vaadin-charts-color-positive: var(--vaadin-charts-color-4, #15c15d);
    --vaadin-charts-color-negative: var(--vaadin-charts-color-9, #e24932);
  }

  :host([theme~='gradient']) {
    --vaadin-charts-color-0: #1676f3;
    --vaadin-charts-color-1: #13bbf0;
    --vaadin-charts-color-2: #1ee;
    --vaadin-charts-color-3: #0cd9bf;
    --vaadin-charts-color-4: #06be81;
    --vaadin-charts-color-5: #00a344;
    --vaadin-charts-color-6: #41c639;
    --vaadin-charts-color-7: #8aed2c;
    --vaadin-charts-color-8: #c0e632;
    --vaadin-charts-color-9: #f6db3a;
    --vaadin-charts-color-positive: var(--vaadin-charts-color-6);
    --vaadin-charts-color-negative: var(--vaadin-charts-color-1);
  }

  :host([theme~='monotone']) {
    --vaadin-charts-color-0: #1676f3;
    --vaadin-charts-color-1: #4795f5;
    --vaadin-charts-color-2: #71b0f7;
    --vaadin-charts-color-3: #a0cef9;
    --vaadin-charts-color-4: #bce0fa;
    --vaadin-charts-color-5: #a8d8ed;
    --vaadin-charts-color-6: #7fc3dd;
    --vaadin-charts-color-7: #54adcc;
    --vaadin-charts-color-8: #2b99bc;
    --vaadin-charts-color-9: #0284ac;
    --vaadin-charts-color-positive: var(--vaadin-charts-color-3);
    --vaadin-charts-color-negative: var(--vaadin-charts-color-9);
  }

  :host([theme~='classic']) {
    --vaadin-charts-color-0: #7cb5ec;
    --vaadin-charts-color-1: #434348;
    --vaadin-charts-color-2: #90ed7d;
    --vaadin-charts-color-3: #f7a35c;
    --vaadin-charts-color-4: #8085e9;
    --vaadin-charts-color-5: #f15c80;
    --vaadin-charts-color-6: #e4d354;
    --vaadin-charts-color-7: #2b908f;
    --vaadin-charts-color-8: #f45b5b;
    --vaadin-charts-color-9: #91e8e1;
  }
`;

const chartTheme = css`
  :host {
    --vaadin-charts-background: var(--lumo-base-color);
    --vaadin-charts-title-label: var(--lumo-header-text-color);
    --vaadin-charts-axis-title: var(--lumo-secondary-text-color);
    --vaadin-charts-axis-label: var(--lumo-secondary-text-color);
    --vaadin-charts-data-label: var(--lumo-body-text-color);
    --vaadin-charts-secondary-label: var(--lumo-secondary-text-color);
    --vaadin-charts-axis-line: var(--lumo-contrast-5pct);
    --vaadin-charts-grid-line: var(--lumo-contrast-20pct);
    --vaadin-charts-disabled-label: var(--lumo-disabled-text-color);
    --vaadin-charts-contrast: var(--lumo-contrast);
    --vaadin-charts-contrast-5pct: var(--lumo-contrast-5pct);
    --vaadin-charts-contrast-10pct: var(--lumo-contrast-10pct);
    --vaadin-charts-contrast-20pct: var(--lumo-contrast-20pct);
    --vaadin-charts-contrast-60pct: var(--lumo-contrast-60pct);
    --vaadin-charts-tooltip-background: var(--lumo-base-color);
    --vaadin-charts-tooltip-border-color: inherit;
    --vaadin-charts-button-label: var(--lumo-primary-text-color);
    --vaadin-charts-button-background: var(--lumo-contrast-5pct);
    --vaadin-charts-button-hover-background: var(--lumo-primary-color-10pct);
    --vaadin-charts-button-active-label: var(--lumo-primary-contrast-color);
    --vaadin-charts-button-active-background: var(--lumo-primary-color);
    --vaadin-charts-xaxis-line-width: 0;
    --vaadin-charts-tooltip-background-opacity: 1;
    font-family: var(--lumo-font-family);
  }
`;

registerStyles('vaadin-chart', [chartColors, chartTheme], { moduleId: 'lumo-chart' });

export { chartColors, chartTheme };
