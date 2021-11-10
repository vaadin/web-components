import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/grid/theme/material/vaadin-grid-styles.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([navigating]) [part~='cell']:active {
      box-shadow: inset 0 0 0 2px var(--material-primary-color);
    }

    [part~='editable-cell'],
    [part~='editable-cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: pointer;
    }

    [part~='row'] > [part~='editable-cell']:hover,
    [part~='row'] > [part~='editable-cell']:focus {
      background-color: var(--material-grid-pro-editable-cell-hover-background-color, rgba(0, 0, 0, 0.04));
      background-clip: padding-box;
    }
  `,
  { moduleId: 'material-grid-pro' }
);
