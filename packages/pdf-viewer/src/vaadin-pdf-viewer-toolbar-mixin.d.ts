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
 * A mixin that adds the header and the toolbar with the page navigation and
 * the zoom.
 */
export declare function PdfViewerToolbarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerToolbarMixinClass> & T;

export declare class PdfViewerToolbarMixinClass {
  /**
   * Whether the header above the toolbar is hidden. The header shows
   * `headerTitle`, or else the file name of `src`, and collapses and
   * expands the toolbar when clicked.
   *
   * @attr {boolean} header-hidden
   */
  headerHidden: boolean;

  /**
   * The title shown in the header, see `headerHidden`. When not set,
   * the header shows the file name of `src`.
   *
   * @attr {string} header-title
   */
  headerTitle: string | null | undefined;

  /**
   * Whether the toolbar is collapsed. The header collapses and expands
   * it, so the toolbar collapses only while the header is shown, see
   * `headerHidden`.
   *
   * @attr {boolean} toolbar-collapsed
   */
  toolbarCollapsed: boolean;

  /**
   * Returns the template of the header and the toolbar, which show the
   * controls of `_renderToolbarControls()` in their slots.
   */
  protected _renderToolbar(): TemplateResult;

  /**
   * Returns the template of the toolbar controls, which are rendered into
   * the light DOM.
   */
  protected _renderToolbarControls(): TemplateResult;
}
