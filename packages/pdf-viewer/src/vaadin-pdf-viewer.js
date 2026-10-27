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
import { html, LitElement } from 'lit';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { pdfViewerStyles } from './styles/vaadin-pdf-viewer-base-styles.js';
import { pdfViewerPageStyles } from './styles/vaadin-pdf-viewer-page-base-styles.js';
import { PdfViewerMixin } from './vaadin-pdf-viewer-mixin.js';

/**
 * `<vaadin-pdf-viewer>` is a web component for viewing PDF documents.
 *
 * ```html
 * <vaadin-pdf-viewer src="/files/report.pdf"></vaadin-pdf-viewer>
 * ```
 *
 * The component is experimental and its API may change. To use it, enable
 * the following feature flag:
 *
 * ```js
 * window.Vaadin.featureFlags.pdfViewerComponent = true;
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|------------
 * `content` | The scrollable area that contains the pages.
 * `page`    | A page of the document.
 * `loader`  | The loading indicator shown while the document loads.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------
 * `loading`    | Set while the document is loading.
 * `has-error`  | Set when the document could not be loaded.
 * `focused`    | Set when the page area is focused.
 * `focus-ring` | Set when the page area is focused using the keyboard.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                    |
 * :---------------------------------------|
 * | `--vaadin-pdf-viewer-background`      |
 * | `--vaadin-pdf-viewer-border-color`    |
 * | `--vaadin-pdf-viewer-border-radius`   |
 * | `--vaadin-pdf-viewer-padding`         |
 * | `--vaadin-pdf-viewer-page-background` |
 * | `--vaadin-pdf-viewer-page-gap`        |
 * | `--vaadin-pdf-viewer-page-shadow`     |
 * | `--vaadin-pdf-viewer-text-color`      |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} page-changed - Fired when the `page` property changes.
 * @fires {CustomEvent} page-count-changed - Fired when the `pageCount` property changes.
 *
 * @customElement vaadin-pdf-viewer
 * @extends HTMLElement
 */
class PdfViewer extends PdfViewerMixin(FocusMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-pdf-viewer';
  }

  static get cvdlName() {
    return 'vaadin-pdf-viewer';
  }

  static get experimental() {
    return true;
  }

  static get styles() {
    return [pdfViewerStyles, pdfViewerPageStyles];
  }

  /** @protected */
  render() {
    return html`
      <div part="loader"></div>
      <div class="content-area">
        <div
          id="content"
          part="content"
          tabindex="${this.pageCount ? '0' : '-1'}"
          @focusin="${this.#onContentFocusIn}"
          @focusout="${this.#onContentFocusOut}"
        >
          <div id="pages"></div>
        </div>
      </div>
    `;
  }

  /**
   * Override method from `FocusMixin` to focus the page area,
   * which is only focusable once a document has loaded.
   * @param {FocusOptions=} options
   * @protected
   * @override
   */
  focus(options) {
    if (!this.pageCount) {
      return;
    }

    this.$.content.focus(options);

    super.focus(options);
  }

  /**
   * Override method from `FocusMixin` to ignore focus events on the host.
   * Focus moving inside the shadow root does not reach the host, e.g. from
   * the page area to a link in a page, so the page area handles them.
   * @param {FocusEvent} _event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetFocus(_event) {
    return false;
  }

  /** @private */
  #onContentFocusIn(event) {
    // Only the page area itself, not an element in a page
    if (event.target === event.currentTarget) {
      this._setFocused(true);
    }
  }

  /** @private */
  #onContentFocusOut() {
    this._setFocused(false);
  }
}

defineCustomElement(PdfViewer);

export { PdfViewer };
