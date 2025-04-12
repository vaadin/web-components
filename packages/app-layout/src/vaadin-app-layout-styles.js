/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const appLayoutStyles = css`
  :host {
    --vaadin-app-layout-transition: 200ms;
    --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, 16em);
    --vaadin-app-layout-touch-optimized: false;
    --vaadin-app-layout-navbar-offset-top: var(--_vaadin-app-layout-navbar-offset-size);
    --vaadin-app-layout-navbar-offset-bottom: var(--_vaadin-app-layout-navbar-offset-size-bottom);
    display: block;
    height: 100%;
    box-sizing: border-box;
    padding-block: var(--vaadin-app-layout-navbar-offset-top) var(--vaadin-app-layout-navbar-offset-bottom);
    padding-inline-start: var(--vaadin-app-layout-navbar-offset-left);
    transition: padding var(--vaadin-app-layout-transition);
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
    z-index: 1;
    top: 0;
    display: flex;
    align-items: center;
    padding-top: var(--safe-area-inset-top);
    padding-right: var(--safe-area-inset-right);
    padding-left: var(--safe-area-inset-left);
    inset-inline: 0;
    transition: inset-inline-start var(--vaadin-app-layout-transition);
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
    position: fixed;
    top: var(--vaadin-app-layout-navbar-offset-top, 0);
    bottom: var(--vaadin-app-layout-navbar-offset-bottom, var(--vaadin-viewport-offset-bottom, 0));
    display: flex;
    overflow: auto;
    width: var(--_vaadin-app-layout-drawer-width);
    max-width: 90%;
    box-sizing: border-box;
    flex-direction: column;
    padding: var(--safe-area-inset-top) 0 var(--safe-area-inset-bottom) var(--safe-area-inset-left);
    inset-inline: var(--vaadin-app-layout-navbar-offset-left, 0) auto;
    outline: none;
    transform: translateX(-100%);
    transition:
      transform var(--vaadin-app-layout-transition),
      visibility var(--vaadin-app-layout-transition);
    /* The drawer should be inaccessible by the tabbing navigation when it is closed. */
    visibility: hidden;
  }

  :host([drawer-opened]) [part='drawer'] {
    touch-action: manipulation;
    transform: translateX(0%);
    /* The drawer should be accessible by the tabbing navigation when it is opened. */
    visibility: visible;
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
    -webkit-tap-highlight-color: transparent;
    transition: opacity var(--vaadin-app-layout-transition);
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
