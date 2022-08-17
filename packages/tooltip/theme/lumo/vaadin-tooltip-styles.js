/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tooltipOverlay = css`
  [part='overlay'] {
    background-color: var(--lumo-contrast);
    color: var(--lumo-primary-contrast-color);
    font-size: var(--lumo-font-size-xs);
  }

  [part='content'] {
    padding: var(--lumo-space-xs) var(--lumo-space-s);
  }
`;

registerStyles('vaadin-tooltip-overlay', [overlay, tooltipOverlay], { moduleId: 'lumo-tooltip-overlay' });
