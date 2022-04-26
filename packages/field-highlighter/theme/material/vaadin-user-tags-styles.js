/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-user-tag',
  css`
    :host {
      font-family: var(--material-font-family);
      font-size: 0.75rem;
      border-radius: 0.25rem;
      box-shadow: var(--material-shadow-elevation-2dp);
    }

    [part='name'] {
      background-color: var(--vaadin-user-tag-color);
      color: var(--material-primary-contrast-color);
      padding: 0.3em;
      line-height: 1;
      font-weight: 500;
      min-width: 1.75em;
    }
  `,
  { moduleId: 'material-user-tag' },
);
