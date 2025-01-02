/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DialogRenderer } from './vaadin-dialog.js';

export declare function DialogRendererMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DialogRendererMixinClass> & T;

export declare class DialogRendererMixinClass {
  /**
   * Custom function for rendering the content of the dialog.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   */
  renderer: DialogRenderer | null | undefined;

  /**
   * String used for rendering a dialog title.
   *
   * If both `headerTitle` and `headerRenderer` are defined, the title
   * and the elements created by the renderer will be placed next to
   * each other, with the title coming first.
   *
   * When `headerTitle` is set, the attribute `has-title` is added to the overlay element.
   * @attr {string} header-title
   */
  headerTitle: string | null | undefined;

  /**
   * Custom function for rendering the dialog header.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   *
   * If both `headerTitle` and `headerRenderer` are defined, the title
   * and the elements created by the renderer will be placed next to
   * each other, with the title coming first.
   *
   * When `headerRenderer` is set, the attribute `has-header` is added to the overlay element.
   */
  headerRenderer: DialogRenderer | null | undefined;

  /**
   * Custom function for rendering the dialog footer.
   * Receives two arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `dialog` The reference to the `<vaadin-dialog>` element.
   *
   * When `footerRenderer` is set, the attribute `has-footer` is added to the overlay element.
   */
  footerRenderer: DialogRenderer | null | undefined;

  /**
   * While performing the update, it invokes the renderer passed in the `renderer` property,
   * as well as `headerRender` and `footerRenderer` properties, if these are defined.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate(): void;
}
