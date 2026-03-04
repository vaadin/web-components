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
    vertical-align: baseline;
    box-sizing: border-box;
    gap: var(--vaadin-badge-gap, 0.25em);
    padding: var(--vaadin-badge-padding, 0 calc(0.5lh - 0.25em));
    font-family: var(--vaadin-badge-font-family, inherit);
    font-size: var(--vaadin-badge-font-size, 0.875rem);
    font-weight: var(--vaadin-badge-font-weight, 500);
    line-height: var(--vaadin-badge-line-height, round(1em * 1.5, 0.125rem));
    color: var(--vaadin-badge-text-color, var(--vaadin-text-color));
    background: var(--vaadin-badge-background, transparent);
    border: var(--vaadin-badge-border-width, 1px) solid var(--vaadin-badge-border-color, var(--vaadin-border-color));
    border-radius: var(--vaadin-badge-border-radius, 100vh);
    min-width: calc(1lh + var(--vaadin-badge-border-width, 1px) * 2);
    white-space: nowrap;
    --vaadin-icon-size: 1em;
    /* prevent from stretching */
    height: calc(1lh + var(--vaadin-badge-border-width, 1px) * 2);
    flex: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([has-icon])) [part='icon'],
  :host(:not([has-content])) [part='content'],
  :host(:not([has-number])) [part='number'] {
    display: none;
  }

  :host(:is([theme~='filled'], [theme~='dot'])) {
    background: var(--vaadin-text-color);
    color: var(--vaadin-background-color);
  }

  :host([theme~='icon-only']),
  :host([has-icon]:not([has-content], [has-number])) {
    padding: 0;
  }

  :host([theme~='icon-only']),
  :host([theme~='number-only']) {
    gap: 0;
  }

  :host([theme~='dot']) {
    min-width: 0;
    width: round(0.5em, 0.125rem);
    height: round(0.5em, 0.125rem);
    padding: 0;
  }

  @media (forced-colors: active) {
    :host {
      border: 1px solid !important;
    }
  }
`;
