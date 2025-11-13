/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';
import { sharedStyles } from './vaadin-side-nav-shared-base-styles.js';

const sideNav = css`
  :host {
    white-space: nowrap;
    touch-action: manipulation;
  }

  [part='label'] {
    align-self: start;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: var(--vaadin-side-nav-item-gap, var(--vaadin-gap-s));
    padding: var(
      --vaadin-side-nav-item-padding,
      var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container)
    );
    font-size: var(--vaadin-side-nav-label-font-size, max(11px, 0.875em));
    font-weight: var(--vaadin-side-nav-label-font-weight, 500);
    color: var(--vaadin-side-nav-label-color, var(--vaadin-text-color-secondary));
    line-height: var(--vaadin-side-nav-label-line-height, inherit);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--vaadin-radius-m));
    touch-action: manipulation;
    min-width: 0;
    max-width: 100%;
  }

  ::slotted([slot='label']) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
`;

export const sideNavStyles = [sharedStyles, sideNav];

export const sideNavSlotStyles = css`
  :where(vaadin-side-nav:has(> vaadin-side-nav-item > vaadin-icon[slot='prefix']))::part(children),
  :where(vaadin-side-nav-item:has(> vaadin-side-nav-item[slot='children'] > vaadin-icon[slot='prefix']))::part(
    children
  ) {
    --_icon-indent: calc(var(--_icon-indent-2, 0) + 1);
  }

  :where(vaadin-side-nav-item:has(> vaadin-icon[slot='prefix']))::part(content) {
    --_icon-indent: calc(var(--_icon-indent-2) - 1);
  }

  :where(
    vaadin-side-nav-item:has(> vaadin-icon[slot='prefix']):has(> vaadin-side-nav-item > vaadin-icon[slot='prefix'])
  )::part(children) {
    --_level: var(--_level-2, 0);
  }

  vaadin-side-nav:not(:has([slot='label']))::part(label) {
    display: none;
  }
`;
