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

/**
 * Renders the toolbar of the PDF viewer. Its controls are Vaadin components,
 * rendered into the light DOM so that themes can style them like any other
 * instance of these components.
 */
export declare function PdfViewerToolbarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerToolbarMixinClass> & T;

export declare class PdfViewerToolbarMixinClass {
  /**
   * Whether the toolbar is collapsed. The button that collapses and
   * expands it is next to the file name, so the toolbar collapses only
   * while the file name is shown, see `fileNameVisible`. The find bar
   * stays open when the toolbar collapses.
   *
   * Defaults to collapsed on devices whose main pointer is touch, like
   * phones, where the pages need all the space they can get.
   *
   * @attr {boolean} toolbar-collapsed
   */
  toolbarCollapsed: boolean;
}
