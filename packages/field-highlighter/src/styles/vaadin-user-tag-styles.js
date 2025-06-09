/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

export const userTagStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    margin: 0 0 var(--vaadin-user-tag-offset);
    opacity: 0;
    height: 1.3rem;
    transition: opacity 0.2s ease-in-out;
    background-color: var(--vaadin-user-tag-color);
    color: #fff;
    cursor: default;
    -webkit-user-select: none;
    user-select: none;
    --vaadin-user-tag-offset: 4px;
  }

  :host(.show) {
    opacity: 1;
  }

  :host(:last-of-type) {
    margin-bottom: 0;
  }

  [part='name'] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    padding: 2px 4px;
    height: 1.3rem;
    font-size: 13px;
  }
`;
