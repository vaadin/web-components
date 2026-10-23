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
 * Adds the header and the toolbar to the PDF viewer. The controls of the
 * toolbar are Vaadin components, rendered into the light DOM so that themes
 * can style them like any other instance of these components.
 */
export declare function PdfViewerToolbarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerToolbarMixinClass> & T;

export declare class PdfViewerToolbarMixinClass {
  /**
   * Whether the header is shown above the toolbar while a document is
   * loaded. The header shows `headerTitle`, or else the name of the
   * document, with the button that collapses and expands the toolbar.
   *
   * @attr {boolean} header-visible
   */
  headerVisible: boolean;

  /**
   * The title shown in the header, see `headerVisible`. When set, it is
   * also the accessible name of the viewer, also while the header is
   * hidden. When not set, the header shows the name of the document,
   * see `fileName`.
   *
   * @attr {string} header-title
   */
  headerTitle: string | null | undefined;

  /**
   * Whether the toolbar is collapsed. The button that collapses and
   * expands it is in the header, so the toolbar collapses only while
   * the header is shown, see `headerVisible`.
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
