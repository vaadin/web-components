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
    gap: var(--vaadin-upload-file-gap, var(--vaadin-gap-s));
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

  /* Hide thumbnail and file-icon by default, only show with thumbnails theme */
  [part='thumbnail'],
  [part='file-icon'] {
    display: none;
    width: var(--vaadin-upload-file-thumbnail-size, 3rem);
    height: var(--vaadin-upload-file-thumbnail-size, 3rem);
    border-radius: var(--vaadin-radius-s);
    grid-column: 1;
    grid-row: 1;
    align-self: center;
  }

  [part='thumbnail'] {
    object-fit: cover;
  }

  [part='file-icon'] {
    background: var(--vaadin-color-contrast-10, #e0e0e0);
  }

  [part='file-icon']::before {
    --_vaadin-upload-file-icon: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>');
    content: '\\2003' / '';
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: var(--vaadin-color-contrast-50, #888);
    mask-image: var(--_vaadin-upload-file-icon);
    mask-size: 50%;
    mask-position: 50%;
    mask-repeat: no-repeat;
  }

  :host([theme~='thumbnails']) {
    grid-template-columns: var(--vaadin-upload-file-thumbnail-size, 3rem) minmax(0, 1fr) auto;
  }

  :host([theme~='thumbnails']) [part='thumbnail']:not([hidden]) {
    display: block;
  }

  :host([theme~='thumbnails']) [part='file-icon']:not([hidden]) {
    display: flex;
  }

  [part='done-icon']:not([hidden]),
  [part='warning-icon']:not([hidden]) {
    display: flex;
  }

  /* Hide done-icon and warning-icon for non-image files in thumbnails theme */
  :host([theme~='thumbnails']) [part='file-icon']:not([hidden]) ~ [part='done-icon']:not([hidden]),
  :host([theme~='thumbnails']) [part='file-icon']:not([hidden]) ~ [part='warning-icon']:not([hidden]) {
    display: none;
  }

  /* Position done-icon as overlay on thumbnail in thumbnails theme */
  :host([theme~='thumbnails']) [part='thumbnail']:not([hidden]) ~ [part='done-icon']:not([hidden]) {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    width: var(--vaadin-upload-file-thumbnail-size, 3rem);
    height: var(--vaadin-upload-file-thumbnail-size, 3rem);
    border-radius: var(--vaadin-radius-s);
    background: rgba(255, 255, 255, 0.7);
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

  @media (forced-colors: active) {
    :is([part$='icon'], [part$='button'])::before {
      background: CanvasText;
    }
  }
`;
