/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-map',
  css`
    :host {
      font-family: var(--material-font-family);
      font-size: var(--material-body-font-size);
    }

    :host(:not([theme~='borderless'])) {
      border: 1px solid var(--material-divider-color);
      border-radius: 4px;
    }

    :host([focus-ring]) {
      box-shadow: 0 0 0 2px var(--material-primary-color);
    }

    .ol-control {
      border-radius: 4px;
      box-shadow: var(--material-shadow-elevation-2dp);
      transition: 0.1s box-shadow;
    }

    .ol-control:hover {
      background-color: var(--material-background-color);
    }

    .ol-control:not(.ol-uncollapsible):hover {
      background-color: rgba(0, 0, 0, 0.2);
      box-shadow: var(--material-shadow-elevation-4dp);
    }

    .ol-control button {
      width: 2em;
      height: 2em;
      border-radius: inherit;
      background-color: var(--material-background-color);
    }

    .ol-control button,
    .ol-attribution:not(.ol-uncollapsible) ul {
      color: var(--material-secondary-text-color);
    }

    .ol-control:hover button,
    .ol-attribution:hover ul {
      color: var(--material-body-text-color);
    }

    .ol-control button:hover {
      color: var(--material-primary-text-color);
    }

    .ol-control button:active {
      background-color: var(--material-secondary-background-color);
    }

    @supports not selector(:focus-visible) {
      .ol-control button:focus {
        box-shadow: 0 0 0 2px var(--material-primary-color);
        outline: none;
      }
    }

    .ol-control button:focus-visible {
      box-shadow: 0 0 0 2px var(--material-primary-color);
      outline: none;
    }

    .ol-zoom {
      gap: 1px;
    }

    button.ol-zoom-in {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    button.ol-zoom-out {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .ol-attribution.ol-uncollapsible {
      border-radius: 4px 0 0;
    }

    .ol-attribution ul {
      cursor: default;
      font-size: var(--material-caption-font-size);
    }

    .ol-attribution:not(.ol-uncollapsible) ul {
      background-color: var(--material-background-color);
    }

    .ol-attribution a {
      color: inherit;
      cursor: pointer;
    }

    .ol-scale-bar-inner {
      border-radius: 4px;
    }

    .ol-full-screen {
      height: 2em;
    }

    .ol-overviewmap:not(.ol-collapsed),
    .ol-overviewmap:not(.ol-collapsed):hover {
      background-color: var(--material-background-color);
    }

    .ol-overviewmap-map {
      border: 0;
      border-radius: 2px;
      margin: 2px;
    }

    .ol-zoomslider,
    .ol-zoomslider:not(.ol-uncollapsible):hover {
      overflow: visible;
      box-shadow: none;
    }

    .ol-zoomslider button {
      height: 16px;
      box-shadow: var(--material-shadow-elevation-2dp);
    }

    .ol-zoomslider:hover button {
      box-shadow: var(--material-shadow-elevation-4dp);
    }
  `,
  { moduleId: 'material-map' },
);
