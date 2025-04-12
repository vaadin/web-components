import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-form-item',
  css`
    [part='label'] {
      color: var(--material-secondary-text-color);
      font-family: var(--material-font-family);
      font-size: var(--material-small-font-size);
      font-weight: 400;
      line-height: 16px;
      margin-bottom: 8px;
      margin-top: 16px;
    }

    :host([required]) [part='required-indicator']::after {
      color: inherit;
      content: ' *';
    }

    :host([invalid]) [part='label'] {
      color: var(--material-error-text-color);
    }
  `,
  { moduleId: 'material-form-item' },
);
