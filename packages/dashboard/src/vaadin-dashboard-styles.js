import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const hasWidgetWrappers = css`
  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }
`;

export const dashboardWidgetAndSectionStyles = css`
  :host {
    box-sizing: border-box;
    --vaadin-dashboard-item-selected-outline: 4px solid red;
    --vaadin-dashboard-item-focused-outline: 1px solid blue;
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

  button:focus {
    outline: 1px solid blue;
  }
`;
