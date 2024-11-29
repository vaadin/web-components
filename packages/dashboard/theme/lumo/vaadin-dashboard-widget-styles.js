import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Global styles */
const dashboardWidgetProps = css`
  html {
    --vaadin-dashboard-widget-background: var(--lumo-base-color);
    --vaadin-dashboard-widget-border-radius: var(--lumo-border-radius-l);
    --vaadin-dashboard-widget-border-width: 1px;
    --vaadin-dashboard-widget-border-color: var(--lumo-contrast-20pct);
    --vaadin-dashboard-widget-shadow: 0 0 0 0 transparent;
    --vaadin-dashboard-widget-editable-shadow: var(--lumo-box-shadow-s);
    --vaadin-dashboard-widget-selected-shadow: 0 2px 4px -1px var(--lumo-primary-color-10pct),
      0 3px 12px -1px var(--lumo-primary-color-50pct);
    --vaadin-dashboard-drop-target-background-color: var(--lumo-primary-color-10pct);
    --vaadin-dashboard-drop-target-border: 1px dashed var(--lumo-primary-color-50pct);
  }
`;
addGlobalThemeStyles('dashboard-widget-props', dashboardWidgetProps);

/* Styles shared between widgets and sections */
const dashboardWidgetAndSection = css`
  /* stylelint-disable rule-empty-line-before */
  /* stylelint-disable length-zero-no-unit */

  :host {
    color: var(--lumo-body-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    --_icon-color: var(--lumo-contrast-60pct);
    opacity: var(--_vaadin-dashboard-widget-opacity);
    filter: var(--_vaadin-dashboard-widget-filter);
  }

  :host([selected]) {
    opacity: 1;
    z-index: 1;
  }

  :host([focused]) {
    z-index: 1;
  }

  header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    gap: var(--lumo-space-xs);
  }

  [part='title'] {
    flex: 1;
    color: var(--lumo-header-text-color);
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  vaadin-dashboard-button {
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-m);
    margin: 0;
  }

  vaadin-dashboard-button .icon::before {
    display: block;
    content: var(--icon);
  }

  /* Common styles for non-mode edit buttons */
  [part='move-button'],
  [part='resize-button'],
  [part='remove-button'] {
    color: var(--_icon-color);
    padding-inline: 0;
  }
  :where([part='move-button'], [part='resize-button'], [part='remove-button']):hover {
    --_icon-color: var(--lumo-primary-text-color);
  }
  :host([selected]) {
    --_icon-color: var(--lumo-primary-text-color);
  }
  :host(:is([move-mode], [resize-mode])) {
    --_icon-color: var(--lumo-disabled-text-color);
  }

  /* Drag handle */
  [part~='move-button'] {
    cursor: move;
    --icon: var(--lumo-icons-drag-handle);
  }

  /* Remove button */
  [part~='remove-button'] {
    cursor: pointer;
    --icon: var(--lumo-icons-cross);
  }

  /* Mode controls */
  .mode-controls vaadin-dashboard-button[focused] {
    z-index: 3;
  }

  /* Move mode */

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

/* Widget styles */
const dashboardWidget = css`
  :host {
    background: var(--vaadin-dashboard-widget-background);
    border-radius: var(--vaadin-dashboard-widget-border-radius);
    --_border-shadow: 0 0 0 var(--vaadin-dashboard-widget-border-width) var(--vaadin-dashboard-widget-border-color);
    --_shadow: var(--vaadin-dashboard-widget-shadow);
    box-shadow: var(--_shadow), var(--_border-shadow);
  }

  /* Widget states */

  :host([editable]) {
    --_shadow: var(--vaadin-dashboard-widget-editable-shadow);
  }

  :host([focused]) {
    --_border-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }

  :host([selected]) {
    --_shadow: var(--vaadin-dashboard-widget-selected-shadow);
    background: var(--lumo-primary-color-10pct);
  }

  :host([dragging]) {
    box-shadow: none;
    background: var(--vaadin-dashboard-drop-target-background-color);
    border: var(--vaadin-dashboard-drop-target-border);
  }

  :host([resizing])::after {
    background: var(--vaadin-dashboard-drop-target-background-color);
    border: var(--vaadin-dashboard-drop-target-border);
  }

  /* Widget parts */

  header {
    min-height: var(--lumo-size-l);
    padding: 0 var(--lumo-space-m);
    border-bottom: 1px solid var(--lumo-contrast-10pct);
  }

  :host([editable]) header {
    padding-inline: var(--lumo-space-xs);
  }

  [part='title'] {
    font-size: var(--lumo-font-size-l);
    font-weight: 600;
  }

  #content {
    min-height: var(--lumo-size-m);
    padding: var(--lumo-space-s);
  }

  :host([resize-mode]) #content,
  :host([move-mode]) #content {
    opacity: 0.75;
    filter: blur(10px);
  }

  /* Resize handle */

  [part~='resize-button'] {
    --_resize-button-offset: min(var(--_vaadin-dashboard-gap), var(--_vaadin-dashboard-padding), var(--lumo-space-xs));
    position: absolute;
    bottom: calc(-1 * var(--_resize-button-offset));
    inset-inline-end: calc(-1 * var(--_resize-button-offset));
    cursor: nwse-resize;
    --icon: var(--lumo-icons-resize-handle);
  }

  :host([dir='rtl']) [part~='resize-button'] {
    cursor: sw-resize;
  }

  :host([dir='rtl']) [part~='resize-button'] .icon::before {
    transform: scaleX(-1);
  }

  /* Accessible resize mode controls */

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

  [part~='resize-shrink-width-button'] + [part~='resize-grow-width-button'] {
    margin-left: 1px;
  }

  [part~='resize-grow-height-button'],
  [part~='resize-shrink-height-button'] {
    height: var(--lumo-size-s);
    padding-right: 0;
    padding-left: 0;
  }

  [part~='resize-shrink-height-button'] + [part~='resize-grow-height-button'] {
    margin-top: 1px;
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

  /* Windows High Contrast Mode */
  @media (forced-colors: active) {
    :host {
      border: 1px solid;
    }
    :host([focused]) {
      outline: 2px solid;
      outline-offset: 1px;
    }
    :host([selected]) {
      outline-width: 1px;
      outline-offset: 0px;
      outline-color: Highlight;
    }
    :host([selected][focused]) {
      outline-width: 3px;
      outline-offset: 0px;
    }
  }
`;

registerStyles('vaadin-dashboard-widget', [dashboardWidget, dashboardWidgetAndSection], {
  moduleId: 'lumo-dashboard-widget',
});

export { dashboardWidget, dashboardWidgetAndSection };
