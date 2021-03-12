import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';

registerStyles(
  '',
  css`
    input[slot='input']::placeholder,
    textarea[slot='textarea']::placeholder {
      color: var(--material-disabled-text-color);
      transition: opacity 0.175s 0.1s;
      opacity: 1;
    }

    [has-label]:not([focused]):not([invalid]):not([theme='always-float-label']) > input[slot='input']::placeholder,
    [has-label]:not([focused]):not([invalid]):not([theme='always-float-label']) > input[slot='textarea']::placeholder {
      opacity: 0;
      transition-delay: 0;
    }
  `,
  { moduleId: 'material-placeholder-styles' }
);
