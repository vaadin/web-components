/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const tabsStyles = css`
  @layer base {
    :host {
      display: flex;
      max-width: 100%;
      max-height: 100%;
      position: relative;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([orientation='vertical']) {
      flex-direction: column;
    }

    [part='tabs'] {
      flex: 1;
      overflow: auto;
      overscroll-behavior: contain;
      display: flex;
      flex-direction: column;
      gap: var(--vaadin-tabs-gap, var(--_vaadin-gap-container-inline));
    }

    :host([orientation='horizontal']) [part='tabs'] {
      flex-direction: row;
      scrollbar-width: none;
    }

    /* scrollbar-width is supported in Safari 18.2, use the following for earlier */
    :host([orientation='horizontal']) [part='tabs']::-webkit-scrollbar {
      display: none;
    }

    [part='back-button'],
    [part='forward-button'] {
      position: absolute;
      z-index: 1;
      pointer-events: none;
      opacity: 0;
      cursor: var(--vaadin-clickable-cursor);
      box-sizing: border-box;
      height: 100%;
      padding: var(--vaadin-tab-padding, var(--_vaadin-padding-container));
      background: var(--_vaadin-background);
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    [part='forward-button'] {
      inset-inline-end: 0;
    }

    :host([overflow~='start']) [part='back-button'],
    :host([overflow~='end']) [part='forward-button'] {
      pointer-events: auto;
      opacity: 1;
    }

    :is([part='back-button'], [part='forward-button'])::before {
      content: '';
      display: block;
      width: var(--vaadin-icon-size, 1lh);
      height: var(--vaadin-icon-size, 1lh);
      background: currentColor;
      mask-image: var(--_vaadin-icon-chevron-down);
      rotate: 90deg;
    }

    [part='forward-button']::before {
      rotate: -90deg;
    }

    :host(:is([orientation='vertical'], [theme~='hide-scroll-buttons']))
      :is([part='back-button'], [part='forward-button']) {
      display: none;
    }

    @media (pointer: coarse) {
      :host(:not([theme~='show-scroll-buttons'])) :is([part='back-button'], [part='forward-button']) {
        display: none;
      }
    }

    :host([dir='rtl']) :is([part='back-button'], [part='forward-button'])::before {
      scale: 1 -1;
    }

    @media (forced-colors: active) {
      :is([part='back-button'], [part='forward-button'])::before {
        background: CanvasText;
      }
    }
  }
`;
