import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const style = document.createElement('style');

style.textContent = css`
  vaadin-grid {
    border: 1px solid;
    font-family: sans-serif;
  }

  vaadin-grid::part(cell) {
    min-height: 36px;
    padding: 0;
  }

  vaadin-grid::part(header-cell) {
    font-size: 0.875rem;
    font-weight: 500;
  }

  vaadin-grid::part(first-header-row-cell last-header-row-cell) {
    min-height: 56px;
  }

  vaadin-grid-cell-content {
    padding: 4px 16px;
  }

  vaadin-grid-tree-toggle {
    --vaadin-grid-tree-toggle-level-offset: 32px;
  }

  vaadin-grid-tree-toggle::part(toggle) {
    width: 32px;
    margin: 0;
    padding: 0;
  }
`;

document.head.append(style);
