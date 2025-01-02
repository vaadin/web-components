/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const DialogRendererMixin = (superClass) =>
  class DialogRendererMixin extends superClass {
    static get properties() {
      return {
        /**
         * Custom function for rendering the content of the dialog.
         * Receives two arguments:
         *
         * - `root` The root container DOM element. Append your content to it.
         * - `dialog` The reference to the `<vaadin-dialog>` element.
         * @type {DialogRenderer | undefined}
         */
        renderer: {
          type: Object,
        },

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
        headerTitle: String,

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
         * @type {DialogRenderer | undefined}
         */
        headerRenderer: {
          type: Object,
        },

        /**
         * Custom function for rendering the dialog footer.
         * Receives two arguments:
         *
         * - `root` The root container DOM element. Append your content to it.
         * - `dialog` The reference to the `<vaadin-dialog>` element.
         *
         * When `footerRenderer` is set, the attribute `has-footer` is added to the overlay element.
         * @type {DialogRenderer | undefined}
         */
        footerRenderer: {
          type: Object,
        },
      };
    }

    /**
     * Requests an update for the content of the dialog.
     * While performing the update, it invokes the renderer passed in the `renderer` property,
     * as well as `headerRender` and `footerRenderer` properties, if these are defined.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (this._overlayElement) {
        this._overlayElement.requestContentUpdate();
      }
    }
  };
