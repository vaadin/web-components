/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

addGlobalThemeStyles(
  'vaadin-base-user-colors',
  css`
    @layer vaadin.base {
      :where(html) {
        --_color-count: 10;
        --_hue-step: calc(360 / var(--_color-count) - 1);
        --vaadin-user-color-0: var(--vaadin-user-color, #4172d5);
        --vaadin-user-color-1: oklch(
          from var(--vaadin-user-color-0) max(0.2, l - 0.1) c calc(h - var(--_hue-step) * 1)
        );
        --vaadin-user-color-2: oklch(
          from var(--vaadin-user-color-0) min(l + 0.1, 0.8) c calc(h - var(--_hue-step) * 2)
        );
        --vaadin-user-color-3: oklch(
          from var(--vaadin-user-color-0) max(0.2, l - 0.1) c calc(h - var(--_hue-step) * 3)
        );
        --vaadin-user-color-4: oklch(
          from var(--vaadin-user-color-0) min(l + 0.1, 0.8) c calc(h - var(--_hue-step) * 4)
        );
        --vaadin-user-color-5: oklch(
          from var(--vaadin-user-color-0) max(0.2, l - 0.1) c calc(h - var(--_hue-step) * 5)
        );
        --vaadin-user-color-6: oklch(
          from var(--vaadin-user-color-0) min(l + 0.1, 0.8) c calc(h - var(--_hue-step) * 6)
        );
        --vaadin-user-color-7: oklch(
          from var(--vaadin-user-color-0) max(0.2, l - 0.1) c calc(h - var(--_hue-step) * 7)
        );
        --vaadin-user-color-8: oklch(
          from var(--vaadin-user-color-0) min(l + 0.1, 0.8) c calc(h - var(--_hue-step) * 8)
        );
        --vaadin-user-color-9: oklch(
          from var(--vaadin-user-color-0) max(0.2, l - 0.1) c calc(h - var(--_hue-step) * 9)
        );
      }
    }
  `,
);
