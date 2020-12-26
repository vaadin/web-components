import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  '',
  css`
    input[slot='input']::placeholder,
    textarea[slot='textarea']::placeholder {
      color: inherit;
      transition: opacity 0.175s 0.1s;
      opacity: 0.5;
    }

    [readonly] > input[slot='input']::placeholder,
    [readonly] > textarea[slot='textarea']::placeholder,
    [disabled] > input[slot='input']::placeholder,
    [disabled] > textarea[slot='textarea']::placeholder {
      opacity: 0;
    }
  `,
  { moduleId: 'lumo-placeholder-styles' }
);
