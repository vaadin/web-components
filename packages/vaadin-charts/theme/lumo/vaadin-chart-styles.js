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
      --vaadin-charts-tooltip-border-color: inherit;

      --vaadin-charts-button-label: var(--lumo-primary-text-color);
      --vaadin-charts-button-background: var(--lumo-contrast-5pct);
      --vaadin-charts-button-hover-background: var(--lumo-primary-color-10pct);
      --vaadin-charts-button-active-label: var(--lumo-primary-contrast-color);
      --vaadin-charts-button-active-background: var(--lumo-primary-color);
    }
    
    :host([theme~="gradient"]) {
      --vaadin-charts-color-0: #1676F3;
      --vaadin-charts-color-1: #13BBF0;
      --vaadin-charts-color-2: #11EEEE;
      --vaadin-charts-color-3: #0CD9BF;
      --vaadin-charts-color-4: #06BE81;
      --vaadin-charts-color-5: #00A344;
      --vaadin-charts-color-6: #41C639;
      --vaadin-charts-color-7: #8AED2C;
      --vaadin-charts-color-8: #C0E632;
      --vaadin-charts-color-9: #F6DB3A;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-6);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-1);
    }
    
    :host([theme~="monotone"]) {
      --vaadin-charts-color-0: #1676F3;
      --vaadin-charts-color-1: #4795F5;
      --vaadin-charts-color-2: #71B0F7;
      --vaadin-charts-color-3: #A0CEF9;
      --vaadin-charts-color-4: #BCE0FA;
      --vaadin-charts-color-5: #A8D8ED;
      --vaadin-charts-color-6: #7FC3DD;
      --vaadin-charts-color-7: #54ADCC;
      --vaadin-charts-color-8: #2B99BC;
      --vaadin-charts-color-9: #0284AC;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-3);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-9);
    }
    
    .highcharts-container {
      font-family: var(--lumo-font-family, -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif);
    }
  `,
    { moduleId: 'lumo-chart' }
);
