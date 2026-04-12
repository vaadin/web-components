/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbSlotStyles = css`
  vaadin-breadcrumb-item[overflow-hidden] {
    display: none !important;
  }

  vaadin-breadcrumb-item {
    order: 2;
  }

  vaadin-breadcrumb-item[first] {
    order: 0;
  }
`;

export const breadcrumbStyles = css`
  :host {
    display: block;
    font-size: var(--vaadin-breadcrumb-font-size, inherit);
    color: var(--vaadin-breadcrumb-text-color, var(--vaadin-text-color));
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin: 0;
    padding: 0;
    gap: var(--vaadin-breadcrumb-gap, var(--vaadin-gap-xs));
    overflow: hidden;
  }

  #overflow {
    display: flex;
    align-items: center;
    order: 1;
    flex-shrink: 0;
  }

  #overflow[hidden] {
    display: none;
  }

  #overflow .separator {
    display: inline-flex;
    align-items: center;
    color: var(--vaadin-breadcrumb-separator-color, var(--vaadin-text-color-secondary));
  }

  :host([dir='rtl']) #overflow .separator {
    scale: -1;
  }

  [part='overflow-button'] {
    background: none;
    border: none;
    cursor: var(--vaadin-clickable-cursor);
    padding: 0;
    font: inherit;
    color: inherit;
  }

  [part='overflow-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  /* Mobile mode: back-link */
  [part='back-link'] {
    display: inline-flex;
    align-items: center;
    text-decoration: underline;
    color: inherit;
    font: inherit;
  }

  [part='back-link']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: 1px;
  }

  [part='back-arrow'] {
    display: inline-block;
  }

  [part='back-arrow']::before {
    content: '\\2039';
  }

  :host([dir='rtl']) [part='back-arrow'] {
    scale: -1;
  }

  @media (forced-colors: active) {
    #overflow .separator {
      color: CanvasText;
    }

    [part='overflow-button']:focus-visible {
      outline-color: Highlight;
    }

    [part='back-link'] {
      color: LinkText;
    }

    [part='back-link']:focus-visible {
      outline-color: Highlight;
    }
  }
`;
