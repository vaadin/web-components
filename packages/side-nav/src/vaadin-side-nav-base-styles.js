/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const sideNavItemBaseStyles = css`
  :host {
    display: block;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  [part='content'] {
    display: flex;
    align-items: center;
  }

  [part='link'] {
    display: flex;
    min-width: 0;
    flex: auto;
    align-items: center;
    color: inherit;
    font: inherit;
    text-decoration: none;
  }

  button {
    position: relative;
    flex: none;
    padding: 0;
    border: 0;
    margin: 0;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
  }

  [part='children'] {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  :host(:not([has-children])) button {
    display: none !important;
  }

  slot[name='prefix'],
  slot[name='suffix'] {
    flex: none;
  }

  slot:not([name]) {
    display: block;
    overflow: hidden;
    min-width: 0;
    flex: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const sideNavBaseStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  button {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: inherit;
    padding: 0;
    border: initial;
    margin: 0;
    background-color: initial;
    color: inherit;
    font: inherit;
    outline: none;
    text-align: inherit;
  }

  [part='children'] {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
`;
