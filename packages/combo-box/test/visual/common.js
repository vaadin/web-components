import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-combo-box',
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

/* Stop loader animation */
registerStyles(
  'vaadin-combo-box-overlay',
  css`
    :host([loading]) [part='loader'] {
      animation: none;
      opacity: 1;
    }
  `,
);
