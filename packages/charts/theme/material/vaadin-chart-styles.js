import '../vaadin-chart-base-theme.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

const chartColors = css`
  :host {
    --vaadin-charts-color-0: #6200ee;
    --vaadin-charts-color-1: #2fa69a;
    --vaadin-charts-color-2: #ec611f;
    --vaadin-charts-color-3: #fec02f;
    --vaadin-charts-color-4: #ff4193;
    --vaadin-charts-color-5: #007dee;
    --vaadin-charts-color-6: #b064fc;
    --vaadin-charts-color-7: #0c5d56;
    --vaadin-charts-color-8: #42c6ff;
    --vaadin-charts-color-9: #b00020;
    --vaadin-charts-color-positive: var(--vaadin-charts-color-1, #2fa69a);
    --vaadin-charts-color-negative: var(--vaadin-charts-color-9, #b00020);
  }

  :host([theme~='gradient']) {
    --vaadin-charts-color-0: #6200ee;
    --vaadin-charts-color-1: #6962e8;
    --vaadin-charts-color-2: #619fe1;
    --vaadin-charts-color-3: #2fbfd3;
    --vaadin-charts-color-4: #03dac6;
    --vaadin-charts-color-5: #5bd091;
    --vaadin-charts-color-6: #acc65e;
    --vaadin-charts-color-7: #ffbc2b;
    --vaadin-charts-color-8: #fe9940;
    --vaadin-charts-color-9: #fd695e;
    --vaadin-charts-color-positive: var(--vaadin-charts-color-6);
    --vaadin-charts-color-negative: var(--vaadin-charts-color-9);
  }

  :host([theme~='monotone']) {
    --vaadin-charts-color-0: #6200ee;
    --vaadin-charts-color-1: #7f39fb;
    --vaadin-charts-color-2: #985eff;
    --vaadin-charts-color-3: #bb86fc;
    --vaadin-charts-color-4: #dbb2ff;
    --vaadin-charts-color-5: #ecddfd;
    --vaadin-charts-color-6: #9fe3eb;
    --vaadin-charts-color-7: #03dac6;
    --vaadin-charts-color-8: #00c4b4;
    --vaadin-charts-color-9: #01a299;
    --vaadin-charts-color-positive: var(--vaadin-charts-color-8);
    --vaadin-charts-color-negative: var(--vaadin-charts-color-0);
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
    --vaadin-charts-background: var(--material-background-color);
    --vaadin-charts-title-label: var(--material-body-text-color);
    --vaadin-charts-axis-title: var(--material-secondary-text-color);
    --vaadin-charts-axis-label: var(--material-secondary-text-color);
    --vaadin-charts-data-label: var(--material-body-text-color);
    --vaadin-charts-secondary-label: var(--material-secondary-text-color);
    --vaadin-charts-axis-line: var(--vaadin-charts-contrast-5pct);
    --vaadin-charts-grid-line: var(--vaadin-charts-contrast-10pct);
    --vaadin-charts-disabled-label: var(--material-disabled-text-color);
    --vaadin-charts-contrast: var(--material-body-text-color);
    --vaadin-charts-contrast-5pct: var(--material-secondary-background-color);
    --vaadin-charts-contrast-10pct: var(--material-divider-color);
    --vaadin-charts-contrast-20pct: var(--material-disabled-color);
    --vaadin-charts-contrast-60pct: var(--material-secondary-text-color);
    --vaadin-charts-tooltip-background: var(--material-background-color);
    --vaadin-charts-tooltip-border-color: var(--material-background-color);
    --vaadin-charts-button-label: var(--material-primary-color);
    --vaadin-charts-button-background: var(--material-background-color);
    --vaadin-charts-button-hover-background: var(--material-secondary-background-color);
    --vaadin-charts-button-active-label: var(--material-primary-contrast-color);
    --vaadin-charts-button-active-background: var(--material-primary-color);
    --vaadin-charts-xaxis-line-width: 0;
    --vaadin-charts-tooltip-background-opacity: 1;
    font-family: var(--material-font-family);
  }
`;

registerStyles('vaadin-chart', [chartColors, chartTheme], { moduleId: 'material-chart' });

export { chartColors, chartTheme };
