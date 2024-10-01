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
    --_focus-ring-spacing-max-offset: 0px;
    --_focus-ring-spacing-offset: min(
      max(calc(var(--_focus-ring-width) * -1), var(--_vaadin-dashboard-spacing) - var(--_focus-ring-width)),
      var(--_focus-ring-spacing-max-offset, 0px)
    );
    outline: none;
  }

  :host([focused])::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    border-radius: var(--lumo-border-radius-l);
    pointer-events: none;
    margin: calc(var(--_focus-ring-spacing-offset) * -1);
    outline: var(--_focus-ring-width) solid var(--_focus-ring-color);
  }

  :host([selected])::before {
    box-shadow:
      0 2px 4px -1px var(--lumo-primary-color-10pct),
      0 3px 12px -1px var(--lumo-primary-color-50pct);
  }

  /* Buttons styling */
  vaadin-button {
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-s);
  }

  .icon::before {
    display: block;
  }

  :host(:not([selected])) *:not(.mode-controls) vaadin-button,
  :host([move-mode]) *:not(.mode-controls) vaadin-button,
  :host([resize-mode]) *:not(.mode-controls) vaadin-button {
    color: var(--lumo-disabled-text-color);
  }

  /* Header styling */
  header {
    display: flex;
    align-items: center;
    padding-block: var(--lumo-space-s);
    padding-inline: var(--lumo-space-m);
    height: var(--lumo-size-m);
    gap: var(--lumo-space-s);
  }

  :host([editable]) header {
    padding-inline: var(--lumo-space-xs);
  }

  /* Drag handle styling */
  #drag-handle {
    cursor: move;
  }

  #drag-handle .icon::before {
    content: var(--lumo-icons-menu);
  }

  /* Remove button styling */
  #remove-button {
    cursor: pointer;
  }

  #remove-button .icon::before {
    content: var(--lumo-icons-cross);
  }

  /* Title slot styling */
  slot[name='title']::slotted(*) {
    flex: 1;
    font-size: var(--lumo-font-size-m) !important;
    font-weight: 500;
    color: var(--lumo-header-text-color) !important;
  }

  /* Content styling */
  #content {
    min-height: var(--lumo-size-m);
    padding: var(--lumo-space-s);
  }

  /* Mode controls styling */
  .mode-controls vaadin-button[focused] {
    z-index: 3;
  }

  /* Move mode styling */

  #move-backward {
    inset-inline-start: calc(0px - var(--_focus-ring-spacing-offset));
  }

  #move-forward {
    inset-inline-end: calc(0px - var(--_focus-ring-spacing-offset));
    transform: translateY(-50%);
  }

  #move-backward,
  :host([dir='rtl']) #move-forward {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  #move-backward .icon::before,
  :host([dir='rtl']) #move-forward .icon::before {
    content: var(--lumo-icons-angle-left);
  }

  #move-forward,
  :host([dir='rtl']) #move-backward {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  #move-forward .icon::before,
  :host(:not([dir='rtl'])) #move-forward .icon::before {
    content: var(--lumo-icons-angle-right);
  }

  #move-apply .icon::before {
    content: var(--lumo-icons-checkmark);
    font-size: var(--lumo-icon-size-m);
  }
`;

const dashboardWidget = css`
  :host {
    opacity: var(--_vaadin-dashboard-widget-opacity);
    filter: var(--_vaadin-dashboard-widget-filter);
    background-color: var(--lumo-base-color);
    box-shadow: var(--lumo-box-shadow-s);
  }

  :host([selected]) {
    opacity: 1;
  }

  :host([resize-mode]) #content,
  :host([move-mode]) #content {
    opacity: 0.3;
    filter: blur(10px);
  }

  /* Header styling */
  header {
    border-bottom: 1px solid var(--lumo-contrast-10pct);
  }

  /* Resize handle styling */
  #resize-handle {
    position: absolute;
    bottom: var(--lumo-space-s);
    inset-inline-end: var(--lumo-space-xs);
    cursor: se-resize;
  }

  #resize-handle .icon::before {
    display: block;
    content: var(--lumo-icons-chevron-down);
    transform: rotate(-45deg);
  }

  :host([dir='rtl']) #resize-handle {
    cursor: sw-resize;
  }

  :host([dir='rtl']) #resize-handle .icon::before {
    transform: rotate(45deg);
  }

  /* Resize mode styling */
  #resize-apply .icon::before {
    content: var(--lumo-icons-checkmark);
    font-size: var(--lumo-icon-size-m);
  }

  #resize-grow-width,
  #resize-shrink-width {
    padding-right: 0;
    padding-left: 0;
    min-width: var(--lumo-size-s);
  }

  #resize-grow-height,
  #resize-shrink-height {
    height: var(--lumo-size-s);
    margin: 0;
  }

  #resize-shrink-width,
  :host([dir='rtl']) #resize-grow-width {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  #resize-shrink-width .icon::before,
  :host([dir='rtl']) #resize-grow-width .icon::before {
    content: var(--lumo-icons-angle-left);
  }

  #resize-grow-width,
  :host([dir='rtl']) #resize-shrink-width {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  #resize-grow-width .icon::before,
  :host([dir='rtl']) #resize-shrink-width .icon::before {
    content: var(--lumo-icons-angle-right);
  }

  #resize-grow-height {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  #resize-grow-height .icon::before {
    content: var(--lumo-icons-angle-down);
  }

  #resize-shrink-height {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  #resize-shrink-height .icon::before {
    content: var(--lumo-icons-angle-up);
  }
`;

registerStyles('vaadin-dashboard-widget', [dashboardWidget, dashboardWidgetAndSection], {
  moduleId: 'lumo-dashboard-widget',
});

export { dashboardWidget, dashboardWidgetAndSection };
