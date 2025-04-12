/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const fieldOutlineStyles = css`
  :host {
    --_active-user-color: transparent;
    box-sizing: border-box;
    display: block;
    height: 100%;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    user-select: none;
    width: 100%;
  }

  :host([has-active-user]) {
    opacity: 1;
  }
`;

export const userTagStyles = css`
  :host {
    --vaadin-user-tag-offset: 4px;
    background-color: var(--vaadin-user-tag-color);
    box-sizing: border-box;
    color: #fff;
    cursor: default;
    display: block;
    height: 1.3rem;
    margin: 0 0 var(--vaadin-user-tag-offset);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    -webkit-user-select: none;
    user-select: none;
  }

  :host(.show) {
    opacity: 1;
  }

  :host(:last-of-type) {
    margin-bottom: 0;
  }

  [part='name'] {
    box-sizing: border-box;
    font-size: 13px;
    height: 1.3rem;
    overflow: hidden;
    padding: 2px 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const userTagsOverlayStyles = css`
  :host {
    background: transparent;
    box-shadow: none;
  }

  :scope [part='overlay'] {
    background: transparent;
    box-shadow: none;
    left: -4px;
    outline: none;
    overflow: visible;
    padding: 4px;
    position: relative;
  }

  ::slotted([part='tags']) {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }

  :host([dir='rtl']) [part='overlay'] {
    left: auto;
    right: -4px;
  }

  :scope [part='content'] {
    padding: 0;
  }

  :host([opening]),
  :host([closing]) {
    animation: 0.14s user-tags-overlay-dummy-animation;
  }

  @keyframes user-tags-overlay-dummy-animation {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
`;
