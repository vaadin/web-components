/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const fieldOutlineStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
    opacity: 0;
    --_active-user-color: transparent;
  }

  :host([has-active-user]) {
    opacity: 1;
  }
`;

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

export const userTagsOverlayStyles = css`
  :host {
    background: transparent;
    box-shadow: none;
  }

  :scope [part='overlay'] {
    box-shadow: none;
    background: transparent;
    position: relative;
    left: -4px;
    padding: 4px;
    outline: none;
    overflow: visible;
  }

  ::slotted([part='tags']) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
