/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/font-icons.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const timePicker = css`
  [part~='toggle-button']::before {
    content: var(--material-icons-clock);
  }
`;

registerStyles('vaadin-time-picker', [inputFieldShared, timePicker], { moduleId: 'material-time-picker' });
