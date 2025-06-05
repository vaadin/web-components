/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';
import { sharedStyles } from './vaadin-side-nav-shared-base-styles.js';

const sideNavItem = css`
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
    border: var(--vaadin-side-nav-item-border-width, 0) solid var(--vaadin-side-nav-item-border-color, transparent);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--_vaadin-radius-m));
    cursor: var(--vaadin-clickable-cursor);
    touch-action: manipulation;
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

export const sideNavItemStyles = [sharedStyles, sideNavItem];
