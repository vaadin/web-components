import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* Hide caret */
registerStyles(
  'vaadin-combo-box vaadin-date-picker vaadin-text-field',
  css`
    :host([focus-ring]) ::slotted(input) {
      caret-color: transparent;
    }
  `,
);

registerStyles(
  'vaadin-text-area',
  css`
    :host([focus-ring]) ::slotted(textarea) {
      caret-color: transparent;
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
  { moduleId: 'not-animated-user-tags-overlay' },
);
