/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-user-tags-overlay', [overlay], {
  moduleId: 'material-user-tags-overlay',
});

registerStyles(
  'vaadin-user-tag',
  css`
    :host {
      border-radius: 0.25rem;
      box-shadow: var(--material-shadow-elevation-2dp);
      font-family: var(--material-font-family);
      font-size: 0.75rem;
    }

    [part='name'] {
      min-width: 1.75em;
      padding: 0.3em;
      background-color: var(--vaadin-user-tag-color);
      color: var(--material-primary-contrast-color);
      font-weight: 500;
      line-height: 1;
    }
  `,
  { moduleId: 'material-user-tag' },
);
