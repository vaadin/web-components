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

  [part='list'] {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    min-width: 0;
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
   * Items collapsed by overflow detection are hidden from the layout.
   * The attribute is set on the light-DOM <vaadin-breadcrumb-item>
   * children, so we target them via ::slotted().
   */
  ::slotted([data-overflow-hidden]) {
    display: none;
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
`;
