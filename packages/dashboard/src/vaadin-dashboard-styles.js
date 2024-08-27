import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const hasWidgetWrappers = css`
  ::slotted(vaadin-dashboard-widget-wrapper) {
    display: contents;
  }
`;

export const dashboardWidgetAndSectionStyles = css`
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

  #header-actions {
    visibility: var(--_vaadin-dashboard-widget-actions-visibility, hidden);
  }

  #drag-handle::before {
    content: '☰';
    cursor: grab;
  }
`;
