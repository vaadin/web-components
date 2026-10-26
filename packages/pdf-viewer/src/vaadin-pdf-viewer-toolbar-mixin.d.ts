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
 * A mixin that adds the toolbar with the page navigation.
 */
export declare function PdfViewerToolbarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerToolbarMixinClass> & T;

export declare class PdfViewerToolbarMixinClass {
  /**
   * Returns the template of the toolbar, which shows the controls of
   * `_renderToolbarControls()` in its slots.
   */
  protected _renderToolbar(): TemplateResult;

  /**
   * Returns the template of the toolbar controls, which are rendered into
   * the light DOM.
   */
  protected _renderToolbarControls(): TemplateResult;
}
