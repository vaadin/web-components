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
      /* --vaadin-map-controls-inset: var(--lumo-space-xs);
      --vaadin-map-icon-zoom-in: var(--lumo-icons-plus);
      --vaadin-map-icon-zoom-out: var(--lumo-icons-minus);
      --vaadin-map-icon-compass: var(--lumo-icons-arrow-up);
      --vaadin-map-icon-overview-map-collapse: var(--lumo-icons-angle-down);
      --vaadin-map-icon-overview-map-expand: var(--lumo-icons-angle-up);
      --vaadin-map-icon-close: var(--lumo-icons-cross);
      --vaadin-map-icon-attribution-collapse: var(--lumo-icons-angle-right); */
    }

    :host(:not([theme~='borderless'])) {
      border-radius: 4px;
      border: 1px solid var(--material-divider-color);
    }

    .ol-control {
      border-radius: 4px;
      overflow: hidden;
      transition: 0.1s box-shadow;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
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

    .ol-zoom {
      gap: 1px;
    }

    .ol-attribution.ol-uncollapsible {
      border-radius: 4px 0 0 0;
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
  `,
  { moduleId: 'material-map' }
);
