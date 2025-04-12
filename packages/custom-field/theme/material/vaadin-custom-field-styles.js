/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { helper } from '@vaadin/vaadin-material-styles/mixins/helper.js';
import { requiredField } from '@vaadin/vaadin-material-styles/mixins/required-field.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const customField = css`
  :host {
    position: relative;
    display: inline-flex;
    margin-bottom: 8px;
    color: var(--material-body-text-color);
    font-family: var(--material-font-family);
    font-size: var(--material-body-font-size);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 48px;
    outline: none;
  }

  /* align with text-field label */
  :host([has-label]) {
    padding-top: 16px;
  }

  /* align with text-field error message */
  :host([has-error-message]) [part='error-message'],
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
`;

registerStyles('vaadin-custom-field', [requiredField, helper, customField], {
  moduleId: 'material-custom-field',
});

export { customField };
