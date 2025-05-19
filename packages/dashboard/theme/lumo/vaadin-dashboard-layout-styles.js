import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const dashboardLayoutStyles = css`
  :host([theme~='shaded-background']) {
    background: var(--lumo-shade-5pct);
  }

  :host([theme~='elevated-widgets']) {
    --vaadin-dashboard-widget-shadow: var(--lumo-box-shadow-xs);
    --vaadin-dashboard-widget-border-color: var(--lumo-contrast-10pct);
    --vaadin-dashboard-widget-background: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct))
      var(--lumo-base-color);
  }

  :host([theme~='flat-widgets']) {
    --vaadin-dashboard-widget-background: var(--lumo-contrast-5pct);
    --vaadin-dashboard-widget-border-color: transparent;
  }

  #grid {
    --_default-gap: var(--lumo-space-m);
    --_default-padding: var(--lumo-space-m);
  }
`;

registerStyles('vaadin-dashboard-layout', [dashboardLayoutStyles], {
  moduleId: 'lumo-dashboard-layout',
});
