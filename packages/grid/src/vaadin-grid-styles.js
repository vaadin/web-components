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
    align-self: stretch;
    animation: 1ms vaadin-grid-appear;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    height: 400px;
    min-height: var(--_grid-min-height, 0);
    position: relative;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  #scroller {
    display: flex;
    flex-direction: column;
    height: auto;
    inset: 0;
    min-height: 100%;
    position: absolute;
    transform: translateY(0);
    width: auto;
  }

  :host([all-rows-visible]) {
    align-self: flex-start;
    flex-grow: 0;
    height: auto;
    min-height: auto;
    width: 100%;
  }

  :host([all-rows-visible]) #scroller {
    height: 100%;
    position: relative;
    width: 100%;
  }

  :host([all-rows-visible]) #items {
    min-height: 1px;
  }

  #table {
    display: flex;
    flex-direction: column;
    height: 100%;
    outline: none;
    overflow: auto;
    position: relative;
    width: 100%;
    /* Workaround for a Desktop Safari bug: new stacking context here prevents the scrollbar from getting hidden */
    z-index: 0;
  }

  #header,
  #footer {
    display: block;
    left: 0;
    overflow: visible;
    position: -webkit-sticky;
    position: sticky;
    width: 100%;
    z-index: 1;
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
    display: block;
    flex-grow: 1;
    flex-shrink: 0;
    left: 0;
    overflow: visible;
    position: -webkit-sticky;
    position: sticky;
    width: 100%;
  }

  [part~='row'] {
    box-sizing: border-box;
    display: flex;
    margin: 0;
    width: 100%;
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
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0;
    position: relative;
    white-space: nowrap;
    width: 100%;
  }

  [part~='cell'] {
    outline: none;
  }

  [part~='cell'] > [tabindex] {
    align-items: inherit;
    display: flex;
    inset: 0;
    outline: none;
    position: absolute;
  }

  /* Switch the focusButtonMode wrapping element to "position: static" temporarily
     when measuring real width of the cells in the auto-width columns. */
  [measuring-auto-width] [part~='cell'] > [tabindex] {
    position: static;
  }

  [part~='details-cell'] {
    bottom: 0;
    box-sizing: border-box;
    padding: 0;
    position: absolute;
    width: 100%;
  }

  [part~='cell'] ::slotted(vaadin-grid-cell-content) {
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  [hidden] {
    display: none !important;
  }

  [frozen],
  [frozen-to-end] {
    will-change: transform;
    z-index: 2;
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
    display: flex;
    flex: 1;
    inset: 0;
    overflow: hidden;
    position: sticky;
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
    left: 0;
    opacity: 0.5;
    pointer-events: none;
    position: fixed;

    /* Prevent overflowing the grid in Firefox */
    top: 0;
    visibility: hidden;
  }

  :host([reordering]) {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Resizing styles */
  [part~='resize-handle'] {
    cursor: col-resize;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }

  [part~='resize-handle']::before {
    content: '';
    height: 100%;
    position: absolute;
    transform: translateX(-50%);
    width: 35px;
  }

  [last-column] [part~='resize-handle']::before,
  [last-frozen] [part~='resize-handle']::before {
    right: 0;
    transform: none;
    width: 18px;
  }

  [frozen-to-end] [part~='resize-handle'] {
    left: 0;
    right: auto;
  }

  [frozen-to-end] [part~='resize-handle']::before {
    left: 0;
    right: auto;
  }

  [first-frozen-to-end] [part~='resize-handle']::before {
    transform: none;
    width: 18px;
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
    display: flex;
    position: absolute;
    visibility: hidden;
  }

  #sizer [part~='details-cell'] {
    display: none !important;
  }

  #sizer [part~='cell'][hidden] {
    display: none !important;
  }

  #sizer [part~='cell'] {
    border: none !important;
    display: block;
    flex-shrink: 0;
    height: 0 !important;
    line-height: 0;
    max-height: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
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
    left: auto;
    right: 0;
  }

  :host([dir='rtl']) [part~='resize-handle'] {
    left: 0;
    right: auto;
  }

  :host([dir='rtl']) [part~='resize-handle']::before {
    transform: translateX(50%);
  }

  :host([dir='rtl']) [last-column] [part~='resize-handle']::before,
  :host([dir='rtl']) [last-frozen] [part~='resize-handle']::before {
    left: 0;
    right: auto;
  }

  :host([dir='rtl']) [frozen-to-end] [part~='resize-handle'] {
    left: auto;
    right: 0;
  }

  :host([dir='rtl']) [frozen-to-end] [part~='resize-handle']::before {
    left: auto;
    right: 0;
  }

  @media (forced-colors: active) {
    [part~='selected-row'] [part~='first-column-cell']::after {
      border: 2px solid;
      bottom: 0;
      content: '';
      left: 0;
      position: absolute;
      top: 0;
    }

    [part~='focused-cell']::before {
      outline: 2px solid !important;
      outline-offset: -1px;
    }
  }
`;
