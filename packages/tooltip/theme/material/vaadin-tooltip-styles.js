/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/vaadin-material-styles/color.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const tooltipOverlay = css`
  [part='overlay'] {
    background-color: rgba(97, 97, 97, 0.92);
    color: #fff;
    font-size: 0.6875rem;
  }

  [part='content'] {
    padding: 4px 8px;
  }
`;

registerStyles('vaadin-tooltip-overlay', [overlay, tooltipOverlay], { moduleId: 'material-tooltip-overlay' });
