import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const formItem = css`
  [part='label'] {
    position: relative;
    transform: none;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    color: var(--material-secondary-text-color);
    line-height: 16px;
    font-weight: 400;
    margin-top: 16px;
    margin-bottom: 8px;
  }
`;

registerStyles('vaadin-form-item', [requiredField, formItem], { moduleId: 'material-form-item' });
