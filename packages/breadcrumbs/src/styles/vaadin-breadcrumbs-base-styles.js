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
    color: var(--vaadin-text-color);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--vaadin-gap-xs);
    min-width: 0;
    overflow: hidden;
    /* Room for items' focus outline, otherwise clipped by overflow: hidden. */
    padding: var(--vaadin-focus-ring-width);
  }

  [part='overflow'] {
    display: inline-flex;
    align-items: center;
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
    padding: 0;
    margin: 0;
    font: inherit;
    cursor: var(--vaadin-clickable-cursor);
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  [part='overflow-button']::before {
    content: '…';
  }

  [part='overflow-button']:focus-visible {
    border-radius: var(--vaadin-radius-s);
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='overflow']::after {
    content: '';
    display: inline-block;
    width: 1em;
    height: 1em;
    color: var(--vaadin-text-color-secondary);
    background: currentColor;
    mask: var(--vaadin-breadcrumbs-separator, var(--_vaadin-icon-chevron-right)) center / contain no-repeat;
    margin-inline-start: var(--vaadin-gap-xs);
  }

  :host([dir='rtl']) [part='overflow']::after {
    transform: scaleX(-1);
  }

  @media (forced-colors: active) {
    [part='overflow']::after {
      background: CanvasText;
    }
  }
`;
