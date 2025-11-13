/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const appLayoutStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    height: 100%;
    --vaadin-app-layout-transition-duration: 0s;
    transition: padding var(--vaadin-app-layout-transition-duration);
    --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, auto);
    --vaadin-app-layout-touch-optimized: false;
    --vaadin-app-layout-navbar-offset-top: var(--_vaadin-app-layout-navbar-offset-size);
    --vaadin-app-layout-navbar-offset-bottom: var(--_vaadin-app-layout-navbar-offset-size-bottom);
    padding-top: max(var(--vaadin-app-layout-navbar-offset-top), var(--safe-area-inset-top));
    padding-bottom: max(var(--vaadin-app-layout-navbar-offset-bottom), var(--safe-area-inset-bottom));
  }

  :host(:dir(ltr)) [content] {
    padding-left: max(var(--vaadin-app-layout-drawer-offset-left), var(--safe-area-inset-left));
    padding-right: var(--safe-area-inset-right);
  }

  :host(:dir(rtl)) [content] {
    padding-left: var(--safe-area-inset-left);
    padding-right: max(var(--vaadin-app-layout-drawer-offset-left), var(--safe-area-inset-right));
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  @media (prefers-reduced-motion: no-preference) {
    :host(:not([no-anim])) {
      --vaadin-app-layout-transition-duration: 200ms;
    }
  }

  :host([drawer-opened]) {
    --vaadin-app-layout-drawer-offset-left: var(--_vaadin-app-layout-drawer-offset-size);
  }

  :host([overlay]) {
    --vaadin-app-layout-drawer-offset-left: 0px;
  }

  :host(:not([no-scroll])) [content] {
    overflow: auto;
  }

  [content] {
    height: 100%;
    transition: inherit;
  }

  @media (pointer: coarse) and (max-width: 800px) and (min-height: 500px) {
    :host {
      --vaadin-app-layout-touch-optimized: true;
    }
  }

  [part~='navbar'] {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    inset-inline: 0;
    transition: inset-inline-start var(--vaadin-app-layout-transition-duration);
    padding-top: max(var(--vaadin-app-layout-navbar-padding-top, var(--vaadin-padding-s)), var(--safe-area-inset-top));
    padding-bottom: var(--vaadin-app-layout-navbar-padding-bottom, var(--vaadin-padding-s));
    padding-inline-start: max(
      var(--vaadin-app-layout-navbar-padding-inline-start, var(--vaadin-padding-s)),
      var(--safe-area-inset-left)
    );
    /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
    padding-inline-end: max(
      var(--vaadin-app-layout-navbar-padding-inline-end, var(--vaadin-padding-s)),
      var(--safe-area-inset-right)
    );
    z-index: 1;
    gap: var(--vaadin-app-layout-navbar-gap, var(--vaadin-gap-s));
    background: var(--vaadin-app-layout-navbar-background, var(--vaadin-background-container));
  }

  :host([primary-section='drawer'][drawer-opened]:not([overlay])) [part~='navbar'] {
    inset-inline-start: var(--vaadin-app-layout-drawer-offset-left, 0);
  }

  :host([primary-section='drawer']) [part='drawer'] {
    top: 0;
  }

  [part~='navbar-bottom'] {
    top: auto;
    bottom: 0;
    padding-top: var(--vaadin-app-layout-navbar-padding-top, var(--vaadin-padding-s));
    padding-bottom: max(
      var(--vaadin-app-layout-navbar-padding-bottom, var(--vaadin-padding-s)),
      var(--safe-area-inset-bottom)
    );
  }

  [part='drawer'] {
    overflow: auto;
    overscroll-behavior: contain;
    position: fixed;
    top: var(--vaadin-app-layout-navbar-offset-top, 0);
    bottom: var(--vaadin-app-layout-navbar-offset-bottom, var(--vaadin-viewport-offset-bottom, 0));
    inset-inline: var(--vaadin-app-layout-navbar-offset-left, 0) auto;
    transition:
      transform var(--vaadin-app-layout-transition-duration),
      visibility var(--vaadin-app-layout-transition-duration);
    transform: translateX(-100%);
    max-width: 90%;
    width: var(--_vaadin-app-layout-drawer-width);
    box-sizing: border-box;
    padding-block: var(--safe-area-inset-top) var(--safe-area-inset-bottom);
    outline: none;
    /* The drawer should be inaccessible by the tabbing navigation when it is closed. */
    visibility: hidden;
    display: flex;
    flex-direction: column;
    background: var(--vaadin-app-layout-drawer-background, transparent);
  }

  [part='drawer']:dir(ltr) {
    padding-left: var(--safe-area-inset-left);
  }

  [part='drawer']:dir(rtl) {
    padding-right: var(--safe-area-inset-right);
  }

  :host([has-navbar]:not([overlay])) [part='drawer'],
  :host([has-navbar]) [content] {
    --safe-area-inset-top: 0px;
  }

  :host([has-drawer]:not([overlay])[drawer-opened]) [content] {
    &:dir(ltr) {
      --safe-area-inset-left: 0px;
    }

    &:dir(rtl) {
      --safe-area-inset-right: 0px;
    }
  }

  :host([drawer-opened]) [part='drawer'] {
    /* The drawer should be accessible by the tabbing navigation when it is opened. */
    visibility: visible;
    transform: translateX(0%);
    touch-action: manipulation;
  }

  [part='backdrop'] {
    background: var(--vaadin-overlay-backdrop-background, rgba(0, 0, 0, 0.2));
    forced-color-adjust: none;
  }

  :host(:not([drawer-opened])) [part='backdrop'] {
    opacity: 0 !important;
  }

  :host([overlay]) [part='backdrop'] {
    position: fixed;
    inset: 0;
    pointer-events: none;
    transition: opacity var(--vaadin-app-layout-transition-duration);
    -webkit-tap-highlight-color: transparent;
  }

  :host([overlay]) [part='drawer'] {
    top: 0;
    bottom: 0;
    box-shadow: var(--vaadin-overlay-shadow, 0 8px 24px -4px rgba(0, 0, 0, 0.3));
    background: var(--vaadin-app-layout-drawer-background, var(--vaadin-background-color));
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

  @media (max-width: 800px), (max-height: 600px) {
    :host {
      --vaadin-app-layout-drawer-overlay: true;
      --_vaadin-app-layout-drawer-width: var(--vaadin-app-layout-drawer-width, 320px);
    }
  }

  /* If a vaadin-scroller is used in the drawer, allow it to take all remaining space and contain scrolling */
  [part='drawer'] ::slotted(vaadin-scroller) {
    flex: 1;
    overscroll-behavior: contain;
  }

  @media (forced-colors: active) {
    :host([overlay]) [part='drawer'] {
      border: 3px solid;
    }
  }
`;
