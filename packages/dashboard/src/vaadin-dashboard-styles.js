/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
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

  :host(:not([editable])) #drag-handle,
  :host(:not([editable])) #remove-button,
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
  #move-backward,
  #move-forward,
  #move-apply {
    position: absolute;
    top: 50%;
  }

  #move-backward {
    inset-inline-start: 0;
    transform: translateY(-50%);
  }

  #move-forward {
    inset-inline-end: 0;
    transform: translateY(-50%);
  }

  #move-apply {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :host([first-child]) #move-backward,
  :host([last-child]) #move-forward {
    display: none;
  }

  /* Resize-mode buttons */
  #resize-shrink-width,
  #resize-shrink-height,
  #resize-grow-width,
  #resize-grow-height,
  #resize-apply {
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

  #resize-shrink-height {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
  }

  #resize-grow-height {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
  }

  #resize-apply {
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
  }
`;
