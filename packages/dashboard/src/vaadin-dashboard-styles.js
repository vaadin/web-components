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

  :host([dragging]) {
    border: 3px dashed black !important;
  }

  :host([dragging]) * {
    visibility: hidden;
  }

  :host(:not([editable])) #drag-handle,
  :host(:not([editable])) #remove-button {
    display: none;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #drag-handle {
    font-size: 30px;
    cursor: grab;
  }

  #drag-handle::before {
    content: '☰';
  }

  #remove-button {
    font-size: 30px;
    cursor: pointer;
  }

  #remove-button::before {
    content: '×';
  }
`;
