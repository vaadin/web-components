/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbsItemStyles = css`
  :host {
    display: inline-flex;
    align-items: baseline;
    flex-shrink: 0;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) [part='link'] {
    color: var(--vaadin-text-color-disabled);
  }

  :host([current]) [part='nolink'] {
    color: var(--vaadin-text-color);
  }

  [part='link'],
  [part='nolink'] {
    display: inline-flex;
    align-items: baseline;
    border-radius: var(--vaadin-radius-m);
    padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
    flex: 1;
  }

  :host(:not([slot='overlay'])) :is([part='link'], [part='nolink']) {
    margin-inline: calc(var(--vaadin-padding-inline-container) * -1);
  }

  [part='link'] {
    outline: none;
  }

  [part='link']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  :host::after {
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

  :host(:last-of-type)::after,
  :host([current])::after {
    display: none;
  }

  :host([dir='rtl'])::after {
    transform: scaleX(-1);
  }

  :host([slot='overlay']) {
    display: flex;
  }

  :host([slot='overlay']:not([disabled])) [part='link'] {
    color: var(--vaadin-text-color);
  }

  :host([slot='overlay'])::after {
    display: none;
  }

  @media (any-hover: hover) {
    :host([slot='overlay']) [part='link'] {
      text-decoration: none;
    }
  }

  @media (forced-colors: active) {
    :host::after {
      background: CanvasText;
    }
  }
`;
