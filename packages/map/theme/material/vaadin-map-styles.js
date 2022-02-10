/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
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
      border-radius: 4px;
      border: 1px solid var(--material-divider-color);
    }

    :host([focus-ring]) {
      box-shadow: 0 0 0 2px var(--material-primary-color);
    }

    .ol-control {
      border-radius: 4px;
      transition: 0.1s box-shadow;
      box-shadow: var(--material-shadow-elevation-2dp);
    }

    .ol-control:hover {
      background-color: var(--material-background-color);
    }

    .ol-control:not(.ol-uncollapsible):hover {
      box-shadow: var(--material-shadow-elevation-4dp);
      background-color: rgba(0, 0, 0, 0.2);
    }

    .ol-control button {
      width: 2em;
      height: 2em;
      background-color: var(--material-background-color);
      border-radius: inherit;
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
        outline: none;
        box-shadow: 0 0 0 2px var(--material-primary-color);
      }
    }

    .ol-control button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--material-primary-color);
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
      font-size: var(--material-caption-font-size);
      cursor: default;
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
      margin: 2px;
      border: 0;
      border-radius: 2px;
    }

    .ol-zoomslider,
    .ol-zoomslider:not(.ol-uncollapsible):hover {
      box-shadow: none;
      overflow: visible;
    }

    .ol-zoomslider button {
      height: 16px;
      box-shadow: var(--material-shadow-elevation-2dp);
    }

    .ol-zoomslider:hover button {
      box-shadow: var(--material-shadow-elevation-4dp);
    }
  `,
  { moduleId: 'material-map' }
);
