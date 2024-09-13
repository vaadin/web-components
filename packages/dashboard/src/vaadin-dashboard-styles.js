import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const hasWidgetWrappers = css`
  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }
`;

export const dashboardWidgetAndSectionStyles = css`
  /* Placeholder shown while the widget or section is dragged */
  :host::before {
    content: '';
    z-index: 1;
    position: absolute;
    display: var(--_vaadin-dashboard-item-placeholder-display, none);
    inset: 0;
    border: 3px dashed black;
    border-radius: 5px;
    background-color: #fff;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #drag-handle {
    display: var(--_vaadin-dashboard-widget-actions-display, none);
    font-size: 30px;
    cursor: grab;
  }

  #drag-handle::before {
    content: '☰';
  }

  #remove-button {
    display: var(--_vaadin-dashboard-widget-actions-display, none);
    font-size: 30px;
    cursor: pointer;
  }

  #remove-button::before {
    content: '×';
  }
`;
