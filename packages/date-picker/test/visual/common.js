import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-date-picker',
  css`
    /* Hide caret */
    :host([focus-ring]) ::slotted(input),
    :host([opened]) ::slotted(input) {
      caret-color: transparent;
    }

    /* Disable animation */
    [part='label'],
    [part$='button'],
    [part='helper-text'],
    [part='input-field'],
    [part='error-message'],
    [part='required-indicator'],
    ::slotted(:is(input, textarea):placeholder-shown) {
      &,
      &::before,
      &::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `,
);

/* Stop focused day animation */
registerStyles(
  'vaadin-month-calendar',
  css`
    [part~='focused']::before {
      animation: none !important;
    }
  `,
);
