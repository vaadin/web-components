/**
 * @license
 * Copyright (c) 2023 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
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
    gap: var(--vaadin-side-nav-item-gap, var(--vaadin-gap-container-inline));
    padding: var(--vaadin-side-nav-item-padding, var(--vaadin-padding-container));
    font-size: var(--vaadin-side-nav-label-font-size, 0.875em);
    font-weight: var(--vaadin-side-nav-label-font-weight, 500);
    color: var(--vaadin-side-nav-label-color, var(--vaadin-color-subtle));
    line-height: var(--vaadin-side-nav-label-line-height, inherit);
    border-radius: var(--vaadin-side-nav-item-border-radius, var(--vaadin-radius-m));
    touch-action: manipulation;
  }
`;

export const sideNavStyles = [sharedStyles, sideNav];

export const sideNavSlotStyles = css`
  :where(vaadin-side-nav:has(vaadin-icon[slot='prefix'])) {
    --_has-prefix-icon: '';
  }

  :where(vaadin-side-nav-item:has(> vaadin-icon[slot='prefix'])) ::part(link) {
    --_has-prefix-icon:;
  }
`;
