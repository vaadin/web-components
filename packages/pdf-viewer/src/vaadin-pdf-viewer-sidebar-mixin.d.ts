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
 * Adds a sidebar to the PDF viewer, with thumbnails of the pages and the
 * outline of the document, and a button in the toolbar that shows and hides it.
 * In a narrow viewer, the sidebar is shown over the pages.
 */
export declare function PdfViewerSidebarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerSidebarMixinClass> & T;

export declare class PdfViewerSidebarMixinClass {
  /**
   * Whether the sidebar with the page thumbnails and the outline of
   * the document is shown.
   *
   * @attr {boolean} sidebar-opened
   */
  sidebarOpened: boolean;

  /**
   * Returns the template of the sidebar, which shows the controls of
   * `_renderSidebarControls()` in its header.
   */
  protected _renderSidebar(): TemplateResult;

  /**
   * Returns the template of the sidebar button of the toolbar and the
   * buttons that switch the view of the sidebar, which are rendered into
   * the light DOM.
   */
  protected _renderSidebarControls(): TemplateResult;
}
