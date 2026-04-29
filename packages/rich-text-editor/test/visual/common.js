import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-rich-text-editor',
  css`
    /* Hide caret */
    [part='content'] {
      caret-color: transparent;
    }

    /* Disable toolbar button transitions to prevent mid-ramp captures */
    [part~='toolbar-button'] {
      transition: none !important;
    }
  `,
);
