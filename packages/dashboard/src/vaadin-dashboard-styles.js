import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const hasWidgetWrappers = css`
  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }
`;

export const dashboardWidgetAndSectionStyles = css`
  :host {
    box-sizing: border-box;
    /* Calculates the offset by which mode buttons that by default overflow the widget edges
    should be shifted inwards based on a custom --vaadin-dashboard-spacing value */
    --_mode-button-spacing-offset: calc(
      max(0px, var(--_vaadin-dashboard-default-spacing) - var(--_vaadin-dashboard-spacing))
    );
  }

  :host([dragging]) * {
    visibility: hidden;
  }

  :host(:not([editable])) #drag-handle,
  :host(:not([editable])) #remove-button,
  :host(:not([editable])) #focus-button,
  :host(:not([editable])) #focus-button-wrapper {
    display: none;
  }

  #focustrap {
    display: contents;
  }

  header {
    display: flex;
    overflow: hidden;
  }

  vaadin-button {
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

  #resize-shrink-width {
    inset-inline-end: calc(0px + var(--_mode-button-spacing-offset));
    top: 50%;
    transform: translateY(-50%);
  }

  #resize-grow-width {
    inset-inline-start: calc(100% - var(--_mode-button-spacing-offset));
    top: 50%;
    transform: translateY(-50%);
  }

  #resize-shrink-height {
    bottom: calc(0px + var(--_mode-button-spacing-offset));
    left: 50%;
    transform: translateX(-50%);
  }

  #resize-grow-height {
    top: calc(100% - var(--_mode-button-spacing-offset));
    left: 50%;
    transform: translateX(-50%);
  }

  #resize-apply {
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
  }
`;
