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
    color: var(--vaadin-breadcrumbs-text-color, var(--vaadin-text-color-secondary));
    font-size: var(--vaadin-breadcrumbs-font-size, 1em);
    line-height: var(--vaadin-breadcrumbs-line-height, inherit);
    font-weight: var(--vaadin-breadcrumbs-font-weight, 400);
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    gap: var(--vaadin-breadcrumbs-gap, var(--vaadin-gap-xs));
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
    border-radius: var(--vaadin-breadcrumbs-item-border-radius, var(--vaadin-radius-m));
    --_padding: var(--vaadin-padding-block-container);
    /* Ensure minimum click target (WCAG) */
    padding: max(var(--_padding), round((24px - 1lh) / 2, 1px));
    margin: min(var(--_padding), round((24px - 1lh) / -2, 1px));
    font: inherit;
    cursor: var(--vaadin-clickable-cursor);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }

  [part='overflow-button']::before {
    content: '\\2003' / '';
    display: inline-flex;
    align-items: center;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--vaadin-breadcrumbs-overflow-icon, var(--_vaadin-icon-ellipsis)) center /
      var(--vaadin-icon-visual-size, 100%) no-repeat;
    opacity: 0.8;
  }

  [part='overflow-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='overflow']::after {
    content: '\\2003' / '';
    display: inline-flex;
    align-items: center;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    background: currentColor;
    mask: var(--vaadin-breadcrumbs-separator-icon, var(--_vaadin-icon-chevron-right)) center /
      var(--vaadin-icon-visual-size, 100%) no-repeat;
    margin-inline-start: var(--vaadin-breadcrumbs-gap, var(--vaadin-gap-xs));
    opacity: 0.75;
  }

  :host([dir='rtl']) [part='overflow']::after {
    scale: -1;
  }

  :host(:where(:not([theme~='slash']))) [part='overflow']::after,
  :host(:where(:not([theme~='slash']))) ::slotted(vaadin-breadcrumbs-item)::after {
    --vaadin-icon-visual-size: 90%;
  }

  :host([theme~='slash']) {
    --vaadin-breadcrumbs-separator-icon: var(--_vaadin-icon-slash);
  }

  @media (forced-colors: active) {
    [part='overflow-button']::before,
    [part='overflow']::after {
      background: CanvasText !important;
    }
  }
`;
