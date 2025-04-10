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
        --_vaadin-background: hsl(0 0 100);

        /* Foreground/content colors */
        --_vaadin-background-container: hsl(0 0 95);
        --_vaadin-background-container-strong: hsl(0 0 90);

        --_vaadin-border-color: hsl(0 0 75);
        --_vaadin-border-color-strong: hsl(0 0 58); /* Above 3:1 contrast */

        --_vaadin-color-subtle: hsl(0 0 58); /* Above 3:1 contrast */
        --_vaadin-color: hsl(0 0 44); /* Above 4.5:1 contrast */
        --_vaadin-color-strong: hsl(0 0 12); /* Above 7:1 contrast */

        --_vaadin-padding: 8px;
        --_vaadin-padding-container: 6px 8px;

        --_vaadin-gap-container-inline: 0.5em;
        --_vaadin-gap-container-block: 0.5em;

        --_vaadin-radius-s: 3px;
        --_vaadin-radius-m: 6px;
        --_vaadin-radius-l: 12px;
        --_vaadin-radius-full: 999px;

        --vaadin-focus-ring-width: 2px;
        --vaadin-focus-ring-color: var(--_vaadin-color);

        --_vaadin-icon-cross: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>');
        --_vaadin-icon-warn: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>');
      }
    }
  `,
);
