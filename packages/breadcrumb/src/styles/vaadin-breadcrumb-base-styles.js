/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
`;
