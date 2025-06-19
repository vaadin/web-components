import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-combo-box vaadin-date-picker vaadin-text-field vaadin-text-area',
  css`
    :host([focus-ring]) ::slotted(input),
    :host([focus-ring]) ::slotted(textarea) {
      caret-color: transparent;
    }

    /* Show error message immediately */
    [part='label'],
    [part='helper-text'],
    [part='error-message'],
    [part='required-indicator'] {
      &,
      &::before,
      &::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `,
);

registerStyles(
  'vaadin-user-tags-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `,
);

/* Disable opacity transition */
registerStyles(
  'vaadin-user-tag',
  css`
    :host {
      transition: none !important;
    }
  `,
);
