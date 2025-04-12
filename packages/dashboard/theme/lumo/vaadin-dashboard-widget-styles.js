import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Styles shared between widgets and sections */
const dashboardWidgetAndSection = css`
  /* stylelint-disable rule-empty-line-before */
  /* stylelint-disable length-zero-no-unit */

  :host {
    --_vaadin-dashboard-widget-background: var(--vaadin-dashboard-widget-background, var(--lumo-base-color));
    --_vaadin-dashboard-widget-border-radius: var(--vaadin-dashboard-widget-border-radius, var(--lumo-border-radius-l));
    --_vaadin-dashboard-widget-border-width: var(--vaadin-dashboard-widget-border-width, 1px);
    --_vaadin-dashboard-widget-border-color: var(--vaadin-dashboard-widget-border-color, var(--lumo-contrast-20pct));
    --_vaadin-dashboard-widget-shadow: var(--vaadin-dashboard-widget-shadow, 0 0 0 0 transparent);
    --_vaadin-dashboard-widget-editable-shadow: var(
      --vaadin-dashboard-widget-editable-shadow,
      var(--lumo-box-shadow-s)
    );
    --_vaadin-dashboard-widget-selected-shadow: var(
      --vaadin-dashboard-widget-selected-shadow,
      0 2px 4px -1px var(--lumo-primary-color-10pct),
      0 3px 12px -1px var(--lumo-primary-color-50pct)
    );
    --_vaadin-dashboard-drop-target-background-color: var(
      --vaadin-dashboard-drop-target-background-color,
      var(--lumo-primary-color-10pct)
    );
    --_vaadin-dashboard-drop-target-border: var(
      --vaadin-dashboard-drop-target-border,
      1px dashed var(--lumo-primary-color-50pct)
    );
    --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
    --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
    --_icon-color: var(--lumo-contrast-60pct);

    color: var(--lumo-body-text-color);
    filter: var(--_vaadin-dashboard-widget-filter);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    opacity: var(--_vaadin-dashboard-widget-opacity);
  }

  :host([selected]) {
    opacity: 1;
    z-index: 1;
  }

  :host([focused]) {
    z-index: 1;
  }

  header {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    gap: var(--lumo-space-xs);
    justify-content: space-between;
  }

  [part='title'] {
    color: var(--lumo-header-text-color);
    flex: 1;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  vaadin-dashboard-button {
    font-family: 'lumo-icons';
    font-size: var(--lumo-icon-size-m);
    margin: 0;
  }

  vaadin-dashboard-button .icon::before {
    content: var(--icon);
    display: block;
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
    --icon: var(--lumo-icons-drag-handle);
    cursor: move;
  }

  /* Remove button */
  [part~='remove-button'] {
    --icon: var(--lumo-icons-cross);
    cursor: pointer;
  }

  /* Mode controls */
  .mode-controls vaadin-dashboard-button[focused] {
    z-index: 3;
  }

  /* Move mode */

  :host(:not([dir='rtl'])) [part~='move-backward-button'],
  :host([dir='rtl']) [part~='move-forward-button'] {
    --icon: var(--lumo-icons-angle-left);
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  :host(:not([dir='rtl'])) [part~='move-forward-button'],
  :host([dir='rtl']) [part~='move-backward-button'] {
    --icon: var(--lumo-icons-angle-right);
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  [part~='move-apply-button'] {
    --icon: var(--lumo-icons-checkmark);
    font-size: var(--lumo-icon-size-m);
  }
`;

/* Widget styles */
const dashboardWidget = css`
  :host {
    --_border-shadow: 0 0 0 var(--_vaadin-dashboard-widget-border-width) var(--_vaadin-dashboard-widget-border-color);
    --_shadow: var(--_vaadin-dashboard-widget-shadow);
    background: var(--_vaadin-dashboard-widget-background);
    border-radius: var(--_vaadin-dashboard-widget-border-radius);
    box-shadow: var(--_shadow), var(--_border-shadow);
  }

  /* Widget states */

  :host([editable]) {
    --_shadow: var(--_vaadin-dashboard-widget-editable-shadow);
  }

  :host([focused]) {
    --_border-shadow: inset 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
  }

  :host([selected]) {
    --_shadow: var(--_vaadin-dashboard-widget-selected-shadow);
    background: var(--lumo-primary-color-10pct);
  }

  :host([dragging]) {
    background: var(--_vaadin-dashboard-drop-target-background-color);
    border: var(--_vaadin-dashboard-drop-target-border);
    box-shadow: none;
  }

  :host([resizing])::after {
    background: var(--_vaadin-dashboard-drop-target-background-color);
    border: var(--_vaadin-dashboard-drop-target-border);
  }

  /* Widget parts */

  header {
    border-bottom: 1px solid var(--lumo-contrast-10pct);
    min-height: var(--lumo-size-l);
    padding: 0 var(--lumo-space-m);
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
    filter: blur(10px);
    opacity: 0.75;
  }

  /* Resize handle */

  [part~='resize-button'] {
    --_resize-button-offset: min(var(--_vaadin-dashboard-gap), var(--_vaadin-dashboard-padding), var(--lumo-space-xs));
    --icon: var(--lumo-icons-resize-handle);
    bottom: calc(-1 * var(--_resize-button-offset));
    cursor: nwse-resize;
    inset-inline-end: calc(-1 * var(--_resize-button-offset));
    position: absolute;
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
    min-width: var(--lumo-size-s);
    padding-left: 0;
    padding-right: 0;
  }

  [part~='resize-shrink-width-button'] + [part~='resize-grow-width-button'] {
    margin-left: 1px;
  }

  [part~='resize-grow-height-button'],
  [part~='resize-shrink-height-button'] {
    height: var(--lumo-size-s);
    padding-left: 0;
    padding-right: 0;
  }

  [part~='resize-shrink-height-button'] + [part~='resize-grow-height-button'] {
    margin-top: 1px;
  }

  :host(:not([dir='rtl'])) [part~='resize-grow-width-button'],
  :host(:not([dir='rtl'])) [part~='resize-shrink-width-button'] {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  :host([dir='rtl']) [part~='resize-grow-width-button'],
  :host([dir='rtl']) [part~='resize-shrink-width-button'] {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  :host(:not([dir='rtl'])) [part~='resize-shrink-width-button']:not([hidden]) + [part~='resize-grow-width-button'] {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  :host([dir='rtl']) [part~='resize-shrink-width-button']:not([hidden]) + [part~='resize-grow-width-button'] {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
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
      outline-color: Highlight;
      outline-offset: 0px;
      outline-width: 1px;
    }
    :host([selected][focused]) {
      outline-offset: 0px;
      outline-width: 3px;
    }
  }
`;

registerStyles('vaadin-dashboard-widget', [dashboardWidget, dashboardWidgetAndSection], {
  moduleId: 'lumo-dashboard-widget',
});

export { dashboardWidget, dashboardWidgetAndSection };
