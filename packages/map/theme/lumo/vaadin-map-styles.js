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
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
    }

    :host(:not([theme~='borderless'])) {
      position: relative;
      border-radius: var(--lumo-border-radius-l);
    }

    :host(:not([theme~='borderless']))::before {
      content: '';
      position: absolute;
      z-index: 1;
      border: 1px solid var(--lumo-contrast-10pct);
      border-radius: inherit;
      pointer-events: none;
      inset: 0;
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
      transition:
        0.15s box-shadow,
        0.15s background-color;
      border-radius: var(--lumo-border-radius-m);
      -webkit-backdrop-filter: blur(8px);
    }

    .ol-control:hover {
      background-color: var(--lumo-base-color);
    }

    .ol-control:not(.ol-uncollapsible):hover {
      background-color: var(--lumo-shade-20pct);
      box-shadow: var(--lumo-box-shadow-s);
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
      opacity: 0.65;
      background-color: var(--lumo-base-color);
      color: var(--lumo-body-text-color);
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
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    button.ol-zoom-out {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .ol-attribution.ol-uncollapsible {
      border-radius: var(--lumo-border-radius-m) 0 0 0;
    }

    .ol-attribution ul {
      padding: var(--lumo-space-xs) var(--lumo-space-s);
      color: var(--lumo-secondary-text-color);
      font-size: var(--lumo-font-size-xxs);
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
      transition: 0.15s box-shadow;
      background-color: var(--lumo-base-color);
      box-shadow: var(--lumo-box-shadow-s);
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
      overflow: visible;
      box-shadow: none;
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
