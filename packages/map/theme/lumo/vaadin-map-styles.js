/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
      --_focus-ring-color: var(--vaadin-focus-ring-color, var(--lumo-primary-color-50pct));
      --_focus-ring-width: var(--vaadin-focus-ring-width, 2px);
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

    :host([focus-ring]) {
      box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    }

    .ol-control,
    .ol-scale-bar,
    .ol-scale-line {
      margin: var(--lumo-space-xs);
    }

    .ol-control {
      border-radius: var(--lumo-border-radius-m);
      transition:
        0.15s box-shadow,
        0.15s background-color;
      -webkit-backdrop-filter: blur(8px);
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
      border-radius: inherit;
      font-family: 'lumo-icons';
      font-size: var(--lumo-icon-size-s);
      font-weight: 400;
    }

    .ol-control button,
    .ol-attribution:not(.ol-uncollapsible) ul {
      transition: 0.15s opacity;
      background-color: var(--lumo-base-color);
      color: var(--lumo-body-text-color);
      opacity: 0.65;
    }

    .ol-control:hover button,
    .ol-control button:focus,
    .ol-attribution:hover ul {
      opacity: 1;
    }

    .ol-control button:hover {
      color: var(--lumo-primary-text-color);
    }

    .ol-control button:active {
      background: var(--lumo-base-color) linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
    }

    @supports not selector(:focus-visible) {
      .ol-control button:focus {
        outline: none;
        box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
      }
    }

    .ol-control button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--_focus-ring-width) var(--_focus-ring-color);
    }

    .ol-zoom {
      gap: 2px;
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
      box-shadow: var(--lumo-box-shadow-s);
      transition: 0.15s box-shadow;
    }

    .ol-overviewmap-map {
      margin: var(--lumo-space-xs);
      border: 0;
      border-radius: var(--lumo-border-radius-s);
    }

    .ol-overviewmap:not(.ol-uncollapsible) .ol-overviewmap-map {
      margin-bottom: 0;
    }

    .ol-zoomslider:not(.ol-uncollapsible):hover {
      box-shadow: none;
      overflow: visible;
    }

    .ol-zoomslider button {
      height: var(--lumo-space-m);
    }

    .ol-zoomslider:hover button {
      box-shadow: var(--lumo-box-shadow-s);
    }
  `,
  { moduleId: 'lumo-map' },
);
