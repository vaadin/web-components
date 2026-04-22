/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none !important;
  }

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--vaadin-breadcrumb-gap, var(--vaadin-gap-xs));
    min-width: 0;
    /*
     * The list clips its overflow so that 'scrollWidth > clientWidth' is a
     * meaningful overflow signal for the ResizeMixin-driven detection in
     * BreadcrumbMixin (see Task 9).
     */
    overflow: hidden;
  }

  /*
   * The overflow listitem is only visible when the host has the
   * 'has-overflow' attribute (set by the overflow detection logic).
   * This replaces the static 'hidden' attribute on the overflow div.
   */
  :host(:not([has-overflow])) [part='overflow'] {
    display: none;
  }

  /*
   * The overflow listitem stays at its default block-level display in the
   * flex container — its inline children (the overflow button and the
   * ::after separator pseudo-element) lay out side-by-side with the
   * normal inline flow. Keeping it block-level (rather than inline-flex)
   * ensures the inline-block ::after pseudo is not blockified, matching
   * the per-item separator's display behaviour.
   */
  [part='overflow'] {
    flex: none;
  }

  /*
   * Items collapsed by overflow detection are hidden from the layout.
   * The attribute is set on the light-DOM <vaadin-breadcrumb-item>
   * children, so we target them via ::slotted().
   */
  ::slotted([data-overflow-hidden]) {
    display: none;
  }

  /*
   * Minimal structural styles for the overflow button. Visual chrome
   * (border, background, padding, hover/focus) belongs to the theme files
   * (Tasks 17 and 18). This base layer just resets the user-agent button
   * styling so the icon glyph renders predictably and the click target
   * matches the icon box.
   */
  [part='overflow-button'] {
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: var(--vaadin-clickable-cursor);
    display: inline-flex;
    flex: none;
    font: inherit;
    justify-content: center;
    margin: 0;
    padding: 0;
  }

  /*
   * Ellipsis glyph rendered as a mask-image, following the same pattern
   * as the separator pseudo-elements. Using mask-image instead of textual
   * "..." keeps the glyph visually consistent with the chevron separator
   * (same sizing tokens, same forced-colors fallback).
   */
  [part='overflow-button']::before {
    background: currentColor;
    content: '';
    display: inline-block;
    flex: none;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>');
    mask-position: 50%;
    mask-repeat: no-repeat;
    mask-size: var(--vaadin-icon-visual-size, 100%);
  }

  /*
   * Decorative separator rendered after the overflow listitem, mirroring
   * the per-item separator (see vaadin-breadcrumb-item-base-styles).
   * Uses the same mask-image + currentColor pattern and reads the
   * --vaadin-breadcrumb-separator custom property so applications can
   * override the separator on the parent <vaadin-breadcrumb> and have it
   * cascade down to both items and the overflow element.
   *
   * No hide-rule is needed: the overflow element itself is display:none
   * unless the host has [has-overflow], so the ::after pseudo is
   * implicitly not laid out in that case.
   */
  [part='overflow']::after {
    background: currentColor;
    content: '';
    display: inline-block;
    flex: none;
    height: var(--vaadin-icon-size, 1lh);
    width: var(--vaadin-icon-size, 1lh);
    mask-image: var(--vaadin-breadcrumb-separator, var(--_vaadin-icon-chevron-right));
    mask-position: 50%;
    mask-repeat: no-repeat;
    mask-size: var(--vaadin-icon-visual-size, 100%);
  }

  :host-context([dir='rtl']) [part='overflow']::after {
    transform: scaleX(-1);
  }

  /*
   * Forced-colors-mode fallbacks. mask-image glyphs render as a coloured
   * rectangle in forced-colors mode unless we explicitly switch the
   * background to a system color. Using CanvasText keeps the chevron and
   * ellipsis visible on all forced-colors palettes. The overflow button
   * gets an outline so it remains discoverable as an interactive control.
   */
  @media (forced-colors: active) {
    [part='overflow']::after,
    [part='overflow-button']::before {
      background: CanvasText;
    }

    [part='overflow-button']:focus-visible {
      outline: 1px solid Highlight;
    }
  }
`;
