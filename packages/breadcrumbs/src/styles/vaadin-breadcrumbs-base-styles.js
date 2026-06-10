/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbsStyles = css`
  :host {
    display: block;
    width: 100%;
    min-width: 0;
    color: var(--vaadin-text-color);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    gap: var(--vaadin-gap-xs);
    min-width: 0;
    max-width: 100%;
  }

  [part='overflow'] {
    display: inline-flex;
    align-items: inherit;
    flex-shrink: 0;
  }

  [part='overflow'][hidden] {
    display: none !important;
  }

  [part='overflow-button'] {
    appearance: none;
    background: transparent;
    color: inherit;
    border: none;
    border-radius: var(--vaadin-radius-m);
    --_padding: var(--vaadin-padding-block-container);
    /* Ensure minimum click target (WCAG) */
    padding: max(var(--_padding), (24px - 1lh) / 2);
    margin: min(var(--_padding), (24px - 1lh) / -2);
    font: inherit;
    cursor: var(--vaadin-clickable-cursor);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  [part='overflow-button']::before {
    content: '\\e2003' / '';
    display: inline-flex;
    align-items: center;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--vaadin-breadcrumbs-overflow-icon, var(--_vaadin-icon-ellipsis)) center / contain no-repeat;
    opacity: 0.8;
  }

  [part='overflow-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='overflow']::after {
    content: '\\e2003' / '';
    display: inline-flex;
    align-items: center;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--vaadin-breadcrumbs-separator, var(--_vaadin-icon-chevron-right)) center / 90% no-repeat;
    margin-inline-start: var(--vaadin-gap-xs);
    opacity: 0.75;
  }

  :host([dir='rtl']) [part='overflow']::after {
    transform: scaleX(-1);
  }

  :host([theme~='slash']) {
    --vaadin-breadcrumbs-separator: var(--_vaadin-icon-slash);
  }

  @media (forced-colors: active) {
    [part='overflow-button']::before,
    [part='overflow']::after {
      background: CanvasText;
    }
  }
`;
