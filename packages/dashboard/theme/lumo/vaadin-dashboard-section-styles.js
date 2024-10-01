import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dashboardWidgetAndSection } from './vaadin-dashboard-widget-styles.js';

const section = css`
  :host {
    --_focus-ring-spacing-max-offset: calc(var(--_vaadin-dashboard-spacing) / 2);
  }

  :host([move-mode]) ::slotted(*) {
    --_vaadin-dashboard-widget-opacity: 0.3;
    --_vaadin-dashboard-widget-filter: blur(10px);
  }
`;

registerStyles('vaadin-dashboard-section', [dashboardWidgetAndSection, section], {
  moduleId: 'lumo-dashboard-section',
});
