import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-lumo-styles/color.js';

registerStyles(
    'vaadin-chart',
    css`
    :host {
      --vaadin-charts-color-0: #5AC2F7;
      --vaadin-charts-color-1: #1676F3;
      --vaadin-charts-color-2: #FF7D94;
      --vaadin-charts-color-3: #C5164E;
      --vaadin-charts-color-4: #15C15D;
      --vaadin-charts-color-5: #0E8151;
      --vaadin-charts-color-6: #C18ED2;
      --vaadin-charts-color-7: #9233B3;
      --vaadin-charts-color-8: #FDA253;
      --vaadin-charts-color-9: #E24932;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-4, #15C15D);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-9, #E24932);
    
      --vaadin-charts-background: var(--lumo-base-color);
      --vaadin-charts-title-label: var(--lumo-header-text-color);
      --vaadin-charts-axis-title: var(--lumo-secondary-text-color);
      --vaadin-charts-axis-label: var(--lumo-secondary-text-color);
      --vaadin-charts-data-label: var(--lumo-body-text-color);
      --vaadin-charts-secondary-label: var(--lumo-secondary-text-color);
      --vaadin-charts-axis-line: var(--lumo-contrast-5pct);
      --vaadin-charts-xaxis-line-width: 0;
      --vaadin-charts-grid-line: var(--lumo-contrast-20pct);
      --vaadin-charts-disabled-label: var(--lumo-disabled-text-color);

      --vaadin-charts-contrast: var(--lumo-contrast);
      --vaadin-charts-contrast-5pct: var(--lumo-contrast-5pct);
      --vaadin-charts-contrast-10pct: var(--lumo-contrast-10pct);
      --vaadin-charts-contrast-20pct: var(--lumo-contrast-20pct);
      --vaadin-charts-contrast-60pct: var(--lumo-contrast-60pct);

      --vaadin-charts-tooltip-background: var(--lumo-base-color);
      --vaadin-charts-tooltip-background-opacity: 1;
      --vaadin-charts-tooltip-border: inherit;

      --vaadin-charts-button-label: var(--lumo-primary-text-color);
      --vaadin-charts-button-background: var(--lumo-contrast-5pct);
      --vaadin-charts-button-hover-background: var(--lumo-primary-color-10pct);
      --vaadin-charts-button-active-label: var(--lumo-primary-contrast-color);
      --vaadin-charts-button-active-background: var(--lumo-primary-color);
    }
  `,
    { moduleId: 'vaadin-chart-default-theme' }
);
