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
  }

  [part='toggle-button']::before {
    content: '';
    display: block;
    background: currentColor;
    mask-image: var(--_vaadin-icon-chevron-down);
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    rotate: -90deg;
  }

  :host([dir='rtl']) [part='toggle-button']::before {
    scale: -1;
  }

  :host(:is(vaadin-side-nav-item[expanded], vaadin-side-nav:not([collapsed]))) [part='toggle-button'] {
    rotate: 90deg;
  }

  :host([dir='rtl']:is(vaadin-side-nav-item[expanded], vaadin-side-nav:not([collapsed]))) [part='toggle-button'] {
    rotate: -90deg;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='toggle-button'] {
      transition: rotate 150ms;
    }
  }

  :host([disabled]) [part='toggle-button'] {
    opacity: 0.5;
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

  :host {
    white-space: nowrap;
  }

  [part='label'] {
    align-self: start;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: var(--vaadin-side-nav-item-gap, var(--_vaadin-gap-container-inline));
    padding: var(--vaadin-side-nav-item-padding, var(--_vaadin-padding-container));
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
    padding: var(--vaadin-side-nav-item-padding, var(--_vaadin-padding));
    gap: var(--vaadin-side-nav-item-gap, var(--_vaadin-gap-container-inline));
    font-size: var(--vaadin-side-nav-item-font-size, 1em);
    font-weight: var(--vaadin-side-nav-item-font-weight, 500);
    line-height: var(--vaadin-side-nav-item-line-height, inherit);
    color: var(--vaadin-side-nav-item-color, inherit);
    background: var(--vaadin-side-nav-item-background, transparent);
    background-origin: border-box;
    border: var(--vaadin-side-nav-item-border-width, 0px) solid var(--vaadin-side-nav-item-border-color, transparent);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--_vaadin-radius-m));
    cursor: var(--vaadin-clickable-cursor);
  }

  :host([current]) [part='content'] {
    --vaadin-side-nav-item-background: var(--_vaadin-background-container-strong);
    --vaadin-side-nav-item-color: var(--_vaadin-color-strong);
  }

  :host([disabled]) {
    --vaadin-clickable-cursor: var(--vaadin-disabled-cursor);
  }

  :host([disabled]) [part='content'] {
    --vaadin-side-nav-item-color: var(--_vaadin-color-subtle);
  }

  [part='link'] {
    flex: auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: inherit;
    text-decoration: none;
    color: inherit;
    outline: 0;
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
    /* Don't clip ascenders or descenders */
    padding-block: 0.25em;
    margin-block: -0.25em;
  }

  slot:is([name='prefix'], [name='suffix'])::slotted(*) {
    flex: none;
  }

  /* Reserved space for icon */
  slot[name='prefix']::before {
    content: var(--_has-prefix-icon);
    display: block;
    width: var(--vaadin-icon-size, 1lh);
    flex: none;
  }

  [part='content']:not(:has([href])):has([part='toggle-button']:focus-visible),
  [part='content']:has(:not([part='toggle-button']):focus-visible),
  [part='content']:has([href]) [part='toggle-button']:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  [part='content']:not(:has([href])) [part='toggle-button']:focus-visible {
    outline: 0;
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

    :host([disabled]) [part='content'] {
      --vaadin-side-nav-item-color: GrayText;
    }

    :host([disabled]) [part='toggle-button']::before {
      background: GrayText;
    }
  }
`;
