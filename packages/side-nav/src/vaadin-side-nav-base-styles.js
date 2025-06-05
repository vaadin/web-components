/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

const sharedStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-side-nav-items-gap, var(--_vaadin-gap-container-block));
    cursor: default;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  button {
    appearance: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
    cursor: var(--vaadin-clickable-cursor);
    flex: none;
  }

  [part='toggle-button'] {
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--_vaadin-radius-s));
    color: var(--_vaadin-color);
    cursor: var(--vaadin-clickable-cursor);
  }

  [part='toggle-button']::before {
    content: '';
    display: block;
    background: currentColor;
    mask-image: var(--_vaadin-icon-chevron-down);
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
  }

  :host(:is(vaadin-side-nav-item:not([expanded]), vaadin-side-nav[collapsed])) [part='toggle-button'] {
    rotate: -90deg;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='toggle-button'] {
      transition: rotate 120ms;
    }
  }

  [part='children'] {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: var(--vaadin-side-nav-items-gap, var(--_vaadin-gap-container-block));
  }

  :focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  @media (forced-colors: active) {
    [part='toggle-button']::before {
      background: CanvasText;
    }
  }
`;

export const sideNavStyles = css`
  ${sharedStyles}

  [part='label'] {
    align-self: start;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: var(--vaadin-side-nav-label-gap, var(--_vaadin-gap-container-inline));
    padding: var(--vaadin-side-nav-label-padding, var(--_vaadin-padding-container));
    font-size: var(--vaadin-side-nav-label-font-size, 0.875em);
    font-weight: var(--vaadin-side-nav-label-font-weight, 500);
    color: var(--vaadin-side-nav-label-color, inherit);
    line-height: var(--vaadin-side-nav-label-line-height, inherit);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--_vaadin-radius-m));
  }
`;

export const sideNavSlotStyles = css`
  vaadin-side-nav:has(vaadin-icon[slot='prefix']) {
    --_has-prefix-icon: '';
  }

  vaadin-side-nav-item:has(> vaadin-icon[slot='prefix'])::part(link) {
    --_has-prefix-icon:;
  }
`;

export const sideNavItemStyles = css`
  ${sharedStyles}

  [part='content'] {
    display: flex;
    align-items: center;
    padding: var(--vaadin-side-nav-item-padding, var(--_vaadin-padding-container));
    gap: var(--vaadin-side-nav-item-gap, var(--_vaadin-gap-container-inline));
    font-size: var(--vaadin-side-nav-item-font-size, 1em);
    font-weight: var(--vaadin-side-nav-item-font-weight, 500);
    line-height: var(--vaadin-side-nav-item-line-height, inherit);
    color: var(--vaadin-side-nav-item-color, inherit);
    background: var(--vaadin-side-nav-item-background, transparent);
    background-origin: border-box;
    border: var(--vaadin-side-nav-item-border-width, 0px) solid var(--vaadin-side-nav-item-border-color, transparent);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--_vaadin-radius-m));
  }

  :host([current]) [part='content'] {
    --vaadin-side-nav-item-background: var(--_vaadin-background-container-strong);
    --vaadin-side-nav-item-color: var(--_vaadin-color-strong);
  }

  [part='link'] {
    flex: auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: inherit;
    text-decoration: none;
    color: inherit;
    white-space: nowrap;
    outline: 0;
    cursor: var(--vaadin-clickable-cursor);
  }

  :host(:not([has-children])) [part='link']:not(:any-link) {
    cursor: default;
  }

  :host(:not([has-children])) [part='toggle-button'] {
    display: none !important;
  }

  slot:not([name]) {
    display: block;
    flex: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: inherit;
  }

  /* Reserved space for icon */
  slot[name='prefix']::before {
    content: var(--_has-prefix-icon);
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    flex: none;
  }

  [part='content']:has(:not([part='toggle-button']):focus-visible),
  [part='toggle-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  /* Hierarchy indentation */
  [part='content']::before {
    content: '';
    --_hierarchy-indent: calc(var(--_level, 0) * var(--vaadin-side-nav-child-indent, var(--vaadin-icon-size, 1lh)));
    --_icon-indent: calc(var(--_level, 0) * var(--vaadin-side-nav-item-gap, var(--_vaadin-gap-container-inline)));
    width: calc(var(--_hierarchy-indent) + var(--_icon-indent));
    flex: none;
    margin-inline-start: calc(var(--vaadin-side-nav-item-gap, var(--_vaadin-gap-container-inline)) * -1);
  }

  slot[name='children'] {
    --_level: calc(var(--_level-2, 0) + 1);
  }

  slot[name='children']::slotted(*) {
    --_level-2: var(--_level);
  }

  @media (forced-colors: active) {
    :host([current]) [part='content'] {
      color: Highlight;
    }
  }
`;
