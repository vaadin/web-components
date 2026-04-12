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
  }

  :host([dir='rtl']) #overflow .separator {
    scale: -1;
  }

  [part='overflow-button'] {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font: inherit;
    color: inherit;
  }

  [part='back-link'] {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    font: inherit;
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
`;
