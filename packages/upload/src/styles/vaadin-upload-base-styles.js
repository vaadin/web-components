/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const uploadStyles = css`
  :host {
    background: var(--vaadin-upload-background, transparent);
    border: var(--vaadin-upload-border-width, 1px) solid
      var(--vaadin-upload-border-color, var(--vaadin-border-color-secondary));
    border-radius: var(--vaadin-upload-border-radius, var(--vaadin-radius-m));
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: var(--vaadin-upload-padding, var(--vaadin-padding-s));
    position: relative;
  }

  :host([dragover-valid]) {
    --vaadin-upload-background: var(--vaadin-background-container);
    --vaadin-upload-border-color: var(--vaadin-text-color);
    border-style: dashed;
  }

  :host([hidden]) {
    display: none !important;
  }

  [hidden] {
    display: none !important;
  }

  [part='primary-buttons'] {
    align-items: center;
    display: flex;
    gap: var(--vaadin-gap-s);
  }

  [part='drop-label'] {
    align-items: center;
    color: var(--vaadin-upload-drop-label-color, var(--vaadin-text-color));
    display: flex;
    font-size: var(--vaadin-upload-drop-label-font-size, inherit);
    font-weight: var(--vaadin-upload-drop-label-font-weight, inherit);
    gap: var(--vaadin-upload-drop-label-gap, var(--vaadin-gap-s));
    line-height: var(--vaadin-upload-drop-label-line-height, inherit);
  }

  /* Icon-only variant: shows upload icon instead of button text */
  :host([theme~='icon-only']) ::slotted(vaadin-button) {
    font-size: 0;
    gap: 0;
    min-width: 0;
    padding-inline: var(--vaadin-padding-block-container);
  }

  :host([theme~='icon-only']) ::slotted(vaadin-button)::after {
    background: currentColor;
    content: '';
    display: block;
    font-size: initial;
    height: var(--vaadin-icon-size, 1lh);
    mask: var(--_vaadin-icon-upload) 50% / var(--vaadin-icon-visual-size, 100%) no-repeat;
    width: var(--vaadin-icon-size, 1lh);
  }
`;
