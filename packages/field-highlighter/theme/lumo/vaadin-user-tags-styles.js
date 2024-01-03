/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-user-tags-overlay',
  [
    overlay,
    css`
      [part='overlay'] {
        will-change: opacity, transform;
      }

      :host([opening]) [part='overlay'] {
        animation: 0.1s lumo-user-tags-enter ease-out both;
      }

      @keyframes lumo-user-tags-enter {
        0% {
          opacity: 0;
        }
      }

      :host([closing]) [part='overlay'] {
        animation: 0.1s lumo-user-tags-exit both;
      }

      @keyframes lumo-user-tags-exit {
        100% {
          opacity: 0;
        }
      }
    `,
  ],
  {
    moduleId: 'lumo-user-tags-overlay',
  },
);

registerStyles(
  'vaadin-user-tag',
  css`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-xxs);
      border-radius: var(--lumo-border-radius-s);
      box-shadow: var(--lumo-box-shadow-xs);
      --vaadin-user-tag-offset: var(--lumo-space-xs);
    }

    [part='name'] {
      color: var(--lumo-primary-contrast-color);
      padding: 0.3em calc(0.3em + var(--lumo-border-radius-s) / 4);
      line-height: 1;
      font-weight: 500;
      min-width: calc(var(--lumo-line-height-xs) * 1em + 0.45em);
    }
  `,
  { moduleId: 'lumo-user-tag' },
);
