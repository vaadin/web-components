/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/theme/material/vaadin-input-container-styles.js';
import { inputFieldShared } from '@vaadin/vaadin-material-styles/mixins/input-field-shared.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const textArea = css`
  [part='input-field'] {
    box-sizing: border-box;
    height: auto;
  }

  [part='input-field'] ::slotted(textarea) {
    margin-top: 4px;
    padding-bottom: 4px;
    padding-top: 0;
  }

  [part='input-field']::before,
  [part='input-field']::after {
    bottom: calc(var(--_text-area-vertical-scroll-position) * -1);
  }

  /* Use sticky positioning to keep prefix/suffix/clear button visible when scrolling textarea container */
  [part='input-field'] ::slotted([slot$='fix']),
  [part='clear-button'] {
    align-self: flex-start;
    position: sticky;
    top: 0;
  }

  /* Align prefix/suffix icon or text with native textarea */
  [part='input-field'] ::slotted([slot$='fix']) {
    margin-top: 4px;
    top: 4px;
  }
`;

registerStyles('vaadin-text-area', [inputFieldShared, textArea], { moduleId: 'material-text-area' });
