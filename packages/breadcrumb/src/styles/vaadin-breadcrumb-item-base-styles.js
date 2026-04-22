/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/component-base/src/styles/style-props.js';
import { css } from 'lit';

export const breadcrumbItemStyles = css`
  /*
   * Decorative separator rendered between items, following the same
   * mask-image + currentColor pattern as field-base/button-base-styles.
   * Reads the --vaadin-breadcrumb-separator custom property (defaulting
   * to the shared chevron-right token) so applications can override the
   * separator on the parent <vaadin-breadcrumb> and have it cascade
   * down to all items.
   */
  :host::after {
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

  :host(:last-of-type)::after,
  :host([current])::after {
    display: none;
  }

  :host-context([dir='rtl'])::after {
    transform: scaleX(-1);
  }
`;
