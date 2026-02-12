/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const badgeStyles = css`
  :host {
    /* Layout */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    vertical-align: baseline;

    /* Sizing */
    padding: var(--vaadin-badge-padding, 0.4em calc(0.5em + var(--vaadin-badge-border-radius, 0.25em) / 4));
    min-width: var(--vaadin-badge-min-width, calc(1lh + 0.45em));

    /* Typography */
    font-family: var(--vaadin-badge-font-family, inherit);
    font-size: var(--vaadin-badge-font-size, var(--vaadin-font-size-s, 0.875rem));
    font-weight: var(--vaadin-badge-font-weight, 500);
    line-height: var(--vaadin-badge-line-height, 1);
    text-transform: initial;
    letter-spacing: initial;

    /* Colors */
    color: var(--vaadin-badge-text-color, var(--vaadin-text-color));
    background: var(--vaadin-badge-background, var(--vaadin-background-container-subtle));

    /* Border */
    border-radius: var(--vaadin-badge-border-radius, 0.25em);

    /* Prevent shrinking */
    flex-shrink: 0;
  }

  /* Vertical alignment helper */
  :host::before {
    content: '\\2003';
    display: inline-block;
    width: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Empty badge (dot indicator) */
  :host([empty]) {
    min-width: 0;
    width: 1em;
    height: 1em;
    padding: 0;
    border-radius: 50%;
  }

  @media (forced-colors: active) {
    :host {
      border: 1px solid;
    }
  }
`;
