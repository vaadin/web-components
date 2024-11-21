import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const dashboardWidgetAndSection = css`
  :host {
    border-radius: var(--lumo-border-radius-l);
    color: var(--lumo-body-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    /* default max value for the focus ring spacing offset. calc doesn't support unitless 0. */
    /* stylelint-disable length-zero-no-unit */
    --_focus-ring-spacing-max-offset: 0px;
    /* Calculates the offset by which the focus ring should be shifted inwards based on a custom --vaadin-dashboard-spacing value.
    Effectively keeps the focus ring visible if --vaadin-dashboard-spacing is set to 0px */
    --_focus-ring-spacing-offset: min(
      max(calc(var(--_focus-ring-width) * -1), var(--_vaadin-dashboard-spacing) - var(--_focus-ring-width)),
      var(--_focus-ring-spacing-max-offset, 0px)
    );
    outline: none;
  }

  :host::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    border-radius: var(--lumo-border-radius-l);
    pointer-events: none;
    margin: calc(var(--_focus-ring-spacing-offset) * -1);
  }

  :host([selected])::before {
    outline: 1px solid var(--_focus-ring-color);
  }

  :host([focused])::before {
    outline: var(--_focus-ring-width) solid var(--_focus-ring-color);
  }

  :host([selected])::before {
    box-shadow:
      0 2px 4px -1px var(--lumo-primary-color-10pct),
      0 3px 12px -1px var(--lumo-primary-color-50pct);
  }

  /* Buttons styling */
  vaadin-dashboard-button {
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-s);
  }

  .icon::before {
    display: block;
    content: var(--icon);
  }

  :host(:not([selected])) *:not(.mode-controls) vaadin-dashboard-button,
  :host([move-mode]) *:not(.mode-controls) vaadin-dashboard-button,
  :host([resize-mode]) *:not(.mode-controls) vaadin-dashboard-button {
    color: var(--lumo-disabled-text-color);
  }

  /* Header styling */
  header {
    display: flex;
    align-items: center;
    padding: var(--lumo-space-s) var(--lumo-space-m);
    gap: var(--lumo-space-s);
    min-height: var(--lumo-size-m);
    justify-content: space-between;
  }

  :host([editable]) header {
    padding-inline: var(--lumo-space-s);
  }

  /* Drag handle styling */
  [part~='move-button'] {
    cursor: move;
    --icon: var(--lumo-icons-drag-handle);
  }

  /* Remove button styling */
  [part~='remove-button'] {
    cursor: pointer;
    --icon: var(--lumo-icons-cross);
  }

  /* Title styling */
  h2,
  h3 {
    flex: 1;
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    color: var(--lumo-header-text-color);
    margin: 0;
  }

  /* Content styling */
  [part~='content'] {
    min-height: var(--lumo-size-m);
    padding: var(--lumo-space-s);
  }

  /* Mode controls styling */
  .mode-controls vaadin-dashboard-button[focused] {
    z-index: 3;
  }

  /* Move mode styling */

  [part~='move-backward-button'] {
    inset-inline-start: calc(0px - var(--_focus-ring-spacing-offset));
  }

  [part~='move-forward-button'] {
    inset-inline-end: calc(0px - var(--_focus-ring-spacing-offset));
    transform: translateY(-50%);
  }

  :host(:not([dir='rtl'])) [part~='move-backward-button'],
  :host([dir='rtl']) [part~='move-forward-button'] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    --icon: var(--lumo-icons-angle-left);
  }

  :host(:not([dir='rtl'])) [part~='move-forward-button'],
  :host([dir='rtl']) [part~='move-backward-button'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    --icon: var(--lumo-icons-angle-right);
  }

  [part~='move-apply-button'] {
    --icon: var(--lumo-icons-checkmark);
    font-size: var(--lumo-icon-size-m);
  }
`;

const dashboardWidget = css`
  :host {
    opacity: var(--_vaadin-dashboard-widget-opacity);
    filter: var(--_vaadin-dashboard-widget-filter);
    background-color: var(--lumo-base-color);
  }

  :host(:not([selected])) {
    box-shadow: var(--lumo-box-shadow-s);
  }

  :host([selected]) {
    opacity: 1;
  }

  :host([resize-mode]) [part~='content'] ::slotted(*),
  :host([move-mode]) [part~='content'] ::slotted(*) {
    opacity: 0.3;
    filter: blur(10px);
  }

  /* Header styling */
  header {
    border-bottom: 1px solid var(--lumo-contrast-10pct);
  }

  /* Resize handle styling */
  [part~='resize-button'] {
    position: absolute;
    bottom: var(--lumo-space-s);
    inset-inline-end: var(--lumo-space-s);
    cursor: se-resize;
    --icon: var(--lumo-icons-resize-handle);
  }

  :host([dir='rtl']) [part~='resize-button'] {
    cursor: sw-resize;
  }

  :host([dir='rtl']) [part~='resize-button'] .icon::before {
    transform: scaleX(-1);
  }

  /* Resize mode styling */
  [part~='resize-apply-button'] {
    --icon: var(--lumo-icons-checkmark);
    font-size: var(--lumo-icon-size-m);
  }

  [part~='resize-grow-width-button'],
  [part~='resize-shrink-width-button'] {
    padding-right: 0;
    padding-left: 0;
    min-width: var(--lumo-size-s);
  }

  [part~='resize-grow-height-button'],
  [part~='resize-shrink-height-button'] {
    height: var(--lumo-size-s);
    margin: 0;
  }

  :host(:not([dir='rtl'])) [part~='resize-grow-width-button'],
  :host(:not([dir='rtl'])) [part~='resize-shrink-width-button'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  :host([dir='rtl']) [part~='resize-grow-width-button'],
  :host([dir='rtl']) [part~='resize-shrink-width-button'] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  :host(:not([dir='rtl'])) [part~='resize-shrink-width-button']:not([hidden]) + [part~='resize-grow-width-button'] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  :host([dir='rtl']) [part~='resize-shrink-width-button']:not([hidden]) + [part~='resize-grow-width-button'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  [part~='resize-grow-height-button'],
  [part~='resize-grow-width-button'] {
    --icon: var(--lumo-icons-plus);
  }

  [part~='resize-shrink-height-button'],
  [part~='resize-shrink-width-button'] {
    --icon: var(--lumo-icons-minus);
  }

  [part~='resize-grow-height-button'],
  [part~='resize-shrink-height-button'] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  [part~='resize-shrink-height-button']:not([hidden]) + [part~='resize-grow-height-button'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

registerStyles('vaadin-dashboard-widget', [dashboardWidget, dashboardWidgetAndSection], {
  moduleId: 'lumo-dashboard-widget',
});

export { dashboardWidget, dashboardWidgetAndSection };
