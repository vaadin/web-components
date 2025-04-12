import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dashboardWidgetAndSection } from './vaadin-dashboard-widget-styles.js';

const section = css`
  /* stylelint-disable rule-empty-line-before */

  :host {
    --_section-outline-offset: calc(min(var(--_vaadin-dashboard-gap), var(--_vaadin-dashboard-padding)) / 3);
    --_focus-ring-offset: calc((var(--_section-outline-offset) - var(--_focus-ring-width)));
    border-radius: var(--lumo-border-radius-l);
  }

  header {
    min-height: var(--lumo-size-l);
    margin-bottom: calc(-1 * var(--_section-outline-offset));
    line-height: var(--lumo-line-height-s);
    padding-inline: var(--lumo-space-s);
  }

  [part='title'] {
    font-size: var(--lumo-font-size-xl);
    font-weight: 600;
  }

  /* Section states */

  :host([editable]) {
    background: var(--lumo-contrast-5pct);
    box-shadow: 0 0 0 var(--_section-outline-offset) var(--lumo-contrast-5pct);
    outline: 1px solid var(--lumo-contrast-10pct);
    outline-offset: calc(var(--_section-outline-offset) - 1px);
  }
  :host([editable]) header {
    padding-inline: var(--lumo-space-xs);
  }

  :host([focused])::after {
    position: absolute;
    z-index: 9;
    display: block;
    border-radius: var(--lumo-border-radius-l);
    content: '';
    inset: 0;
    outline: var(--_focus-ring-width) solid var(--_focus-ring-color);
    outline-offset: var(--_focus-ring-offset);
  }

  :host([selected]) {
    background: var(--lumo-primary-color-10pct);
    box-shadow: 0 0 0 var(--_section-outline-offset) var(--lumo-primary-color-10pct);
  }
  :host([selected]:not([focused])) {
    outline-color: var(--lumo-primary-color-50pct);
  }

  :host([move-mode]) ::slotted(*) {
    --_vaadin-dashboard-widget-opacity: 0.3;
    --_vaadin-dashboard-widget-filter: blur(10px);
  }

  :host([dragging]) {
    background: var(--_vaadin-dashboard-drop-target-background-color);
    box-shadow: 0 0 0 var(--_section-outline-offset) var(--_vaadin-dashboard-drop-target-background-color);
    outline: var(--_vaadin-dashboard-drop-target-border);
  }

  /* Accessible move mode controls */

  [part~='move-backward-button'] {
    inset-inline-start: calc(-1 * var(--_section-outline-offset));
  }

  [part~='move-forward-button'] {
    inset-inline-end: calc(-1 * var(--_section-outline-offset));
    transform: translateY(-50%);
  }
`;

registerStyles('vaadin-dashboard-section', [dashboardWidgetAndSection, section], {
  moduleId: 'lumo-dashboard-section',
});
