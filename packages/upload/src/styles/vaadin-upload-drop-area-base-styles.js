/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadDropAreaStyles = css`
  :host {
    align-items: center;
    background: var(--vaadin-upload-drop-area-background, var(--vaadin-background-container));
    border: var(--vaadin-upload-drop-area-border-width, 2px) dashed
      var(--vaadin-upload-drop-area-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-upload-drop-area-border-radius, var(--vaadin-radius-m));
    box-sizing: border-box;
    color: var(--vaadin-upload-drop-area-color, var(--vaadin-text-color-secondary));
    display: flex;
    flex-direction: column;
    font-size: var(--vaadin-upload-drop-area-font-size, inherit);
    gap: var(--vaadin-upload-drop-area-gap, var(--vaadin-gap-s));
    justify-content: center;
    min-height: var(--vaadin-upload-drop-area-min-height, 100px);
    padding: var(--vaadin-upload-drop-area-padding, var(--vaadin-padding-m));
    transition:
      background 0.2s,
      border-color 0.2s,
      color 0.2s;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([dragover]) {
    --vaadin-upload-drop-area-background: var(
      --vaadin-upload-drop-area-dragover-background,
      var(--vaadin-background-container-hover)
    );
    --vaadin-upload-drop-area-border-color: var(
      --vaadin-upload-drop-area-dragover-border-color,
      var(--vaadin-text-color)
    );
    --vaadin-upload-drop-area-color: var(--vaadin-upload-drop-area-dragover-color, var(--vaadin-text-color));
  }
`;
