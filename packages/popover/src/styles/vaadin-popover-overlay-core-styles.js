/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { overlayStyles } from '@vaadin/overlay/src/styles/vaadin-overlay-core-styles.js';

const popoverOverlay = css`
  :host {
    --_default-offset: 0;
  }

  :host([modeless][with-backdrop]) [part='backdrop'] {
    pointer-events: none;
  }

  :host([position^='top'][top-aligned]) [part='overlay'],
  :host([position^='bottom'][top-aligned]) [part='overlay'] {
    margin-top: var(--vaadin-popover-offset-top, var(--_default-offset));
  }

  [part='overlay'] {
    position: relative;
    overflow: visible;
    max-height: 100%;
  }

  [part='content'] {
    overflow: auto;
    box-sizing: border-box;
    max-height: 100%;
  }

  /* Increase the area of the popover so the pointer can go from the target directly to it. */
  [part='overlay']::before {
    position: absolute;
    content: '';
    inset-block: calc(var(--vaadin-popover-offset-top, var(--_default-offset)) * -1)
      calc(var(--vaadin-popover-offset-bottom, var(--_default-offset)) * -1);
    inset-inline: calc(var(--vaadin-popover-offset-start, var(--_default-offset)) * -1)
      calc(var(--vaadin-popover-offset-end, var(--_default-offset)) * -1);
    z-index: -1;
    pointer-events: auto;
  }

  :host([position^='top'][bottom-aligned]) [part='overlay'],
  :host([position^='bottom'][bottom-aligned]) [part='overlay'] {
    margin-bottom: var(--vaadin-popover-offset-bottom, var(--_default-offset));
  }

  :host([position^='start'][start-aligned]) [part='overlay'],
  :host([position^='end'][start-aligned]) [part='overlay'] {
    margin-inline-start: var(--vaadin-popover-offset-start, var(--_default-offset));
  }

  :host([position^='start'][end-aligned]) [part='overlay'],
  :host([position^='end'][end-aligned]) [part='overlay'] {
    margin-inline-end: var(--vaadin-popover-offset-end, var(--_default-offset));
  }

  [part='arrow'] {
    display: none;
    position: absolute;
    height: 0;
    width: 0;
  }

  :host([theme~='arrow']) [part='arrow'] {
    display: block;
  }
`;

export const popoverOverlayStyles = [overlayStyles, popoverOverlay];
