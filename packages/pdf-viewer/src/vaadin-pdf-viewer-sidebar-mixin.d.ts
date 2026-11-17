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

/**
 * A mixin that adds a sidebar next to the pages with a thumbnail of each
 * page, and a button in the toolbar that shows and hides it.
 */
export declare function PdfViewerSidebarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerSidebarMixinClass> & T;

export declare class PdfViewerSidebarMixinClass {
  /**
   * Whether the sidebar with the page thumbnails is shown.
   *
   * @attr {boolean} sidebar-opened
   */
  sidebarOpened: boolean;

  /**
   * Returns the template of the button that shows and hides the sidebar,
   * in the `toolbar-sidebar` slot.
   */
  protected _renderSidebarButton(): TemplateResult;

  /**
   * Returns the template of the sidebar next to the pages.
   */
  protected _renderSidebar(): TemplateResult;
}
