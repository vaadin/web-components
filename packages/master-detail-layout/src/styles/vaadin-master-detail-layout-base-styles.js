/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  /* stylelint-disable no-duplicate-selectors */
  :host {
    --_rtl-multiplier: 1;
    --_transition-duration: 0s;
    --_transition-easing: cubic-bezier(0.78, 0, 0.22, 1);

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    overflow: clip;
  }

  :host:not([overlay-containment='page']) {
    z-index: 0;
  }

  :host([dir='rtl']) {
    --_rtl-multiplier: -1;
  }

  :host([orientation='horizontal']) {
    --_transition-offset: calc(30px * var(--_rtl-multiplier));
  }

  :host([orientation='vertical']) {
    --_transition-offset: 0 30px;
  }

  :host([hidden]),
  ::slotted([hidden]) {
    display: none !important;
  }

  /* CSS grid template */

  :host {
    --_master-size: min(100%, 30rem);
    --_master-extra: 0px;
    --_detail-size: var(--_detail-cached-size);
    --_detail-extra: 0px;
    --_detail-cached-size: min-content;
  }

  :host([orientation='horizontal']) {
    grid-template-columns:
      [master-start] var(--_master-size) [master-extra-start] var(--_master-extra)
      [detail-start] var(--_detail-size) [detail-extra-start] var(--_detail-extra) [detail-end];
    grid-template-rows: 100%;
  }

  :host([orientation='vertical']) {
    grid-template-columns: 100%;
    grid-template-rows:
      [master-start] var(--_master-size) [master-extra-start] var(--_master-extra)
      [detail-start] var(--_detail-size) [detail-extra-start] var(--_detail-extra) [detail-end];
  }

  /* CSS grid placement */

  :host {
    --_master-area: master-start / detail-start;

    /*
      When the detail size isn't explicitly defined and the detail is set to expand,
      the detail column template is 'min-content 1fr'. In this case, the detail area
      should not span both columns initially (and when recalculating the detail size)
      as spanning both would effectively collapse them into a single '1fr' column where
      min-content resolves to 0, making it impossible to measure the detail's intrinsic
      minimum width from JavaScript.
    */
    --_detail-area: detail-start / detail-extra-start;
  }

  :host(:is([has-detail], [has-detail-placeholder]):not([recalculating-detail-size])) {
    --_detail-area: detail-start / detail-end;
  }

  :host([orientation='horizontal']) #master {
    grid-column: var(--_master-area);
    grid-row: 1;
  }

  :host([orientation='vertical']) #master {
    grid-column: 1;
    grid-row: var(--_master-area);
  }

  :host([orientation='horizontal']) :is(#detail, #detailPlaceholder, #detailOutgoing) {
    grid-column: var(--_detail-area);
    grid-row: 1;
  }

  :host([orientation='vertical']) :is(#detail, #detailPlaceholder, #detailOutgoing) {
    grid-column: 1;
    grid-row: var(--_detail-area);
  }

  /* Expand */

  :host([expand-master]) {
    --_master-extra: 1fr;
  }

  :host([expand-detail]) {
    --_detail-extra: 1fr;
  }

  :host([keep-detail-column-offscreen]),
  :host([has-detail-placeholder][overlay]:not([has-detail])),
  :host(:not([has-detail-placeholder], [has-detail])) {
    --_master-extra: calc(100% - var(--_master-size));
  }

  /* Backdrop base styles */

  #backdrop {
    --_transition-easing: linear;

    position: absolute;
    inset: 0;
    z-index: 2;
    opacity: 0;
    pointer-events: none;
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  /* Master base styles */

  #master {
    opacity: 0;
    pointer-events: none;
    box-sizing: border-box;
  }

  :host([has-master]) #master {
    opacity: 1;
    pointer-events: auto;
  }

  /* Detail base styles */

  #detail {
    translate: var(--_transition-offset);
    opacity: 0;
    z-index: 4;
  }

  :host([has-detail]) #detail {
    translate: none;
    opacity: 1;
  }

  #detailOutgoing {
    position: absolute;
    z-index: 3;
    display: none;
  }

  :host([transition='replace']) #detailOutgoing {
    display: block;
  }

  #detailPlaceholder {
    z-index: 1;
    opacity: 0;
    pointer-events: none;
  }

  :host([has-detail-placeholder]:not([has-detail], [overlay])) #detailPlaceholder {
    opacity: 1;
    pointer-events: auto;
  }

  :is(#detail, #detailPlaceholder, #detailOutgoing) {
    box-sizing: border-box;
  }

  /* Detail borders */

  #detail,
  #detailPlaceholder {
    border-color: var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
    border-width: var(--vaadin-master-detail-layout-border-width, 1px);
  }

  :host([orientation='horizontal']) #detailPlaceholder,
  :host([orientation='horizontal']:not([overlay])) #detail {
    border-inline-start-style: solid;
  }

  :host([orientation='vertical']) #detailPlaceholder,
  :host([orientation='vertical']:not([overlay])) #detail {
    border-block-start-style: solid;
  }

  /* Overlay */

  :host([overlay][orientation='horizontal']) {
    --_transition-offset: calc((100% + 30px) * var(--_rtl-multiplier));
  }

  :host([overlay][orientation='vertical']) {
    --_transition-offset: 0 calc(100% + 30px);
  }

  :host([has-detail][overlay]) #backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  :host([has-detail][overlay]) :is(#detail, #detailOutgoing) {
    position: absolute;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
    grid-column: none;
    grid-row: none;
  }

  :host([has-detail][overlay][orientation='horizontal']) :is(#detail, #detailOutgoing) {
    inset-block: 0;
    inset-inline-end: 0;
    width: var(--_overlay-size, var(--_detail-size));
    max-width: 100%;
  }

  :host([has-detail][overlay][orientation='vertical']) :is(#detail, #detailOutgoing) {
    inset-inline: 0;
    inset-block-end: 0;
    height: var(--_overlay-size, var(--_detail-size));
    max-height: 100%;
  }

  :host([has-detail][overlay][overlay-containment='page']) :is(#detail, #detailOutgoing, #backdrop) {
    position: fixed;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-right: env(safe-area-inset-right);
    --safe-area-inset-top: 0px;
    --safe-area-inset-bottom: 0px;
    --safe-area-inset-left: 0px;
    --safe-area-inset-right: 0px;
    --safe-area-inset-inline-start: 0px;
    --safe-area-inset-inline-end: 0px;
  }

  :host([dir='rtl'][has-detail][overlay][overlay-containment='page']) :is(#detail, #detailOutgoing, #backdrop) {
    padding-right: 0;
    padding-left: env(safe-area-inset-left);
  }

  /* Transitions */

  @media (prefers-reduced-motion: no-preference) {
    :host(:not([no-animation], [transition='replace'])) {
      --_transition-duration: 200ms;
    }

    :host([overlay]:not([no-animation])) {
      --_transition-duration: 300ms;
    }
  }

  /* Forced colors */

  @media (forced-colors: active) {
    :host([has-detail][overlay]) :is(#detail, #detailOutgoing) {
      outline: 3px solid !important;
    }

    :is(#detail, #detailPlaceholder, #detailOutgoing) {
      background: Canvas !important;
    }
  }
`;
