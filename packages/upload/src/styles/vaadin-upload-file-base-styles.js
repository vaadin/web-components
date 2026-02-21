/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadFileStyles = css`
  :host {
    align-items: baseline;
    display: grid;
    grid-template-columns: var(--vaadin-icon-size, 1lh) minmax(0, 1fr) auto;
    padding: var(--vaadin-upload-file-padding, var(--vaadin-padding-s));
    border-radius: var(--vaadin-upload-file-border-radius, var(--vaadin-radius-m));
  }

  :host(:focus-visible) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [hidden] {
    display: none;
  }

  /* Hide thumbnail by default, only show with thumbnails theme */
  [part='thumbnail'],
  [part='loader'] {
    display: none;
    grid-column: 1;
  }

  [part='thumbnail'] {
    object-fit: cover;
  }

  [part='done-icon']:not([hidden]),
  [part='warning-icon']:not([hidden]) {
    display: flex;
    grid-column: 1;
  }

  [part='done-icon']::before,
  [part='warning-icon']::before {
    content: '\\2003' / '';
    display: inline-flex;
    align-items: center;
    flex: none;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
  }

  :is([part$='icon'], [part$='button'])::before {
    mask-size: var(--vaadin-icon-visual-size, 100%);
    mask-position: 50%;
    mask-repeat: no-repeat;
  }

  [part='done-icon']::before {
    background: var(--vaadin-upload-file-done-color, currentColor);
    mask-image: var(--_vaadin-icon-checkmark);
  }

  [part='warning-icon']::before {
    background: var(--vaadin-upload-file-warning-color, currentColor);
    mask-image: var(--_vaadin-icon-warn);
  }

  [part='meta'] {
    grid-column: 2;
    & > div {
      cursor: inherit;
    }
  }

  [part='name'] {
    color: var(--vaadin-upload-file-name-color, var(--vaadin-text-color));
    font-size: var(--vaadin-upload-file-name-font-size, inherit);
    font-weight: var(--vaadin-upload-file-name-font-weight, inherit);
    line-height: var(--vaadin-upload-file-name-line-height, inherit);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [part='status'] {
    color: var(--vaadin-upload-file-status-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-upload-file-status-font-size, inherit);
    font-weight: var(--vaadin-upload-file-status-font-weight, inherit);
    line-height: var(--vaadin-upload-file-status-line-height, inherit);
  }

  [part='error'] {
    color: var(--vaadin-upload-file-error-color, var(--vaadin-text-color));
    font-size: var(--vaadin-upload-file-error-font-size, inherit);
    font-weight: var(--vaadin-upload-file-error-font-weight, inherit);
    line-height: var(--vaadin-upload-file-error-line-height, inherit);
  }

  [part='commands'] {
    display: flex;
    align-items: center;
    gap: var(--vaadin-gap-xs);
    height: var(--vaadin-icon-size, 1lh);
    align-self: center;
  }

  button {
    background: var(--vaadin-upload-file-button-background, transparent);
    border: var(--vaadin-upload-file-button-border-width, 0) solid
      var(--vaadin-upload-file-button-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-upload-file-button-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-upload-file-button-text-color, var(--vaadin-text-color));
    cursor: var(--vaadin-clickable-cursor);
    flex-shrink: 0;
    font: inherit;
    /* Ensure minimum click target (WCAG) */
    padding: var(--vaadin-upload-file-button-padding, max(0px, (24px - var(--vaadin-icon-size, 1lh)) / 2));
  }

  button:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='start-button']::before,
  [part='retry-button']::before,
  [part='remove-button']::before {
    background: currentColor;
    content: '\\2003' / '';
    display: flex;
    align-items: center;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
  }

  [part='start-button']::before {
    mask-image: var(--_vaadin-icon-play);
  }

  [part='retry-button']::before {
    mask-image: var(--_vaadin-icon-refresh);
  }

  [part='remove-button']::before {
    mask-image: var(--_vaadin-icon-cross);
  }

  ::slotted([slot='progress']) {
    grid-column: 2 / -1;
    width: auto;
  }

  :host([complete]) ::slotted([slot='progress']),
  :host([error]) ::slotted([slot='progress']) {
    display: none;
  }

  /* THUMBNAILS VARIANT */

  :host([theme~='thumbnails']) {
    --_prefix-area-size: 2rem;

    grid-template-columns: var(--_prefix-area-size) minmax(0, 1fr) auto;
    grid-auto-columns: auto;
    grid-template-rows: auto;
    position: relative;
    align-items: center;
    background: var(--vaadin-background-container);
    gap: var(--vaadin-gap-s);

    & [part='thumbnail'],
    & [part='done-icon'],
    & [part='warning-icon'] {
      width: 100%;
      aspect-ratio: 1 / 1;
      align-items: center;
      justify-content: center;
      grid-column: 1;
    }

    & [part='loader']:not([hidden]) {
      display: flex;
      align-self: stretch;
      aspect-ratio: 1 / 1;
    }

    & [part='done-icon'] {
      display: none;
      &::before {
        /* TODO: Replace with vaadin file icon, once it exists. */
        mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>');
        mask-size: contain;
        background: currentColor;
      }
    }

    & [part='status'],
    & [part='error'] {
      border: 0;
      clip-path: inset(50%);
      width: 1px;
      height: 1px;
      margin: 0;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
    }

    & ::slotted([slot='progress']) {
      clip-path: inset(50%);
      margin: 0;
      overflow: hidden;
      position: absolute;
    }
  }

  :host([theme~='thumbnails'][complete]) {
    & [part='thumbnail'] {
      &:not([hidden]) {
        display: block;
        & + [part='done-icon'] {
          display: none;
        }
      }
      &[hidden] + [part='done-icon'] {
        display: flex;
      }
    }
  }

  /* TODO: queued state styles (no attribute makes this difficult to target) */

  @media (forced-colors: active) {
    :is([part$='icon'], [part$='button'])::before {
      background: CanvasText;
    }
  }
`;
