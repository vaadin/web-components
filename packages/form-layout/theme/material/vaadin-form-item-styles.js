import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-form-item',
  css`
    [part='label'] {
      font-family: var(--material-font-family);
      font-size: var(--material-small-font-size);
      color: var(--material-secondary-text-color);
      line-height: 16px;
      font-weight: 400;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    :host([required]) [part='required-indicator']::after {
      content: ' *';
      color: inherit;
    }

    :host([invalid]) [part='label'] {
      color: var(--material-error-text-color);
    }
  `,
  { moduleId: 'material-form-item' },
);
