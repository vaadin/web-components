/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-size: 30rem;
    --_master-extra: 0px;
    --_detail-size: var(--_detail-cached-size);
    --_detail-extra: 0px;
    --_detail-cached-size: min-content;

    --_transition-duration: 0s;
    --_transition-easing: cubic-bezier(0.78, 0, 0.22, 1);
    --_rtl-multiplier: 1;
    --_detail-offscreen: calc(30px * var(--_rtl-multiplier));

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: clip;
    grid-template-columns:
      [master-start] var(--_master-size) var(--_master-extra)
      [detail-start] var(--_detail-size) var(--_detail-extra)
      [detail-end];
    grid-template-rows: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([dir='rtl']) {
    --_rtl-multiplier: -1;
  }

  :host([orientation='vertical']) {
    --_detail-offscreen: 0 30px;

    grid-template-columns: 100%;
    grid-template-rows:
      [master-start] var(--_master-size) var(--_master-extra)
      [detail-start] var(--_detail-size) var(--_detail-extra)
      [detail-end];
  }

  :is(#master, #detail, #detail-placeholder, #outgoing) {
    box-sizing: border-box;
  }

  #detail-placeholder {
    display: none;
  }

  :host([has-detail-placeholder]:not([has-detail], [overlay])) #detail-placeholder {
    display: block;
  }

  #master {
    grid-column: master-start / detail-start;
    grid-row: 1;
  }

  :is(#detail, #detail-placeholder, #outgoing) {
    grid-column: detail-start / detail-end;
    grid-row: 1;
  }

  :host([orientation='vertical']) #master {
    grid-column: 1;
    grid-row: master-start / detail-start;
  }

  :host([orientation='vertical']) :is(#detail, #detail-placeholder, #outgoing) {
    grid-column: 1;
    grid-row: detail-start / detail-end;
  }

  #backdrop {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  :host([expand='both']),
  :host([expand='master']) {
    --_master-extra: 1fr;
  }

  :host(:not([has-detail], [has-detail-placeholder])),
  :host([has-detail-placeholder][overlay]),
  :host([keep-detail-column-offscreen]),
  :host([keep-detail-column-offscreen][recalculating-detail-size]) {
    --_master-extra: calc(100% - var(--_master-size));
  }

  :host([expand='both']:is([has-detail], [has-detail-placeholder])),
  :host([expand='detail']:is([has-detail], [has-detail-placeholder])) {
    --_detail-extra: 1fr;
  }

  :host([recalculating-detail-size]:is([has-detail], [has-detail-placeholder])) {
    --_master-extra: 0px;
    --_detail-extra: 0px;
  }

  :host([orientation='horizontal']) #detail-placeholder,
  :host([orientation='horizontal']:not([overlay])) #detail {
    border-inline-start: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical']) #detail-placeholder,
  :host([orientation='vertical']:not([overlay])) #detail {
    border-top: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  /* Detail transition: off-screen by default, on-screen when has-detail */
  #detail {
    translate: var(--_detail-offscreen);
    visibility: hidden;
  }

  :host([has-detail]) #detail {
    translate: none;
    visibility: visible;
  }

  #outgoing:not([hidden]) {
    z-index: 1;
  }

  :host([overlay]) {
    --_detail-offscreen: calc((100% + 30px) * var(--_rtl-multiplier));
  }

  :host([overlay][orientation='vertical']) {
    --_detail-offscreen: 0 calc(100% + 30px);
  }

  :host([has-detail][overlay]) :is(#detail, #outgoing) {
    position: absolute;
    z-index: 2;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
    grid-column: none;
    grid-row: none;
  }

  :host([has-detail][overlay]) #backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  :host([has-detail][overlay]:not([orientation='vertical'])) :is(#detail, #outgoing) {
    inset-block: 0;
    inset-inline-end: 0;
    width: var(--_overlay-size, var(--_detail-size));
    max-width: 100%;
  }

  :host([has-detail][overlay][orientation='vertical']) :is(#detail, #outgoing) {
    inset-inline: 0;
    inset-block-end: 0;
    height: var(--_overlay-size, var(--_detail-size));
    max-height: 100%;
  }

  :host([has-detail][overlay][overlay-containment='viewport']) :is(#detail, #outgoing, #backdrop) {
    position: fixed;
  }

  @media (forced-colors: active) {
    :host([has-detail][overlay]) :is(#detail, #outgoing) {
      outline: 3px solid !important;
    }

    :is(#detail, #detail-placeholder, #outgoing) {
      background: Canvas !important;
    }
  }

  /* Enable transitions when motion is allowed */
  @media (prefers-reduced-motion: no-preference) {
    :host(:not([no-animation], [transition='replace'])) {
      --_transition-duration: 200ms;
    }

    :host([overlay]:not([no-animation])) {
      --_transition-duration: 300ms;
    }
  }
`;
