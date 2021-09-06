/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';

const customField = css`
  :host {
    display: inline-flex;
    position: relative;
    margin-bottom: 8px;
    outline: none;
    color: var(--material-body-text-color);
    font-size: var(--material-body-font-size);
    font-family: var(--material-font-family);
    line-height: 48px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* TODO: remove when the following components are updated to use new indicator:
  combo-box, date-picker, time-picker, date-time-picker, select. */
  [part='label']::after {
    display: none;
  }

  /* align with text-field label */
  :host([has-label]) {
    padding-top: 16px;
  }

  /* align with text-field error message */
  [part='error-message']:not(:empty),
  :host([has-helper]) [part='helper-text'] {
    margin-top: -8px;
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
    font-size: 0.75em;
    line-height: 1;
    color: var(--material-secondary-text-color);
  }
`;

registerStyles('vaadin-custom-field', [requiredField, customField], {
  moduleId: 'material-custom-field'
});
