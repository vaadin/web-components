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
 * `[part='overlay']` panel. Anything theme-related (colors, shadows,
 * typography, spacing tokens) belongs in the Lumo / Aura theme files.
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

  [part='overlay'] {
    display: flex;
    flex-direction: column;
  }

  [part='content'] {
    display: flex;
    flex-direction: column;
  }
`;
