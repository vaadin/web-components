import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-text-field',
  css`
    /* Hide caret */
    :host([focused]) ::slotted(input) {
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
