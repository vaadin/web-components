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
    flex: auto;
    align-items: center;
    min-width: 0;
    color: inherit;
    font: inherit;
    text-decoration: none;
  }

  button {
    position: relative;
    flex: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
  }

  [part='children'] {
    margin: 0;
    padding: 0;
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
    border: initial;
    outline: none;
    background-color: initial;
    color: inherit;
    font: inherit;
    text-align: inherit;
  }

  [part='children'] {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;
