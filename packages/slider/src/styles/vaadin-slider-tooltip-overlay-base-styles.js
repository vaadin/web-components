/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const sliderTooltipOverlay = css`
  [part='content'] {
    padding: var(
      --vaadin-tooltip-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
  }

  :host([top-aligned]) [part='overlay'] {
    margin-top: var(--vaadin-gap-xs);
  }

  :host([bottom-aligned]) [part='overlay'] {
    margin-bottom: var(--vaadin-gap-xs);
  }
`;

export const sliderTooltipOverlayStyles = [overlayStyles, sliderTooltipOverlay];
