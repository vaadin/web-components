/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

/**
 * Structural styles for `<vaadin-breadcrumb-overlay>`. Stacked on top of
 * `overlayStyles` from `@vaadin/overlay`, which provides the `:host`
 * positioning, top-layer popover defaults, and the visual chrome of the
 * `[part='overlay']` panel (background, border, border-radius, shadow,
 * `[hidden]` and `:host([hidden])` rules, forced-colors fallback).
 * Anything theme-related (typography, spacing tokens) belongs in the
 * Lumo / Aura theme files.
 *
 * The overflow overlay anchors to the overflow button via `positionTarget`,
 * so it should align to the start edge of the breadcrumb rather than the
 * viewport center that `overlayStyles` sets by default.
 */
export const breadcrumbOverlayStyles = css`
  :host {
    align-items: flex-start;
    justify-content: flex-start;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='overlay'] {
    display: flex;
    flex-direction: column;
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
    padding: var(--vaadin-padding-block-container) var(--vaadin-padding-inline-container);
  }

  /*
   * Style the links rendered into the overlay by the breadcrumb's
   * renderer. The renderer writes plain <a> elements as light-DOM
   * children of <vaadin-breadcrumb-overlay>, which the inner <slot>
   * inside [part='content'] then projects. We target both the slotted
   * content (default rendering path) and any direct <a> children of
   * [part='content'] (so subclasses or overrides that append into the
   * shadow tree directly are styled the same way). Theme files refine
   * the typography.
   */
  ::slotted(a),
  [part='content'] a {
    color: inherit;
    display: block;
    padding: var(--vaadin-padding-xs) var(--vaadin-padding-s);
    text-decoration: none;
  }

  ::slotted(a:focus-visible),
  [part='content'] a:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
    outline-offset: -1px;
  }
`;
