/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const fieldOutlineStyles = css`
  :host {
    --_active-user-color: transparent;
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    user-select: none;
  }

  :host([has-active-user]) {
    opacity: 1;
  }
`;

export const userTagStyles = css`
  :host {
    --vaadin-user-tag-offset: 4px;
    display: block;
    height: 1.3rem;
    box-sizing: border-box;
    margin: 0 0 var(--vaadin-user-tag-offset);
    background-color: var(--vaadin-user-tag-color);
    color: #fff;
    cursor: default;
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
    overflow: hidden;
    height: 1.3rem;
    box-sizing: border-box;
    padding: 2px 4px;
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
    overflow: visible;
    padding: 4px;
    background: transparent;
    box-shadow: none;
    outline: none;
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
