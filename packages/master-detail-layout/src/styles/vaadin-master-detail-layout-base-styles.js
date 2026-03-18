/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const masterDetailLayoutStyles = css`
  :host {
    --_master-size: 30em;
    --_detail-size: 15em;
    --_master-column: var(--_master-size) 0;
    --_detail-column: var(--_detail-size) 0;
    --_transition-duration: 0s;
    --_transition-easing: cubic-bezier(0.78, 0, 0.22, 1);
    --_rtl-multiplier: 1;
    --_detail-offscreen: calc((100% + 30px) * var(--_rtl-multiplier));

    display: grid;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    z-index: 0;
    overflow: hidden;
    grid-template-columns: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
    grid-template-rows: 100%;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([dir='rtl']) {
    --_rtl-multiplier: -1;
  }

  :host([orientation='vertical']) {
    --_detail-offscreen: 0 calc(100% + 30px);

    grid-template-columns: 100%;
    grid-template-rows: [master-start] var(--_master-column) [detail-start] var(--_detail-column) [detail-end];
  }

  :is(#master, #detail, #outgoing) {
    box-sizing: border-box;
  }

  #master {
    grid-column: master-start / detail-start;
  }

  :is(#detail, #outgoing) {
    grid-column: detail-start / detail-end;
  }

  :host([orientation='vertical']) #master {
    grid-column: auto;
    grid-row: master-start / detail-start;
  }

  :host([orientation='vertical']) :is(#detail, #outgoing) {
    grid-column: auto;
    grid-row: detail-start / detail-end;
  }

  [part~='backdrop'] {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: none;
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  :host([expand='both']),
  :host([expand='master']) {
    --_master-column: var(--_master-size) 1fr;
  }

  :host(:not([has-detail])),
  :host([keep-detail-column-offscreen]) {
    --_master-column: var(--_master-size) calc(100% - var(--_master-size));
  }

  :host([expand='both']),
  :host([expand='detail']) {
    --_detail-column: var(--_detail-size) 1fr;
  }

  :host([orientation='horizontal'][has-detail]:not([overflow])) #detail {
    border-inline-start: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  :host([orientation='vertical'][has-detail]:not([overflow])) #detail {
    border-top: var(--vaadin-master-detail-layout-border-width, 1px) solid
      var(--vaadin-master-detail-layout-border-color, var(--vaadin-border-color-secondary));
  }

  /* Detail transition: off-screen by default, on-screen when has-detail */
  #detail {
    translate: var(--_detail-offscreen);
  }

  :host([has-detail]) #detail {
    translate: none;
  }

  /* During replace, both detail elements must overlap in the same grid
     cell. Without explicit placement on the non-positioned axis, the
     second element is auto-placed into an implicit track. In split mode,
     the outgoing cross-fades out and needs an opaque background so
     transparent areas don't reveal the incoming prematurely. In overlay
     mode, the [overflow] rule already provides the background. */
  :host(:not([overflow])[transition='replace']) #outgoing {
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
  }

  :host(:not([orientation='vertical'])[transition='replace']) :is(#detail, #outgoing) {
    grid-row: 1 / -1;
  }

  :host([orientation='vertical'][transition='replace']) :is(#detail, #outgoing) {
    grid-column: 1 / -1;
  }

  #outgoing:not([hidden]) {
    z-index: 1;
  }

  :host([overflow]) :is(#detail, #outgoing) {
    position: absolute;
    z-index: 2;
    background: var(--vaadin-master-detail-layout-detail-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-master-detail-layout-detail-shadow, 0 0 20px 0 rgba(0, 0, 0, 0.3));
    grid-column: none;
  }

  :host([overflow]) [part~='backdrop'] {
    display: block;
  }

  :host([overflow]:not([orientation='vertical'])) :is(#detail, #outgoing) {
    inset-block: 0;
    width: var(--_overlay-size, var(--_detail-size, min-content));
    inset-inline-end: 0;
  }

  :host([overflow][orientation='vertical']) :is(#detail, #outgoing) {
    grid-column: auto;
    grid-row: none;
    inset-inline: 0;
    height: var(--_overlay-size, var(--_detail-size, min-content));
    inset-block-end: 0;
  }

  :host([overflow][overlay-containment='viewport']) :is(#detail, #outgoing),
  :host([overflow][overlay-containment='viewport']) [part~='backdrop'] {
    position: fixed;
  }

  @media (forced-colors: active) {
    :host([overflow]) :is(#detail, #outgoing) {
      outline: 3px solid !important;
    }

    :is(#detail, #outgoing) {
      background: Canvas !important;
    }
  }

  /* Enable transitions when motion is allowed */
  @media (prefers-reduced-motion: no-preference) {
    :host(:not([no-animation])) {
      --_transition-duration: 400ms;
    }
  }
`;
