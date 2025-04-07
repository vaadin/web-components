/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

addGlobalThemeStyles(
  'vaadin-base',
  css`
    @layer vaadin.base {
      html {
        /* Background color */
        --_vaadin-bg: hsl(0 0 100);
      }
    }
  `,
);
