/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const gridStyles = css`
  @keyframes vaadin-grid-appear {
    to {
      opacity: 1;
    }
  }

  :host {
    display: flex;
    animation: 1ms vaadin-grid-appear;
    max-width: 100%;
    height: 400px;
    min-height: var(--_grid-min-height, 0);
    flex: 1 1 auto;
    align-self: stretch;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background: var(--vaadin-grid-background, var(--_vaadin-background));
    cursor: default;
    --_row-border-width: var(--vaadin-grid-cell-border-width, 1px);
    --_column-border-width: var(--vaadin-grid-cell-border-width, 0);
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.7;
  }

  /* Variant: No outer border */
  :host(:not([theme~='no-border'])) {
    border: var(--vaadin-grid-border-width, 1px) solid var(--vaadin-grid-border-color, var(--_vaadin-border-color));
    border-radius: var(--vaadin-grid-border-radius, var(--_vaadin-radius-l));
  }

  :host([all-rows-visible]) {
    height: auto;
    align-self: flex-start;
    min-height: auto;
    flex-grow: 0;
  }

  #scroller {
    contain: layout;
    border-radius: inherit;
    position: relative;
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 0;
    align-self: stretch;
  }

  #items {
    flex-grow: 1;
    flex-shrink: 0;
    display: block;
    position: sticky;
    width: 100%;
    left: 0;
    min-height: 1px;
  }

  #table {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    position: relative;
    border-radius: inherit;
    /* Workaround for a Chrome bug: new stacking context here prevents the scrollbar from getting hidden */
    z-index: 0;
  }

  [no-scrollbars]:is([safari], [firefox]) #table {
    overflow: hidden;
  }

  #header,
  #footer {
    display: block;
    position: sticky;
    left: 0;
    width: 100%;
    z-index: 1;
  }

  :host([dir='rtl']) #items,
  :host([dir='rtl']) #header,
  :host([dir='rtl']) #footer {
    left: auto;
  }

  #header {
    top: 0;
  }

  #footer {
    bottom: 0;
  }

  th {
    text-align: inherit;
  }

  #header th {
    font-size: var(--vaadin-grid-header-font-size, 1em);
    font-weight: var(--vaadin-grid-header-font-weight, 500);
    color: var(--vaadin-grid-header-color, var(--_vaadin-color-strong));
  }

  [part~='row'] {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    position: relative;
  }

  [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
    visibility: hidden;
  }

  [column-rendering='lazy'] [part~='body-cell']:not([frozen]):not([frozen-to-end]) {
    transform: translateX(var(--_grid-lazy-columns-start));
  }

  #items [part~='row'] {
    position: absolute;
  }

  #items [part~='row']:empty {
    height: 100%;
  }

  [part~='cell'] {
    box-sizing: border-box;
    background: var(--vaadin-grid-cell-background, var(--_vaadin-background));
    padding: 0;
  }

  [part~='cell']:not([part~='details-cell']) {
    flex-shrink: 0;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    white-space: nowrap;
  }

  :focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: calc(var(--vaadin-focus-ring-width) * -1);
  }

  [part~='row']:focus-visible::before {
    content: '';
    position: absolute;
    inset: 0;
    outline: inherit;
    outline-offset: inherit;
    z-index: 3;
    transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
  }

  /* Variant: row & column borders */

  :host([theme~='no-row-borders']) {
    --_row-border-width: 0;
  }

  :host([theme~='column-borders']) {
    --_column-border-width: var(--vaadin-grid-cell-border-width, 1px);
  }

  [part~='cell']:not([part~='last-column-cell']) {
    border-inline-end: var(--_column-border-width, 0) solid
      var(--vaadin-grid-cell-border-color, var(--_vaadin-border-color));
  }

  [part~='cell']:where(:not([part~='details-cell'], [part~='first-row-cell'])) {
    border-top: var(--_row-border-width) solid var(--vaadin-grid-cell-border-color, var(--_vaadin-border-color));
  }

  [part~='first-header-row-cell'] {
    border-top: 0;
  }

  [part~='last-header-row-cell'] {
    border-bottom: var(--_row-border-width, 1px) solid var(--vaadin-grid-cell-border-color, var(--_vaadin-border-color));
  }

  [part~='first-footer-row-cell'] {
    border-top: var(--_row-border-width, 1px) solid var(--vaadin-grid-cell-border-color, var(--_vaadin-border-color));
  }

  /* Variant: row stripes */
  :host([theme~='row-stripes']) [part~='odd-row'],
  :host([theme~='row-stripes']) [part~='odd-row'] [part~='body-cell'],
  :host([theme~='row-stripes']) [part~='odd-row'] [part~='details-cell'] {
    background: var(--vaadin-grid-alternate-cell-background, var(--_vaadin-background-container));
  }

  [part~='cell'] > [tabindex] {
    display: flex;
    align-items: inherit;
    width: 100%;
  }

  /* Switch the focusButtonMode wrapping element to "position: static" temporarily
     when measuring real width of the cells in the auto-width columns. */
  [measuring-auto-width] [part~='cell'] > [tabindex] {
    position: static;
  }

  [part~='details-cell'] {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: var(--vaadin-grid-cell-padding, var(--_vaadin-padding-container));
  }

  [frozen],
  [frozen-to-end] {
    z-index: 2;
    will-change: transform;
  }

  /* Empty state */

  #scroller:not([empty-state]) #emptystatebody,
  #scroller[empty-state] #items {
    display: none;
  }

  #emptystatebody {
    display: flex;
    position: sticky;
    inset: 0;
    flex: 1;
    overflow: hidden;
  }

  #emptystaterow {
    display: flex;
    flex: 1;
  }

  #emptystatecell {
    display: block;
    flex: 1;
    overflow: auto;
  }

  /* Reordering styles */
  :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
  :host([reordering]) [part~='resize-handle'],
  #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    pointer-events: none;
  }

  [part~='reorder-ghost'] {
    visibility: hidden;
    position: fixed;
    pointer-events: none;
    opacity: 0.5;

    /* Prevent overflowing the grid in Firefox */
    top: 0;
    inset-inline-start: 0;
  }

  :host([reordering]) {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Resizing styles */
  [part~='resize-handle'] {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    height: 100%;
    cursor: col-resize;
    z-index: 1;
  }

  [part~='resize-handle']::before {
    position: absolute;
    content: '';
    height: 100%;
    width: 36px;
    transform: translateX(-50%);
  }

  :host([dir='rtl']) [part~='resize-handle']::before {
    transform: translateX(50%);
  }

  :is([last-column], [last-frozen]) [part~='resize-handle']::before {
    width: 18px;
    transform: none;
    inset-inline-end: 0;
  }

  [frozen-to-end] :is([part~='resize-handle'], [part~='resize-handle']::before) {
    inset-inline: 0 auto;
  }

  [first-frozen-to-end] [part~='resize-handle']::before {
    width: 18px;
    transform: none;
  }

  [first-frozen-to-end] {
    margin-inline-start: auto;
  }

  /* Hide resize handle if scrolled to end */
  :host(:not([overflow~='end'])) [first-frozen-to-end] [part~='resize-handle'] {
    display: none;
  }

  #scroller:is([column-resizing], [range-selecting]) {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Sizer styles */
  #sizer {
    display: flex;
    visibility: hidden;
  }

  #sizer [part~='details-cell'],
  #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    display: none !important;
  }

  #sizer [part~='cell'] {
    display: block;
    flex-shrink: 0;
    line-height: 0;
    height: 0 !important;
    min-height: 0 !important;
    max-height: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  #sizer [part~='cell']::before {
    content: '-';
  }
`;
