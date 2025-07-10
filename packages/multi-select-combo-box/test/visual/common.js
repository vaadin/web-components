import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-multi-select-combo-box',
  css`
    /* Hide caret */
    :host([focused]:not([has-value])) ::slotted(input),
    :host([focused][has-value]) ::slotted(input) {
      caret-color: transparent !important;
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
  'vaadin-multi-select-combo-box-overlay',
  css`
    :host([loading]) [part='loader'] {
      animation: none;
      opacity: 1;
    }

    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      transition: none !important;
      animation: none !important;
    }
  `,
);
