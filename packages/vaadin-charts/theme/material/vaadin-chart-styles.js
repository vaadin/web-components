import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
    'vaadin-chart',
    css`
    :host {
      --vaadin-charts-color-0: #6200EE;
      --vaadin-charts-color-1: #2FA69A;
      --vaadin-charts-color-2: #EC611F;
      --vaadin-charts-color-3: #FEC02F;
      --vaadin-charts-color-4: #FF4193;
      --vaadin-charts-color-5: #007DEE;
      --vaadin-charts-color-6: #B064FC;
      --vaadin-charts-color-7: #0C5D56;
      --vaadin-charts-color-8: #42C6FF;
      --vaadin-charts-color-9: #B00020;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-1, #2FA69A);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-9, #B00020);
    
      --vaadin-charts-background: var(--material-background-color);
      --vaadin-charts-title-label: var(--material-body-text-color);
      --vaadin-charts-axis-title: var(--material-secondary-text-color);
      --vaadin-charts-axis-label: var(--material-secondary-text-color);
      --vaadin-charts-data-label: var(--material-body-text-color);
      --vaadin-charts-secondary-label: var(--material-secondary-text-color);
      --vaadin-charts-axis-line: #CFD8DC;
      --vaadin-charts-xaxis-line-width: 0;
      --vaadin-charts-grid-line: #ECEFF1;
      --vaadin-charts-disabled-label: var(--material-disabled-text-color);

      --vaadin-charts-contrast: var(--material-body-text-color);
      --vaadin-charts-contrast-5pct: #ECEFF1;
      --vaadin-charts-contrast-10pct: #ECEFF1;
      --vaadin-charts-contrast-20pct: #CFD8DC;
      --vaadin-charts-contrast-60pct: #607D8B;

      --vaadin-charts-tooltip-background: var(--material-background-color);
      --vaadin-charts-tooltip-background-opacity: 1;
      --vaadin-charts-tooltip-border-color: var(--material-background-color);

      --vaadin-charts-button-label: var(--material-primary-color);
      --vaadin-charts-button-background: var(--material-background-color);
      --vaadin-charts-button-hover-background: var(--material-secondary-background-color);
      --vaadin-charts-button-active-label: var(--material-primary-contrast-color);
      --vaadin-charts-button-active-background: var(--material-primary-color);
    }
    
    :host([theme~="gradient"]) {
      --vaadin-charts-color-0: #6200EE;
      --vaadin-charts-color-1: #6962E8;
      --vaadin-charts-color-2: #619FE1;
      --vaadin-charts-color-3: #2FBFD3;
      --vaadin-charts-color-4: #03DAC6;
      --vaadin-charts-color-5: #5BD091;
      --vaadin-charts-color-6: #ACC65E;
      --vaadin-charts-color-7: #FFBC2B;
      --vaadin-charts-color-8: #FE9940;
      --vaadin-charts-color-9: #FD695E;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-6);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-9);
    }
    
    :host([theme~="monotone"]) {
      --vaadin-charts-color-0: #6200EE;
      --vaadin-charts-color-1: #7F39FB;
      --vaadin-charts-color-2: #985EFF;
      --vaadin-charts-color-3: #BB86FC;
      --vaadin-charts-color-4: #DBB2FF;
      --vaadin-charts-color-5: #ECDDFD;
      --vaadin-charts-color-6: #9FE3EB;
      --vaadin-charts-color-7: #03DAC6;
      --vaadin-charts-color-8: #00C4B4;
      --vaadin-charts-color-9: #01A299;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-8);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-0);
    }
    
    .highcharts-container {
      font-family: var(--material-font-family, 'Roboto', sans-serif);
    }
  `,
    { moduleId: 'material-chart' }
);
