/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const dashboardWidgetAndSectionStyles = css`
  :host {
    box-sizing: border-box;
    --_widget-background: var(--vaadin-dashboard-widget-background, var(--vaadin-background-color));
    --_widget-border-radius: var(--vaadin-dashboard-widget-border-radius, var(--vaadin-radius-m));
    --_widget-border-width: var(--vaadin-dashboard-widget-border-width, 1px);
    --_widget-border-color: var(--vaadin-dashboard-widget-border-color, var(--vaadin-border-color-subtle));
    --_widget-shadow: var(--vaadin-dashboard-widget-shadow, 0 0 0 0 transparent);
    --_widget-editable-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
    --_widget-selected-shadow: 0 3px 12px -1px rgba(0, 0, 0, 0.3);
    --_drop-target-background: var(--vaadin-dashboard-drop-target-background, var(--vaadin-background-container));
    --_drop-target-border-color: var(--vaadin-dashboard-drop-target-border-color, var(--vaadin-border-color-subtle));
    --_focus-ring-color: var(--vaadin-focus-ring-color);
    --_focus-ring-width: var(--vaadin-focus-ring-width);
  }

  :host([focused]) {
    z-index: 1;
    outline: var(--_focus-ring-width) solid var(--_focus-ring-color);
    outline-offset: calc(var(--_widget-border-width) * -1);
  }

  :host([dragging]) {
    box-shadow: none;
    background: var(--_drop-target-background);
    border-color: var(--_drop-target-border-color);
  }

  :host([dragging]) * {
    visibility: hidden;
  }

  :host(:not([editable])) [part~='move-button'],
  :host(:not([editable])) [part~='remove-button'],
  :host(:not([editable])) #focus-button,
  :host(:not([editable])) #focus-button-wrapper,
  :host(:not([editable])) .mode-controls {
    display: none;
  }

  #focustrap {
    display: contents;
  }

  header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    gap: var(--vaadin-dashboard-header-gap, var(--vaadin-gap-s));
  }

  [part='title'] {
    flex: 1;
    color: var(--vaadin-dashboard-widget-title-color, var(--vaadin-color));
    font-size: var(--vaadin-dashboard-widget-title-font-size, 1em);
    font-weight: var(--vaadin-dashboard-widget-title-font-weight, 500);
    line-height: var(--vaadin-dashboard-widget-title-line-height, inherit);
    white-space: var(--vaadin-dashboard-widget-title-wrap, wrap);
    text-overflow: ellipsis;
    overflow: hidden;
    align-self: safe center;
  }

  vaadin-dashboard-button {
    z-index: 1;
    padding: 4px;
  }

  vaadin-dashboard-button .icon::before {
    display: block;
    content: '';
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask-image: var(--icon);
    /* TODO not sure why this is needed. Probably something wrong with the --_vaadin-icon-drag SVG */
    mask-size: 100%;
  }

  #focus-button-wrapper,
  #focus-button {
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  #focus-button {
    pointer-events: none;
    padding: 0;
    border: none;
  }

  .mode-controls {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .mode-controls[hidden] {
    display: none;
  }

  /* Drag handle */
  [part~='move-button'] {
    cursor: move;
    --icon: var(--_vaadin-icon-drag);
  }

  /* Remove button */
  [part~='remove-button'] {
    cursor: pointer;
    --icon: var(--_vaadin-icon-cross);
  }

  /* Move-mode buttons */
  [part~='move-backward-button'],
  [part~='move-forward-button'],
  [part~='move-apply-button'] {
    position: absolute;
    top: 50%;
  }

  [part~='move-backward-button'] {
    inset-inline-start: 0;
    transform: translateY(-50%);
    --icon: var(--_vaadin-icon-chevron-down);
  }

  [part~='move-forward-button'] {
    inset-inline-end: 0;
    transform: translateY(-50%);
    --icon: var(--_vaadin-icon-chevron-down);
  }

  [part~='move-apply-button'] {
    left: 50%;
    transform: translate(-50%, -50%);
    --icon: var(--_vaadin-icon-checkmark);
  }

  :host([first-child]) [part~='move-backward-button'],
  :host([last-child]) [part~='move-forward-button'] {
    display: none;
  }

  :host(:not([dir='rtl'])) [part~='move-backward-button'],
  :host([dir='rtl']) [part~='move-forward-button'] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  :host(:not([dir='rtl'])) [part~='move-forward-button'],
  :host([dir='rtl']) [part~='move-backward-button'] {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  :host(:not([dir='rtl'])) [part~='move-backward-button'] .icon,
  :host([dir='rtl']) [part~='move-forward-button'] .icon {
    rotate: 90deg;
  }

  :host(:not([dir='rtl'])) [part~='move-forward-button'] .icon,
  :host([dir='rtl']) [part~='move-backward-button'] .icon {
    rotate: -90deg;
  }

  /* Resize-mode buttons */
  [part~='resize-shrink-width-button'],
  [part~='resize-shrink-height-button'],
  [part~='resize-grow-width-button'],
  [part~='resize-grow-height-button'],
  [part~='resize-apply-button'] {
    position: absolute;
  }

  [part~='resize-shrink-width-button'] {
    inset-inline-end: 0;
    top: 50%;
  }

  :host(:not([dir='rtl'])) [part~='resize-shrink-width-button'] {
    transform: translateY(-50%) translateX(-100%);
  }

  :host([dir='rtl']) [part~='resize-shrink-width-button'] {
    transform: translateY(-50%) translateX(100%);
  }

  .mode-controls:has([part~='resize-grow-width-button'][hidden]) [part~='resize-shrink-width-button'] {
    transform: translateY(-50%);
  }

  [part~='resize-grow-width-button'] {
    inset-inline-start: 100%;
    top: 50%;
  }

  :host(:not([dir='rtl'])) [part~='resize-grow-width-button'] {
    transform: translateY(-50%) translateX(-100%);
  }

  :host([dir='rtl']) [part~='resize-grow-width-button'] {
    transform: translateY(-50%) translateX(100%);
  }

  [part~='resize-shrink-height-button'] {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
  }

  [part~='resize-grow-height-button'] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
  }

  [part~='resize-grow-height-button'],
  [part~='resize-grow-width-button'] {
    --icon: var(--_vaadin-icon-plus);
  }

  [part~='resize-shrink-height-button'],
  [part~='resize-shrink-width-button'] {
    --icon: var(--_vaadin-icon-minus);
  }

  [part~='resize-apply-button'] {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    --icon: var(--_vaadin-icon-checkmark);
  }

  [part~='resize-shrink-width-button'] + [part~='resize-grow-width-button'] {
    margin-left: 1px;
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

  @media (forced-colors: active) {
    vaadin-dashboard-button .icon::before {
      background: currentColor;
      forced-color-adjust: none;
    }
  }
`;
