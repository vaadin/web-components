import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dashboardWidgetAndSection } from './vaadin-dashboard-widget-styles.js';

const section = css`
  :host {
    --_focus-ring-spacing-max-offset: calc(min(var(--_vaadin-dashboard-gap), var(--_vaadin-dashboard-padding)) / 3);
    border-radius: var(--lumo-border-radius-l);
  }

  header {
    margin-bottom: calc(-1 * var(--_focus-ring-spacing-max-offset));
    line-height: var(--lumo-line-height-s);
    padding-inline: var(--lumo-space-s);
    min-height: var(--lumo-size-l);
  }

  :host([editable]) {
    outline: 1px solid var(--lumo-contrast-10pct);
    outline-offset: var(--_focus-ring-spacing-max-offset);
    background: var(--lumo-contrast-5pct);
    box-shadow: 0 0 0 var(--_focus-ring-spacing-max-offset) var(--lumo-contrast-5pct);
  }

  :host([editable]) header {
    padding-inline: var(--lumo-space-xs);
  }

  :host([focused]) {
    outline: var(--_focus-ring-width) solid var(--_focus-ring-color);
  }

  :host([selected]) {
    background: var(--lumo-primary-color-10pct);
    box-shadow: 0 0 0 var(--_focus-ring-spacing-max-offset) var(--lumo-primary-color-10pct);
  }
  :host([selected]:not([focused])) {
    outline-color: var(--lumo-primary-color-50pct);
  }

  :host([move-mode]) ::slotted(*) {
    --_vaadin-dashboard-widget-opacity: 0.3;
    --_vaadin-dashboard-widget-filter: blur(10px);
  }

  :host([dragging]) {
    background: var(--vaadin-dashboard-drop-target-background-color);
    outline: var(--vaadin-dashboard-drop-target-border);
    box-shadow: 0 0 0 var(--_focus-ring-spacing-max-offset) var(--vaadin-dashboard-drop-target-background-color);
  }

  [part~='move-backward-button'] {
    inset-inline-start: calc(-1 * var(--_focus-ring-spacing-max-offset));
  }

  [part~='move-forward-button'] {
    inset-inline-end: calc(-1 * var(--_focus-ring-spacing-max-offset));
    transform: translateY(-50%);
  }
`;

registerStyles('vaadin-dashboard-section', [dashboardWidgetAndSection, section], {
  moduleId: 'lumo-dashboard-section',
});
