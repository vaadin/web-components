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

  :host([focused]) {
    border: 1px solid blue;
  }

  :host([selected]) {
    border: 4px solid red;
  }

  :host([dragging]) {
    border: 3px dashed black;
  }

  :host([dragging]) * {
    visibility: hidden;
  }

  :host(:not([editable])) #drag-handle,
  :host(:not([editable])) #remove-button,
  :host(:not([editable])) #focus-button {
    display: none;
  }

  #focustrap {
    display: contents;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #focus-button {
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  #drag-handle {
    font-size: 30px;
    cursor: grab;
    z-index: 1;
  }

  #drag-handle::before {
    content: '☰';
  }

  #remove-button {
    font-size: 30px;
    cursor: pointer;
    z-index: 1;
  }

  #remove-button::before {
    content: '×';
  }

  .mode-controls {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 2;
  }

  button:focus {
    outline: 1px solid blue;
  }

  /* Move-mode buttons */
  #move-backward,
  #move-forward,
  #move-apply {
    font-size: 30px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  #move-backward::before,
  #move-forward::before,
  #move-apply::before {
    content: var(--content);
  }

  #move-backward {
    inset-inline-start: 0;
    --content: '<';
  }

  :host([dir='rtl']) #move-backward {
    transform: translate(50%, -50%);
  }

  #move-forward {
    inset-inline-end: 0;
    --content: '>';
  }

  :host(:not([dir='rtl'])) #move-forward {
    transform: translate(50%, -50%);
  }

  #move-apply {
    left: 50%;
    --content: '✔';
  }

  :host([first-child]) #move-backward,
  :host([last-child]) #move-forward {
    display: none;
  }
`;
