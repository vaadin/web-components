/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const appLayoutStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    height: 100%;
    --vaadin-app-layout-transition: 200ms;
    transition: padding var(--vaadin-app-layout-transition);
    --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, 16em);
    --vaadin-app-layout-touch-optimized: false;
    --vaadin-app-layout-navbar-offset-top: var(--_vaadin-app-layout-navbar-offset-size);
    --vaadin-app-layout-navbar-offset-bottom: var(--_vaadin-app-layout-navbar-offset-size-bottom);
    padding-block: var(--vaadin-app-layout-navbar-offset-top) var(--vaadin-app-layout-navbar-offset-bottom);
    padding-inline-start: var(--vaadin-app-layout-navbar-offset-left);
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  :host([no-anim]) {
    --vaadin-app-layout-transition: none !important;
  }

  :host([drawer-opened]) {
    --vaadin-app-layout-drawer-offset-left: var(--_vaadin-app-layout-drawer-offset-size);
  }

  :host([overlay]) {
    --vaadin-app-layout-drawer-offset-left: 0;
    --vaadin-app-layout-navbar-offset-left: 0;
  }

  :host(:not([no-scroll])) [content] {
    overflow: auto;
  }

  [content] {
    height: 100%;
  }

  @media (pointer: coarse) and (max-width: 800px) and (min-height: 500px) {
    :host {
      --vaadin-app-layout-touch-optimized: true;
    }
  }

  [part='navbar'] {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    inset-inline: 0;
    transition: inset-inline-start var(--vaadin-app-layout-transition);
    padding-top: var(--safe-area-inset-top);
    padding-left: var(--safe-area-inset-left);
    padding-right: var(--safe-area-inset-right);
    z-index: 1;
  }

  :host([primary-section='drawer'][drawer-opened]:not([overlay])) [part='navbar'] {
    inset-inline-start: var(--vaadin-app-layout-drawer-offset-left, 0);
  }

  :host([primary-section='drawer']) [part='drawer'] {
    top: 0;
  }

  [part='navbar'][bottom] {
    top: auto;
    bottom: 0;
    padding-bottom: var(--safe-area-inset-bottom);
  }

  [part='drawer'] {
    overflow: auto;
    position: fixed;
    top: var(--vaadin-app-layout-navbar-offset-top, 0);
    bottom: var(--vaadin-app-layout-navbar-offset-bottom, var(--vaadin-viewport-offset-bottom, 0));
    inset-inline: var(--vaadin-app-layout-navbar-offset-left, 0) auto;
    transition:
      transform var(--vaadin-app-layout-transition),
      visibility var(--vaadin-app-layout-transition);
    transform: translateX(-100%);
    max-width: 90%;
    width: var(--_vaadin-app-layout-drawer-width);
    box-sizing: border-box;
    padding: var(--safe-area-inset-top) 0 var(--safe-area-inset-bottom) var(--safe-area-inset-left);
    outline: none;
    /* The drawer should be inaccessible by the tabbing navigation when it is closed. */
    visibility: hidden;
    display: flex;
    flex-direction: column;
  }

  :host([drawer-opened]) [part='drawer'] {
    /* The drawer should be accessible by the tabbing navigation when it is opened. */
    visibility: visible;
    transform: translateX(0%);
    touch-action: manipulation;
  }

  [part='backdrop'] {
    background-color: #000;
    opacity: 0.3;
  }

  :host(:not([drawer-opened])) [part='backdrop'] {
    opacity: 0;
  }

  :host([overlay]) [part='backdrop'] {
    position: fixed;
    inset: 0;
    pointer-events: none;
    transition: opacity var(--vaadin-app-layout-transition);
    -webkit-tap-highlight-color: transparent;
  }

  :host([overlay]) [part='drawer'] {
    top: 0;
    bottom: 0;
  }

  :host([overlay]) [part='drawer'],
  :host([overlay]) [part='backdrop'] {
    z-index: 2;
  }

  :host([drawer-opened][overlay]) [part='backdrop'] {
    pointer-events: auto;
    touch-action: manipulation;
  }

  :host([dir='rtl']) [part='drawer'] {
    transform: translateX(100%);
  }

  :host([dir='rtl'][drawer-opened]) [part='drawer'] {
    transform: translateX(0%);
  }

  :host([drawer-opened]:not([overlay])) {
    padding-inline-start: var(--vaadin-app-layout-drawer-offset-left);
  }

  @media (max-width: 800px), (max-height: 600px) {
    :host {
      --vaadin-app-layout-drawer-overlay: true;
      --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, 20em);
    }
  }

  /* If a vaadin-scroller is used in the drawer, allow it to take all remaining space and contain scrolling */
  [part='drawer'] ::slotted(vaadin-scroller) {
    flex: 1;
    overscroll-behavior: contain;
  }
`;
