/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadFileStyles = css`
  :host {
    align-items: center;
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

  [part='done-icon']:not([hidden]),
  [part='warning-icon']:not([hidden]) {
    display: flex;
  }

  [part='done-icon']::before,
  [part='warning-icon']::before {
    content: '';
    display: inline-block;
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

  button {
    background: var(--vaadin-upload-file-button-background, transparent);
    border: var(--vaadin-upload-file-button-border-width, 1px) solid
      var(--vaadin-upload-file-button-border-color, transparent);
    border-radius: var(--vaadin-upload-file-button-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-upload-file-button-text-color, var(--vaadin-text-color));
    cursor: var(--vaadin-clickable-cursor);
    flex-shrink: 0;
    font: inherit;
    padding: var(
      --vaadin-upload-file-button-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
  }

  button:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='start-button']::before,
  [part='retry-button']::before,
  [part='remove-button']::before {
    background: currentColor;
    content: '';
    display: block;
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
