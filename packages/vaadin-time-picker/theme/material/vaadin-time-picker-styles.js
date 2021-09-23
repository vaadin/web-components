/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--material-icons-clock);
  }
`;

registerStyles('vaadin-time-picker', [inputFieldShared, timePicker], { moduleId: 'material-time-picker' });
