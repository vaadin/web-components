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
 * A mixin that finds text in the document: a button in the toolbar, a find
 * bar over the pages, and highlights of the matches on the rendered pages.
 */
export declare function PdfViewerFindMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerFindMixinClass> & T;

export declare class PdfViewerFindMixinClass {
  /**
   * Whether the button that opens the find bar is hidden from the
   * toolbar. While it is hidden, Ctrl+F or Cmd+F opens the find of the
   * browser. The `find()` method works also while it is hidden.
   *
   * @attr {boolean} find-button-hidden
   */
  findButtonHidden: boolean;

  /**
   * Opens the find bar with the given text, searches the document for it
   * and scrolls to the first match. The matches are highlighted on the
   * pages until the find bar closes, the next search, or until the document
   * unloads, e.g. on a new `src` or a detach. Fires `find-result` with the
   * number of matches. Focus stays where it is. While the document loads,
   * it runs once loaded. Does nothing without a document, or when the
   * viewer is not attached. Of several `find()` and `highlight()` calls in
   * a row, only the last one runs.
   */
  find(text: string): void;

  /**
   * Highlights every occurrence of the given text on the given page and
   * scrolls to the first one, for a passage that the application has
   * located. The next `highlight()` or `find()` clears it. A page that is
   * not a page number of the document logs a warning and also clears it.
   * It does not open the find bar, and clears the text of an open find
   * bar. While the document loads, it runs once loaded. Does nothing
   * without a document, or when the viewer is not attached. Of several
   * `find()` and `highlight()` calls in a row, only the last one runs.
   *
   * @param page the page number, starting from 1
   */
  highlight(page: number, text: string): void;

  /**
   * Returns the template of the button that opens and closes the find bar,
   * in the `toolbar-find` slot.
   */
  protected _renderFindButton(): TemplateResult;

  /**
   * Returns the template of the find bar over the pages. Its controls are
   * rendered into the light DOM while it is open.
   */
  protected _renderFindBar(): TemplateResult;
}
