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
import { html, LitElement, render } from 'lit';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { pdfViewerStyles } from './styles/vaadin-pdf-viewer-base-styles.js';
import { pdfViewerPageStyles } from './styles/vaadin-pdf-viewer-page-base-styles.js';
import { pdfViewerToolbarStyles } from './styles/vaadin-pdf-viewer-toolbar-base-styles.js';
import { PdfViewerMixin } from './vaadin-pdf-viewer-mixin.js';

const DEFAULT_I18N = {
  previousPage: 'Previous page',
  nextPage: 'Next page',
  pageError: 'Enter 1–{pageCount}',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  pageWidth: 'Page width',
  pageFit: 'Page fit',
};

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
 * ### Slots
 *
 * Name              | Description
 * ------------------|-------------
 * `toolbar-actions` | Slot for application controls, e.g. buttons, at the end of the toolbar
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|------------
 * `toolbar`       | The toolbar above the pages.
 * `toolbar-group` | A group of related controls in the toolbar: navigation, zoom and actions.
 * `content`       | The scrollable area that contains the pages.
 * `page`          | A page of the document.
 * `loader`        | The loading indicator shown while the document loads.
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
 * Custom CSS property                        |
 * :-------------------------------------------|
 * | `--vaadin-pdf-viewer-background`          |
 * | `--vaadin-pdf-viewer-border-color`        |
 * | `--vaadin-pdf-viewer-border-radius`       |
 * | `--vaadin-pdf-viewer-padding`             |
 * | `--vaadin-pdf-viewer-page-background`     |
 * | `--vaadin-pdf-viewer-page-gap`            |
 * | `--vaadin-pdf-viewer-page-shadow`         |
 * | `--vaadin-pdf-viewer-text-color`          |
 * | `--vaadin-pdf-viewer-toolbar-background`  |
 * | `--vaadin-pdf-viewer-toolbar-gap`         |
 * | `--vaadin-pdf-viewer-toolbar-padding`     |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} page-changed - Fired when the `page` property changes.
 * @fires {CustomEvent} page-count-changed - Fired when the `pageCount` property changes.
 * @fires {CustomEvent} zoom-changed - Fired when the `zoom` property changes.
 *
 * @customElement vaadin-pdf-viewer
 * @extends HTMLElement
 */
class PdfViewer extends PdfViewerMixin(
  I18nMixin(FocusMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
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
    return [pdfViewerStyles, pdfViewerToolbarStyles, pdfViewerPageStyles];
  }

  static get defaultI18n() {
    return DEFAULT_I18N;
  }

  /**
   * The object used to localize this component. To change the default
   * localization, set this to an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * When not set, defaults to `undefined`.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Tooltip of the previous page button.
   *   previousPage: 'Previous page',
   *   // Tooltip of the next page button.
   *   nextPage: 'Next page',
   *   // Error shown for a page that does not exist. {pageCount} is replaced with the page count.
   *   pageError: 'Enter 1–{pageCount}',
   *   // Tooltip of the zoom in button.
   *   zoomIn: 'Zoom in',
   *   // Tooltip of the zoom out button.
   *   zoomOut: 'Zoom out',
   *   // Zoom select item that fits the page width to the viewer.
   *   pageWidth: 'Page width',
   *   // Zoom select item that fits the whole page into the viewer.
   *   pageFit: 'Page fit'
   * }
   * ```
   *
   * @type {PdfViewerI18n | undefined}
   */
  get i18n() {
    return super.i18n;
  }

  set i18n(value) {
    super.i18n = value;
  }

  /** The node before which the toolbar controls are rendered into the light DOM. */
  #controlsMarker = document.createComment('');

  /** @protected */
  render() {
    return html`
      <div class="top-area" @focusin="${this.#onTopAreaFocusIn}">${this._renderToolbar()}</div>
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

  /** @protected */
  update(props) {
    super.update(props);

    // Children that the application adds later go after the marker, so that
    // rendering the controls again does not move or remove them.
    if (!this.hasUpdated) {
      this.appendChild(this.#controlsMarker);
    }
    render(this._renderToolbarControls(), this, { host: this, renderBefore: this.#controlsMarker });
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

  /**
   * Scrolls the toolbar so that a control focused with the keyboard is
   * visible with its focus ring. Browsers scroll only the focused element
   * into view, e.g. the input of a field, and WebKit does not scroll an
   * element that is partly visible already.
   * @private
   */
  #onTopAreaFocusIn(event) {
    if (isKeyboardActive()) {
      const control = event.composedPath().find((node) => node.parentNode === this);
      control?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  /** @private */
  #onContentFocusIn(event) {
    if (event.target === this.$.content) {
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
