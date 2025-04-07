/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
// TODO: add themable-mixin as a dependency to package.json
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

addGlobalThemeStyles(
  'vaadin-base',
  css`
    @layer vaadin.base {
      html {
        /* Background color */
        --_vaadin-bg: hsl(0 0 100);

        /* Foreground/content colors */
        --_vaadin-bg-container: hsl(0 0 95);
        --_vaadin-bg-container-strong: hsl(0 0 90);

        --_vaadin-border-color: hsl(0 0 75);
        --_vaadin-border-color-strong: hsl(0 0 58); /* Above 3:1 contrast */

        --_vaadin-color-weak: hsl(0 0 58); /* Above 3:1 contrast */
        --_vaadin-color: hsl(0 0 44); /* Above 4.5:1 contrast */
        --_vaadin-color-strong: hsl(0 0 12); /* Above 7:1 contrast */

        --_vaadin-padding-container: 8px;
        --_vaadin-padding-container-text: 6px 8px;

        --_vaadin-gap-icon: 0.5em;

        --_vaadin-radius-s: 3px;
        --_vaadin-radius-m: 6px;
        --_vaadin-radius-l: 12px;
        --_vaadin-radius-full: 999px;

        --vaadin-focus-ring-width: 2px;
        --vaadin-focus-ring-color: var(--_vaadin-color);

        --vaadin-icon-size: calc(1lh - 2px); /* Seems too fragile to repeat all over the place */
      }
    }
  `,
);
