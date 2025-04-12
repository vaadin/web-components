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
    align-items: center;
    display: flex;
  }

  [part='link'] {
    align-items: center;
    color: inherit;
    display: flex;
    flex: auto;
    font: inherit;
    min-width: 0;
    text-decoration: none;
  }

  button {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: 0;
    flex: none;
    margin: 0;
    padding: 0;
    position: relative;
  }

  [part='children'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
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
    flex: auto;
    min-width: 0;
    overflow: hidden;
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
    align-items: center;
    background-color: initial;
    border: initial;
    color: inherit;
    display: flex;
    font: inherit;
    justify-content: inherit;
    margin: 0;
    outline: none;
    padding: 0;
    text-align: inherit;
    width: 100%;
  }

  [part='children'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
`;
