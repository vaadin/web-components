/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const fieldOutlineStyles = css`
  :host {
    --_active-user-color: transparent;
    display: block;
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    user-select: none;
    inset: 0;
  }

  :host([has-active-user]) {
    opacity: 1;
  }
`;

export const userTagStyles = css`
  :host {
    --vaadin-user-tag-offset: 4px;
    display: block;
    box-sizing: border-box;
    height: 1.3rem;
    margin: 0 0 var(--vaadin-user-tag-offset);
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
    background-color: var(--vaadin-user-tag-color);
    color: #fff;
    cursor: default;
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
    height: 1.3rem;
    padding: 2px 4px;
    overflow: hidden;
    font-size: 13px;
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
    position: relative;
    left: -4px;
    padding: 4px;
    overflow: visible;
    outline: none;
    background: transparent;
    box-shadow: none;
  }

  ::slotted([part='tags']) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  :host([dir='rtl']) [part='overlay'] {
    right: -4px;
    left: auto;
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
