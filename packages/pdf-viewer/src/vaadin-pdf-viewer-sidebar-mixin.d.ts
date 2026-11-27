/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { TemplateResult } from 'lit';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A mixin that adds a sidebar with a thumbnail of each page, and a button
 * in the toolbar that shows and hides it. The sidebar shows next to the
 * pages, and over them in a narrow viewer.
 */
export declare function PdfViewerSidebarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerSidebarMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class PdfViewerSidebarMixinClass {
  /**
   * Whether the sidebar with the page thumbnails is shown.
   *
   * In a viewer narrower than 30rem, the sidebar shows over the pages.
   *
   * @attr {boolean} sidebar-opened
   */
  sidebarOpened: boolean;

  /**
   * Whether the button that shows and hides the sidebar is hidden from
   * the toolbar. The `sidebarOpened` property works also while it is hidden.
   *
   * @attr {boolean} sidebar-button-hidden
   */
  sidebarButtonHidden: boolean;

  /**
   * Whether the sidebar shows over the pages.
   */
  protected readonly _sidebarOverlay: boolean;

  /**
   * Returns the template of the button that shows and hides the sidebar,
   * in the `toolbar-sidebar` slot.
   */
  protected _renderSidebarButton(): TemplateResult;

  /**
   * Returns the template of the sidebar with the page thumbnails.
   */
  protected _renderSidebar(): TemplateResult;
}
