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

  :host([current]) {
    color: var(--vaadin-text-color);
    font-weight: bolder;
  }

  [part='link'],
  [part='nolink'] {
    display: inline-flex;
    gap: var(--vaadin-breadcrumbs-item-gap, var(--vaadin-gap-xs));
    align-items: baseline;
    border-radius: var(--vaadin-breadcrumbs-item-border-radius, var(--vaadin-radius-m));
    padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
    flex: 1;
  }

  :host(:not([slot='overlay'])) :is([part='link'], [part='nolink']) {
    margin-inline: calc(var(--vaadin-padding-inline-container) * -1);
  }

  [part='link'] {
    text-decoration: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;

    &:any-link {
      color: var(--vaadin-breadcrumbs-link-color, LinkText);
    }

    &:focus-visible {
      outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    }
  }

  :host::after {
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

  :host(:last-of-type)::after,
  :host([current])::after {
    display: none;
  }

  :host([dir='rtl'])::after {
    scale: -1;
  }

  :host([slot='overlay']) {
    display: flex;

    [part='link'] {
      border-radius: var(--vaadin-radius-s);
    }
  }

  :host([slot='overlay'][disabled]),
  :host([slot='overlay']:not([path])) {
    color: var(--vaadin-text-color-secondary);
  }

  :host([slot='overlay'][focus-ring]) [part='link'] {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
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
