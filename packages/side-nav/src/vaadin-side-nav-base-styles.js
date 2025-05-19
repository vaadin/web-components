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
    position: relative;
    margin: 0;
    padding: 0;
    border: 0;
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
    display: flex;
    align-items: center;
    justify-content: inherit;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: initial;
    color: inherit;
    border: initial;
    outline: none;
    font: inherit;
    text-align: inherit;
  }

  [part='children'] {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
`;
