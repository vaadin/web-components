/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const gridStyles = css`
  @keyframes vaadin-grid-appear {
    to {
      opacity: 1;
    }
  }

  :host {
    position: relative;
    display: flex;
    height: 400px;
    min-height: var(--_grid-min-height, 0);
    flex: 1 1 auto;
    flex-direction: column;
    align-self: stretch;
    animation: 1ms vaadin-grid-appear;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  #scroller {
    position: absolute;
    display: flex;
    width: auto;
    height: auto;
    min-height: 100%;
    flex-direction: column;
    inset: 0;
    transform: translateY(0);
  }

  :host([all-rows-visible]) {
    width: 100%;
    height: auto;
    min-height: auto;
    flex-grow: 0;
    align-self: flex-start;
  }

  :host([all-rows-visible]) #scroller {
    position: relative;
    width: 100%;
    height: 100%;
  }

  :host([all-rows-visible]) #items {
    min-height: 1px;
  }

  #table {
    position: relative;
    /* Workaround for a Desktop Safari bug: new stacking context here prevents the scrollbar from getting hidden */
    z-index: 0;
    display: flex;
    overflow: auto;
    width: 100%;
    height: 100%;
    flex-direction: column;
    outline: none;
  }

  #header,
  #footer {
    position: -webkit-sticky;
    position: sticky;
    z-index: 1;
    left: 0;
    display: block;
    overflow: visible;
    width: 100%;
  }

  #header {
    top: 0;
  }

  th {
    text-align: inherit;
  }

  /* Safari doesn't work with "inherit" */
  [safari] th {
    text-align: initial;
  }

  #footer {
    bottom: 0;
  }

  #items {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    display: block;
    overflow: visible;
    width: 100%;
    flex-grow: 1;
    flex-shrink: 0;
  }

  [part~='row'] {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
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

  [part~='cell']:not([part~='details-cell']) {
    position: relative;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    flex-grow: 1;
    flex-shrink: 0;
    align-items: center;
    padding: 0;
    white-space: nowrap;
  }

  [part~='cell'] {
    outline: none;
  }

  [part~='cell'] > [tabindex] {
    position: absolute;
    display: flex;
    align-items: inherit;
    inset: 0;
    outline: none;
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
    box-sizing: border-box;
    padding: 0;
  }

  [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    display: block;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }

  [hidden] {
    display: none !important;
  }

  [frozen],
  [frozen-to-end] {
    z-index: 2;
    will-change: transform;
  }

  [no-scrollbars][safari] #table,
  [no-scrollbars][firefox] #table {
    overflow: hidden;
  }

  /* Empty state */

  #scroller:not([empty-state]) #emptystatebody,
  #scroller[empty-state] #items {
    display: none;
  }

  #emptystatebody {
    position: sticky;
    display: flex;
    overflow: hidden;
    flex: 1;
    inset: 0;
  }

  #emptystaterow {
    display: flex;
    flex: 1;
  }

  #emptystatecell {
    display: block;
    overflow: auto;
    flex: 1;
  }

  /* Reordering styles */
  :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
  :host([reordering]) [part~='resize-handle'],
  #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    pointer-events: none;
  }

  [part~='reorder-ghost'] {
    position: fixed;

    /* Prevent overflowing the grid in Firefox */
    top: 0;
    left: 0;
    opacity: 0.5;
    pointer-events: none;
    visibility: hidden;
  }

  :host([reordering]) {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Resizing styles */
  [part~='resize-handle'] {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    height: 100%;
    cursor: col-resize;
  }

  [part~='resize-handle']::before {
    position: absolute;
    width: 35px;
    height: 100%;
    content: '';
    transform: translateX(-50%);
  }

  [last-column] [part~='resize-handle']::before,
  [last-frozen] [part~='resize-handle']::before {
    right: 0;
    width: 18px;
    transform: none;
  }

  [frozen-to-end] [part~='resize-handle'] {
    right: auto;
    left: 0;
  }

  [frozen-to-end] [part~='resize-handle']::before {
    right: auto;
    left: 0;
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

  #scroller[column-resizing],
  #scroller[range-selecting] {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Sizer styles */
  #sizer {
    position: absolute;
    display: flex;
    visibility: hidden;
  }

  #sizer [part~='details-cell'] {
    display: none !important;
  }

  #sizer [part~='cell'][hidden] {
    display: none !important;
  }

  #sizer [part~='cell'] {
    display: block;
    height: 0 !important;
    min-height: 0 !important;
    max-height: 0 !important;
    flex-shrink: 0;
    padding: 0 !important;
    border: none !important;
    line-height: 0;
  }

  #sizer [part~='cell']::before {
    content: '-';
  }

  #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    display: none !important;
  }

  /* RTL specific styles */

  :host([dir='rtl']) #items,
  :host([dir='rtl']) #header,
  :host([dir='rtl']) #footer {
    left: auto;
  }

  :host([dir='rtl']) [part~='reorder-ghost'] {
    right: 0;
    left: auto;
  }

  :host([dir='rtl']) [part~='resize-handle'] {
    right: auto;
    left: 0;
  }

  :host([dir='rtl']) [part~='resize-handle']::before {
    transform: translateX(50%);
  }

  :host([dir='rtl']) [last-column] [part~='resize-handle']::before,
  :host([dir='rtl']) [last-frozen] [part~='resize-handle']::before {
    right: auto;
    left: 0;
  }

  :host([dir='rtl']) [frozen-to-end] [part~='resize-handle'] {
    right: 0;
    left: auto;
  }

  :host([dir='rtl']) [frozen-to-end] [part~='resize-handle']::before {
    right: 0;
    left: auto;
  }

  @media (forced-colors: active) {
    [part~='selected-row'] [part~='first-column-cell']::after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      border: 2px solid;
      content: '';
    }

    [part~='focused-cell']::before {
      outline: 2px solid !important;
      outline-offset: -1px;
    }
  }
`;
