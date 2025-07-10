/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';

const userTagsOverlay = css`
  [part='overlay'] {
    position: relative;
    left: -4px;
    padding: 4px;
    outline: none;
    overflow: visible;
  }

  ::slotted([part='tags']) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  :host([dir='rtl']) [part='overlay'] {
    left: auto;
    right: -4px;
  }

  :host([opening]),
  :host([closing]) {
    animation: 0.14s user-tags-overlay-dummy-animation;
  }

  @keyframes user-tags-overlay-dummy-animation {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
`;

export const userTagsOverlayStyles = [overlayStyles, userTagsOverlay];
