/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';

const userTagsOverlay = css`
  [part='overlay'] {
    all: initial;
    display: block;
    font: inherit;
    color: inherit;
  }

  [part='content'] {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vaadin-user-tag-overlay-gap, 0.2em);
    padding: 0.5em 0;
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
