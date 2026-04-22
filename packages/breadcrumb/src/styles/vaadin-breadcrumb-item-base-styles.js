/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  /*
   * The host stays at its default inline display so that the rendered
   * link/span and the decorative ::after separator pseudo-element flow
   * inline within the parent <vaadin-breadcrumb> [part='list']. The
   * link element itself lays out its prefix slot and label part as
   * inline-flex below. The flex sizing keeps each item from growing or
   * shrinking once the parent flex container is laid out.
   */
  :host {
    flex: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  /*
   * The link/span wrapping the prefix slot and the label part. Lay it out
   * as an inline flex row so the prefix icon and label sit on the same
   * line. The default link color is preserved at the base layer so the
   * underline + visited color follow the user agent and theme files set
   * the typographic chrome.
   */
  [part='link'] {
    align-items: center;
    color: inherit;
    display: inline-flex;
    gap: var(--vaadin-breadcrumb-item-gap, var(--vaadin-gap-xs));
    min-width: 0;
  }

  /*
   * When the prefix slot is empty, drop the prefix-to-label gap so an
   * item with only a label has no extra leading whitespace inside the
   * link box. The has-prefix attribute is toggled by the PrefixSlotController
   * (see vaadin-breadcrumb-item.js).
   */
  :host(:not([has-prefix])) [part='link'] {
    gap: 0;
  }

  [part='label'] {
    display: inline-flex;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*
   * Decorative separator rendered between items, following the same
   * mask-image + currentColor pattern as field-base/button-base-styles.
   * Reads the --vaadin-breadcrumb-separator custom property (defaulting
   * to the shared chevron-right token) so applications can override the
   * separator on the parent <vaadin-breadcrumb> and have it cascade
   * down to all items. The separator is sized to 1em (cap-height of the
   * surrounding text) by default so the chevron sits visually centered
   * on the text baseline rather than dwarfing it.
   */
  :host::after {
    background: currentColor;
    content: '';
    display: inline-block;
    flex: none;
    height: var(--vaadin-breadcrumb-separator-size, 1em);
    width: var(--vaadin-breadcrumb-separator-size, 1em);
    mask-image: var(--vaadin-breadcrumb-separator, var(--_vaadin-icon-chevron-right));
    mask-position: 50%;
    mask-repeat: no-repeat;
    mask-size: var(--vaadin-icon-visual-size, 100%);
  }

  /*
   * Constrain prefix-slot content (typically a <vaadin-icon>) to the
   * cap-height of the text so the icon sits neatly next to the label
   * rather than rendering at the icon set's intrinsic / theme-default
   * size, which is taller than the breadcrumb's text line.
   */
  ::slotted([slot='prefix']) {
    --vaadin-icon-size: 1em;
    height: 1em;
    width: 1em;
  }

  :host(:last-of-type)::after,
  :host([current])::after {
    display: none;
  }

  :host-context([dir='rtl'])::after {
    transform: scaleX(-1);
  }

  /*
   * Forced-colors-mode fallback. mask-image glyphs render as a coloured
   * rectangle in forced-colors mode unless we explicitly switch the
   * background to a system color. Using CanvasText keeps the chevron
   * separator visible on all forced-colors palettes.
   */
  @media (forced-colors: active) {
    :host::after {
      background: CanvasText;
    }
  }
`;
