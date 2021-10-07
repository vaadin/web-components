import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';

const checkboxGroup = css`
  :host {
    display: inline-flex;
    position: relative;
    padding-top: 8px;
    margin-bottom: 8px;
    outline: none;
    color: var(--material-body-text-color);
    font-size: var(--material-body-font-size);
    line-height: 24px;
    font-family: var(--material-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :host::before {
    line-height: 32px;
  }

  :host([has-label]) {
    padding-top: 24px;
  }

  :host([theme~='vertical']) [part='group-field'] {
    display: flex;
    flex-direction: column;
  }

  :host([disabled]) [part='label'] {
    color: var(--material-disabled-text-color);
    -webkit-text-fill-color: var(--material-disabled-text-color);
  }

  :host([focused]:not([invalid])) [part='label'] {
    color: var(--material-primary-text-color);
  }

  /* According to material theme guidelines, helper text should be hidden when error message is set and input is invalid */
  :host([has-helper][invalid][has-error-message]) [part='helper-text'] {
    display: none;
  }

  :host([has-helper]) [part='helper-text']::before {
    content: '';
    display: block;
    height: 6px;
  }

  [part='helper-text'] {
    font-size: 0.75rem;
    line-height: 1;
    color: var(--material-secondary-text-color);
  }
`;

registerStyles('vaadin-checkbox-group', [requiredField, checkboxGroup], {
  moduleId: 'material-checkbox-group'
});
