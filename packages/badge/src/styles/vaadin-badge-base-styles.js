/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const badgeStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    vertical-align: baseline;
    padding: var(--vaadin-badge-padding, 0.4em calc(0.5em + var(--vaadin-badge-border-radius, 0.25em) / 4));
    font-family: var(--vaadin-badge-font-family, inherit);
    font-size: var(--vaadin-badge-font-size, 0.875em);
    font-weight: var(--vaadin-badge-font-weight, 500);
    line-height: var(--vaadin-badge-line-height, 1);
    color: var(--vaadin-badge-text-color, var(--vaadin-text-color));
    background: var(--vaadin-badge-background, var(--vaadin-background-container));
    border-radius: var(--vaadin-badge-border-radius, var(--vaadin-radius-m));
    flex-shrink: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([empty]) {
    min-width: 0;
    width: 1em;
    height: 1em;
    padding: 0;
    border-radius: 50%;
  }

  :host([theme~='primary']) {
    --vaadin-badge-background: var(--vaadin-text-color);
    --vaadin-badge-text-color: var(--vaadin-background-color);
  }

  @media (forced-colors: active) {
    :host {
      border: 1px solid;
    }
  }
`;
