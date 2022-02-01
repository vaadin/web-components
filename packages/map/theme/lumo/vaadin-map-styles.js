/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
import '@vaadin/vaadin-lumo-styles/style.js';
import '@vaadin/vaadin-lumo-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-map',
  css`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      --vaadin-map-controls-inset: var(--lumo-space-xs);
      --vaadin-map-icon-zoom-in: var(--lumo-icons-plus);
      --vaadin-map-icon-zoom-out: var(--lumo-icons-minus);
      --vaadin-map-icon-compass: var(--lumo-icons-arrow-up);
      --vaadin-map-icon-overview-map-collapse: var(--lumo-icons-angle-down);
      --vaadin-map-icon-overview-map-expand: var(--lumo-icons-angle-up);
      --vaadin-map-icon-close: var(--lumo-icons-cross);
      --vaadin-map-icon-attribution-collapse: var(--lumo-icons-angle-right);
    }

    :host(:not([theme~='borderless'])) {
      border-radius: var(--lumo-border-radius-l);
      position: relative;
    }

    :host(:not([theme~='borderless']))::before {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid var(--lumo-contrast-10pct);
      border-radius: inherit;
      z-index: 1;
      pointer-events: none;
    }

    .ol-control,
    .ol-scale-bar,
    .ol-scale-line {
      margin: var(--lumo-space-xs);
    }

    .ol-control {
      border-radius: var(--lumo-border-radius-m);
      overflow: hidden;
      transition: 0.2s box-shadow, 0.2s background-color;
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
    }

    .ol-control:hover {
      background-color: var(--lumo-base-color);
    }

    .ol-control:not(.ol-uncollapsible):hover {
      box-shadow: var(--lumo-box-shadow-s);
      background-color: var(--lumo-shade-20pct);
    }

    .ol-control button {
      width: var(--lumo-size-s);
      height: var(--lumo-size-s);
    }

    .ol-control button,
    .ol-attribution:not(.ol-uncollapsible) ul {
      transition: 0.2s opacity;
      background-color: var(--lumo-base-color);
      color: var(--lumo-secondary-text-color);
      opacity: 0.7;
    }

    .ol-control:hover button,
    .ol-attribution:hover ul {
      opacity: 1;
    }

    .ol-control button:hover {
      color: var(--lumo-primary-text-color);
    }

    .ol-zoom {
      gap: 2px;
    }

    .ol-control button {
      font-family: 'lumo-icons';
      font-size: var(--lumo-icon-size-s);
      font-weight: 400;
    }

    .ol-attribution.ol-uncollapsible {
      border-radius: var(--lumo-border-radius-m) 0 0 0;
    }

    .ol-attribution ul {
      font-size: var(--lumo-font-size-xxs);
      color: var(--lumo-secondary-text-color);
      padding: var(--lumo-space-xs) var(--lumo-space-s);
      cursor: default;
    }

    .ol-attribution:not(.ol-uncollapsible) ul {
      background-color: var(--lumo-base-color);
    }

    .ol-attribution a {
      color: inherit;
      cursor: pointer;
    }

    .ol-scale-bar-inner {
      border-radius: var(--lumo-border-radius-s);
    }

    .ol-full-screen {
      height: var(--lumo-size-s);
    }

    .ol-overviewmap:not(.ol-collapsed),
    .ol-overviewmap:not(.ol-collapsed):hover {
      background-color: var(--lumo-base-color);
    }

    .ol-overviewmap-map {
      margin: var(--lumo-space-xs);
      margin-bottom: 0;
      border: 0;
      border-radius: var(--lumo-border-radius-s);
    }
  `,
  { moduleId: 'lumo-map' }
);
