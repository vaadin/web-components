/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const uploadFileStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-upload-file-gap, var(--vaadin-gap-container-block));
    padding: var(--vaadin-upload-file-padding, var(--vaadin-padding));
  }

  [hidden] {
    display: none;
  }

  [part='row'] {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  [part='info'] {
    display: flex;
    gap: var(--vaadin-gap-container-inline);
    overflow: hidden;
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

  [part='done-icon']::before {
    background: var(--vaadin-upload-file-done-color, currentColor);
    mask-image: var(--_vaadin-icon-checkmark);
  }

  [part='warning-icon']::before {
    background: var(--vaadin-upload-file-warning-color, currentColor);
    mask-image: var(--_vaadin-icon-warn);
  }

  [part='done-icon'][hidden] + [part='warning-icon'][hidden] ~ [part='meta'] {
    padding-inline-start: calc(var(--vaadin-icon-size, 1lh) + var(--vaadin-gap-container-inline));
  }

  [part='meta'] {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  [part='name'] {
    color: var(--vaadin-upload-file-name-color, var(--vaadin-color));
    font-size: var(--vaadin-upload-file-name-font-size, inherit);
    font-weight: var(--vaadin-upload-file-name-font-weight, inherit);
    line-height: var(--vaadin-upload-file-name-line-height, inherit);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  [part='status'] {
    color: var(--vaadin-upload-file-status-color, var(--vaadin-color-subtle));
    font-size: var(--vaadin-upload-file-status-font-size, inherit);
    font-weight: var(--vaadin-upload-file-status-font-weight, inherit);
    line-height: var(--vaadin-upload-file-status-line-height, inherit);
  }

  [part='error'] {
    color: var(--vaadin-upload-file-error-color, var(--vaadin-color));
    font-size: var(--vaadin-upload-file-error-font-size, inherit);
    font-weight: var(--vaadin-upload-file-error-font-weight, inherit);
    line-height: var(--vaadin-upload-file-error-line-height, inherit);
  }

  [part='commands'] {
    display: flex;
  }

  button {
    background: var(--vaadin-upload-file-button-background, transparent);
    border: var(
      --vaadin-upload-file-button-border,
      var(--vaadin-upload-file-button-border-width, 1px) solid
        var(--vaadin-upload-file-button-border-color, transparent)
    );
    border-radius: var(--vaadin-upload-file-button-border-radius, var(--vaadin-radius-m));
    color: var(--vaadin-upload-file-button-text-color, var(--vaadin-color));
    cursor: var(--vaadin-clickable-cursor);
    flex-shrink: 0;
    font-family: var(--vaadin-upload-file-button-font-family, inherit);
    font-size: var(--vaadin-upload-file-button-font-size, inherit);
    font-weight: var(--vaadin-upload-file-button-font-weight, 500);
    height: var(--vaadin-upload-file-button-height, auto);
    line-height: var(--vaadin-upload-file-button-line-height, inherit);
    padding: var(--vaadin-upload-file-button-padding, var(--vaadin-padding-container));
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
    margin-inline-start: calc(var(--vaadin-icon-size, 1lh) + var(--vaadin-gap-container-inline));
    width: auto;
  }

  :host([complete]) ::slotted([slot='progress']),
  :host([error]) ::slotted([slot='progress']) {
    display: none;
  }
`;
