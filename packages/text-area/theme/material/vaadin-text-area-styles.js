/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const textArea = css`
  [part='input-field'] {
    height: auto;
    box-sizing: border-box;
  }

  [part='input-field'] ::slotted(textarea) {
    padding-top: 0;
    margin-top: 4px;
  }

  [part='input-field']::before,
  [part='input-field']::after {
    bottom: calc(var(--_text-area-vertical-scroll-position) * -1);
  }
`;

registerStyles('vaadin-text-area', [inputFieldShared, textArea], { moduleId: 'material-text-area' });
