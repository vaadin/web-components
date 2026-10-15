import { css, registerStyles } from '../../register-styles.js';

registerStyles(
  'vaadin-grid',
  css`
    [part~='cell'].dark {
      color: var(--lumo-contrast-color);
      background-color: var(--lumo-base-color);
    }
  `,
);
