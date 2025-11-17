/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const avatarGroupStyles = css`
  :host {
    display: block;
    width: 100%; /* prevent collapsing inside non-stretching column flex */
    /* 1: last on top */
    /* -1: first on top */
    --_dir: 1;
  }

  :host([theme~='reverse']) {
    --_dir: -1;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='container'] {
    display: flex;
    position: relative;
    width: 100%;
    flex-wrap: nowrap;
  }

  ::slotted(vaadin-avatar) {
    --_overlap: max(0px, var(--vaadin-avatar-group-overlap, 8px));
    --_gap: max(0px, var(--vaadin-avatar-group-gap, 2px));
    --_outline-width: var(--vaadin-focus-ring-width);
    --_d: var(--_dir);
    mask-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M300 0H0V300H300V0ZM150 200C177.614 200 200 177.614 200 150C200 122.386 177.614 100 150 100C122.386 100 100 122.386 100 150C100 177.614 122.386 200 150 200Z" fill="black"/></svg>');
    mask-size: calc((100% - var(--_outline-width) * 2) * 3);
    mask-position: calc(50% + (100% - var(--_outline-width) * 2 - var(--_overlap)) * var(--_d));
  }

  :host(:dir(rtl)) ::slotted(vaadin-avatar) {
    --_d: calc(var(--_dir) * -1);
  }

  ::slotted(vaadin-avatar:not(:first-of-type)) {
    margin-inline-start: calc((var(--_outline-width) + var(--_overlap) - var(--_gap)) * -1);
  }

  :host(:not([theme~='reverse'])) ::slotted(vaadin-avatar:last-child),
  :host(:not([theme~='reverse']):not([has-overflow])) ::slotted(vaadin-avatar:nth-last-child(2)),
  :host([theme~='reverse']) ::slotted(vaadin-avatar:first-of-type) {
    mask-image: none;
  }
`;
