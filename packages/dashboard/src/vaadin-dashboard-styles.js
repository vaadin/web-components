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
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const hasWidgetWrappers = css`
  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }
`;

export const dashboardWidgetAndSectionStyles = css`
  :host {
    box-sizing: border-box;
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
    overflow: hidden;
  }

  vaadin-dashboard-button {
    z-index: 1;
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
  }

  [part~='move-forward-button'] {
    inset-inline-end: 0;
    transform: translateY(-50%);
  }

  [part~='move-apply-button'] {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :host([first-child]) [part~='move-backward-button'],
  :host([last-child]) [part~='move-forward-button'] {
    display: none;
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

  [part~='resize-apply-button'] {
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
  }
`;
