/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { screenReaderOnly } from '@vaadin/a11y-base/src/styles/sr-only-styles.js';
import { sharedStyles } from './vaadin-side-nav-shared-base-styles.js';

const sideNavItem = css`
  [part='content'] {
    display: flex;
    align-items: center;
    min-width: 0;
    max-width: 100%;
    padding: var(
      --vaadin-side-nav-item-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    --_gap: var(--vaadin-side-nav-item-gap, var(--vaadin-gap-s));
    gap: var(--_gap);
    font-size: var(--vaadin-side-nav-item-font-size, 1em);
    font-weight: var(--vaadin-side-nav-item-font-weight, 500);
    line-height: var(--vaadin-side-nav-item-line-height, inherit);
    color: var(--vaadin-side-nav-item-text-color, var(--vaadin-text-color-secondary));
    background: var(--vaadin-side-nav-item-background, transparent);
    background-origin: border-box;
    border: var(--vaadin-side-nav-item-border-width, 0) solid var(--vaadin-side-nav-item-border-color, transparent);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--vaadin-radius-m));
    cursor: var(--vaadin-clickable-cursor);
    touch-action: manipulation;
  }

  :host([current]) [part='content'] {
    --vaadin-side-nav-item-background: var(--vaadin-background-container);
    --vaadin-side-nav-item-text-color: var(--vaadin-text-color);
  }

  :host([disabled]) {
    --vaadin-clickable-cursor: var(--vaadin-disabled-cursor);
  }

  :host([disabled]) [part='content'] {
    --vaadin-side-nav-item-text-color: var(--vaadin-text-color-disabled);
  }

  :host(:not([has-children])) {
    gap: 0;
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
    width: calc(
      var(--vaadin-side-nav-child-indent, 1em) * var(--_level, 0) + var(--_icon-indent, 0) *
        (var(--vaadin-icon-size, 1lh) + var(--_gap))
    );
    flex: none;
    margin-inline-start: calc(var(--_gap) * -1);
  }

  [part='children'] {
    --_level: calc(var(--_level-2, 0) + 1);
  }

  [part='children'] ::slotted(*) {
    --_level-2: var(--_level);
  }

  @media (forced-colors: active) {
    [part='content'] {
      border: 1px solid Canvas !important;
    }

    :host([current]) [part='content'] {
      color: Highlight !important;
      border-color: Highlight !important;
    }

    :host([disabled]) [part='content'] {
      --vaadin-side-nav-item-text-color: GrayText !important;
    }

    :host([disabled]) [part='toggle-button']::before {
      background: GrayText !important;
    }
  }
`;

export const sideNavItemStyles = [sharedStyles, screenReaderOnly, sideNavItem];
