import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';

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
  `,
  { moduleId: 'material-form-item' }
);
