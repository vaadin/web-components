import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const style = document.createElement('style');

style.textContent = css`
  vaadin-grid {
    border: 1px solid;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
    max-width: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

  /*
   * Empty rules below register every grid part name as targeted by
   * \`::part()\`, so the lazy-part attribute optimization (introduced to
   * avoid the WebKit ::part style-recalc cost) does not skip them in test
   * pages where these parts are queried/asserted on directly.
   */
  vaadin-grid::part(cell),
  vaadin-grid::part(body-cell),
  vaadin-grid::part(header-cell),
  vaadin-grid::part(footer-cell),
  vaadin-grid::part(details-cell),
  vaadin-grid::part(loading-row-cell),
  vaadin-grid::part(focused-cell),
  vaadin-grid::part(row),
  vaadin-grid::part(body-row),
  vaadin-grid::part(header-row),
  vaadin-grid::part(footer-row),
  vaadin-grid::part(first-row),
  vaadin-grid::part(last-row),
  vaadin-grid::part(first-header-row),
  vaadin-grid::part(last-header-row),
  vaadin-grid::part(first-footer-row),
  vaadin-grid::part(last-footer-row),
  vaadin-grid::part(odd-row),
  vaadin-grid::part(even-row),
  vaadin-grid::part(first-row-cell),
  vaadin-grid::part(last-row-cell),
  vaadin-grid::part(first-header-row-cell),
  vaadin-grid::part(last-header-row-cell),
  vaadin-grid::part(first-footer-row-cell),
  vaadin-grid::part(last-footer-row-cell),
  vaadin-grid::part(odd-row-cell),
  vaadin-grid::part(even-row-cell),
  vaadin-grid::part(first-column-cell),
  vaadin-grid::part(last-column-cell),
  vaadin-grid::part(frozen-cell),
  vaadin-grid::part(frozen-to-end-cell),
  vaadin-grid::part(last-frozen-cell),
  vaadin-grid::part(first-frozen-to-end-cell),
  vaadin-grid::part(selected-row),
  vaadin-grid::part(selected-row-cell),
  vaadin-grid::part(reorder-allowed-cell),
  vaadin-grid::part(reorder-dragging-cell),
  vaadin-grid::part(drag-disabled-row),
  vaadin-grid::part(drag-disabled-row-cell),
  vaadin-grid::part(drop-disabled-row),
  vaadin-grid::part(drop-disabled-row-cell),
  vaadin-grid::part(empty-state),
  vaadin-grid::part(reorder-ghost),
  vaadin-grid::part(resize-handle),
  vaadin-grid::part(dragstart-row),
  vaadin-grid::part(dragstart-row-cell),
  vaadin-grid::part(drag-source-row),
  vaadin-grid::part(drag-source-row-cell),
  vaadin-grid::part(expanded-row),
  vaadin-grid::part(expanded-row-cell),
  vaadin-grid::part(collapsed-row),
  vaadin-grid::part(collapsed-row-cell),
  vaadin-grid::part(nonselectable-row),
  vaadin-grid::part(nonselectable-row-cell),
  vaadin-grid::part(details-opened-row),
  vaadin-grid::part(details-opened-row-cell),
  vaadin-grid::part(dragover-on-top-row),
  vaadin-grid::part(dragover-on-top-row-cell),
  vaadin-grid::part(dragover-above-row),
  vaadin-grid::part(dragover-above-row-cell),
  vaadin-grid::part(dragover-below-row),
  vaadin-grid::part(dragover-below-row-cell),
  vaadin-grid::part(first-row-cell),
  vaadin-grid::part(last-row-cell),
  vaadin-grid-pro::part(editable-cell) {
    /* Intentionally empty. */
  }
`;

document.head.append(style);
