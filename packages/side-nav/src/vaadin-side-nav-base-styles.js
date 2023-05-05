/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const sideNavItemBaseStyles = css`
  :host {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  a {
    flex: auto;
    min-width: 0;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    font: inherit;
  }

  button {
    -webkit-appearance: none;
    appearance: none;
    flex: none;
  }

  :host(:not([path])) a {
    position: relative;
  }

  :host(:not([path])) button::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  slot[name='prefix'],
  slot[name='suffix'] {
    flex: none;
  }

  slot:not([name]) {
    display: block;
    flex: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  slot[name='children'] {
    /* Needed to make role="list" work */
    display: block;
    width: 100%;
  }
`;

export const sideNavBaseStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  summary ::slotted([slot='label']) {
    display: block;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::marker {
    content: '';
  }

  summary::after {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  slot {
    /* Needed to make role="list" work */
    display: block;
  }
`;
