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
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { icons } from './styles/vaadin-pdf-viewer-base-icons.js';
import { pdfViewerStyles } from './styles/vaadin-pdf-viewer-base-styles.js';
import { pdfViewerFindStyles } from './styles/vaadin-pdf-viewer-find-base-styles.js';
import { pdfViewerPageStyles } from './styles/vaadin-pdf-viewer-page-base-styles.js';
import { pdfViewerToolbarStyles } from './styles/vaadin-pdf-viewer-toolbar-base-styles.js';
import { PdfViewerFindMixin } from './vaadin-pdf-viewer-find-mixin.js';
import { PdfViewerMixin } from './vaadin-pdf-viewer-mixin.js';
import { PdfViewerPrintMixin } from './vaadin-pdf-viewer-print-mixin.js';
import { PdfViewerToolbarMixin } from './vaadin-pdf-viewer-toolbar-mixin.js';

const DEFAULT_I18N = {
  loadError: 'The document could not be loaded.',
  passwordError: 'Password-protected documents are not supported.',
  toolbar: 'PDF toolbar',
  toolbarToggle: 'Toolbar',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: 'Page',
  pageOf: 'Page of {pageCount}',
  pageError: 'Enter 1–{pageCount}',
  pageAnnouncement: 'Page {page} of {pageCount}',
  zoom: 'Zoom',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  pageWidth: 'Page width',
  pageFit: 'Page fit',
  document: 'PDF document',
  pages: 'Pages',
  pageLabel: 'Page {page}',
  link: 'Link',
  goToPage: 'Go to page {page}',
  externalLink: '{text} (opens in a new tab)',
  download: 'Download',
  find: 'Find in document',
  previousMatch: 'Previous match',
  nextMatch: 'Next match',
  closeFind: 'Close find',
  findResult: '{current} of {total}',
  findResultAnnouncement: '{current} of {total}, page {page}',
  findNoMatches: 'No matches',
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
 * `toolbar-actions` | Slot for application controls, e.g. buttons, at the end of the toolbar, before the built-in buttons
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|------------
 * `header`        | The header above the toolbar, with the title and the button that collapses the toolbar, see `headerVisible`.
 * `title`         | The title in the header.
 * `toolbar`       | The toolbar above the pages.
 * `toolbar-group` | A group of related controls in the toolbar: navigation, viewing options and actions.
 * `zoom-controls` | The zoom select with the zoom out and zoom in buttons. Also has the `disabled` part name without a document.
 * `find-bar`      | The panel with the controls for finding text, shown over the top end of the pages.
 * `content`       | The scrollable area that contains the pages.
 * `page`          | A page of the document.
 * `error-message` | The message shown when the document could not be loaded.
 * `loader`        | The loading indicator shown while the document loads.
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|------------
 * `loading`   | Set while the document is loading.
 * `has-error` | Set when the document could not be loaded.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                |
 * :---------------------------------------------------|
 * | `--vaadin-pdf-viewer-background`                  |
 * | `--vaadin-pdf-viewer-border-color`                |
 * | `--vaadin-pdf-viewer-border-radius`               |
 * | `--vaadin-pdf-viewer-current-match-background`    |
 * | `--vaadin-pdf-viewer-current-match-outline-color` |
 * | `--vaadin-pdf-viewer-error-color`                 |
 * | `--vaadin-pdf-viewer-find-field-width`            |
 * | `--vaadin-pdf-viewer-icon-close`                  |
 * | `--vaadin-pdf-viewer-icon-collapse-toolbar`       |
 * | `--vaadin-pdf-viewer-icon-download`               |
 * | `--vaadin-pdf-viewer-icon-expand-toolbar`         |
 * | `--vaadin-pdf-viewer-icon-find`                   |
 * | `--vaadin-pdf-viewer-icon-next-match`             |
 * | `--vaadin-pdf-viewer-icon-next-page`              |
 * | `--vaadin-pdf-viewer-icon-previous-match`         |
 * | `--vaadin-pdf-viewer-icon-previous-page`          |
 * | `--vaadin-pdf-viewer-icon-zoom-in`                |
 * | `--vaadin-pdf-viewer-icon-zoom-out`               |
 * | `--vaadin-pdf-viewer-match-background`            |
 * | `--vaadin-pdf-viewer-padding`                     |
 * | `--vaadin-pdf-viewer-page-background`             |
 * | `--vaadin-pdf-viewer-page-field-width`            |
 * | `--vaadin-pdf-viewer-page-gap`                    |
 * | `--vaadin-pdf-viewer-page-shadow`                 |
 * | `--vaadin-pdf-viewer-selection-background`        |
 * | `--vaadin-pdf-viewer-text-color`                  |
 * | `--vaadin-pdf-viewer-toolbar-background`          |
 * | `--vaadin-pdf-viewer-toolbar-gap`                 |
 * | `--vaadin-pdf-viewer-toolbar-padding`             |
 * | `--vaadin-pdf-viewer-zoom-select-width`           |
 *
 * The `--vaadin-pdf-viewer-icon-*` properties take an image (e.g. an SVG data URL) used as a mask.
 * In the Lumo theme, they take a glyph of the `lumo-icons` font instead, like the icons of `<vaadin-map>`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} find-result - Fired when finding text, with `find()` or in the find bar, has gone through the document.
 * @fires {CustomEvent} page-changed - Fired when the `page` property changes.
 * @fires {CustomEvent} page-count-changed - Fired when the `pageCount` property changes.
 * @fires {CustomEvent} toolbar-collapsed-changed - Fired when the `toolbarCollapsed` property changes.
 * @fires {CustomEvent} zoom-changed - Fired when the `zoom` property changes.
 *
 * @customElement vaadin-pdf-viewer
 * @extends HTMLElement
 */
class PdfViewer extends PdfViewerPrintMixin(
  PdfViewerFindMixin(
    PdfViewerToolbarMixin(PdfViewerMixin(I18nMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))))),
  ),
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
    return [icons, pdfViewerStyles, pdfViewerToolbarStyles, pdfViewerFindStyles, pdfViewerPageStyles];
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get defaultI18n() {
    return DEFAULT_I18N;
  }

  /**
   * The object used to localize this component. To change the default
   * localization, set this to an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Message shown when the document could not be loaded.
   *   loadError: 'The document could not be loaded.',
   *   // Message shown when the document is password-protected.
   *   passwordError: 'Password-protected documents are not supported.',
   *   // Accessible label of the toolbar.
   *   toolbar: 'PDF toolbar',
   *   // Accessible label and tooltip of the button in the header that
   *   // collapses and expands the toolbar, see `headerVisible`.
   *   toolbarToggle: 'Toolbar',
   *   // Accessible labels and tooltips of the page navigation buttons.
   *   previousPage: 'Previous page',
   *   nextPage: 'Next page',
   *   // Accessible label of the page number field, without and with a document.
   *   // {pageCount} is replaced with the number of pages.
   *   page: 'Page',
   *   pageOf: 'Page of {pageCount}',
   *   // Error message of the page number field for a page that does not exist.
   *   // {pageCount} is replaced with the number of pages.
   *   pageError: 'Enter 1–{pageCount}',
   *   // Announced when the viewer's own controls, keyboard shortcuts or links change the page.
   *   // {page} and {pageCount} are replaced with the page number and the number of pages.
   *   pageAnnouncement: 'Page {page} of {pageCount}',
   *   // Accessible label of the zoom select.
   *   zoom: 'Zoom',
   *   // Accessible labels and tooltips of the zoom buttons.
   *   zoomIn: 'Zoom in',
   *   zoomOut: 'Zoom out',
   *   // Labels of the zoom levels that fit the page to the viewer.
   *   pageWidth: 'Page width',
   *   pageFit: 'Page fit',
   *   // Accessible name of the viewer and text of the header when the
   *   // document has no name. The application can set aria-label or
   *   // aria-labelledby to name the viewer instead.
   *   document: 'PDF document',
   *   // Accessible name of the scrollable area that contains the pages.
   *   pages: 'Pages',
   *   // Accessible name of each page. {page} is replaced with the page number.
   *   pageLabel: 'Page {page}',
   *   // Accessible names of links to another place in the document that have no text.
   *   // {page} is replaced with the number of the page the link goes to.
   *   goToPage: 'Go to page {page}',
   *   link: 'Link',
   *   // Accessible name of links that open in a new tab.
   *   // {text} is replaced with the text of the link, or its URL.
   *   externalLink: '{text} (opens in a new tab)',
   *   // Accessible label and tooltip of the download button.
   *   download: 'Download',
   *   // Accessible label of the find button, the find bar and the find field,
   *   // tooltip of the find button and placeholder of the find field.
   *   find: 'Find in document',
   *   // Accessible labels and tooltips of the find bar buttons.
   *   previousMatch: 'Previous match',
   *   nextMatch: 'Next match',
   *   closeFind: 'Close find',
   *   // Shown in the find field when finding text.
   *   // {current} and {total} are replaced with the number of the current match and the number of matches.
   *   findResult: '{current} of {total}',
   *   // Announced when moving to a match. {page} is replaced with the page of the match.
   *   findResultAnnouncement: '{current} of {total}, page {page}',
   *   // Shown in the find field and announced when the text is not found.
   *   findNoMatches: 'No matches'
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
    const i18n = this.__effectiveI18n;
    return html`
      ${this._renderToolbar()}
      <div part="loader"></div>
      <div class="content-area">
        ${this._renderFindBar()}
        <div
          id="content"
          part="content"
          tabindex="${this.pageCount ? '0' : '-1'}"
          aria-busy="${this._loading ? 'true' : 'false'}"
          role="document"
          aria-label="${i18n.pages}"
        >
          <div id="pages"></div>
        </div>
        <div class="content-focus-ring"></div>
      </div>
      <div part="error-message" ?hidden="${!this._errorReason}">
        ${this._errorReason === 'password' ? i18n.passwordError : i18n.loadError}
      </div>
    `;
  }

  /**
   * Override method from `LitElement` to render the toolbar controls into
   * the light DOM after rendering the shadow DOM.
   * @protected
   * @override
   */
  update(props) {
    super.update(props);

    // Children that the application adds later go after the marker, so that
    // rendering the controls again does not move or remove them. Lit keeps
    // the rendered controls on the marker, so a new marker replaces one that
    // the application removed, e.g. with `replaceChildren()`.
    if (this.#controlsMarker.parentNode !== this) {
      this.#controlsMarker = document.createComment('');
      this.appendChild(this.#controlsMarker);
    }
    render(html`${this._renderToolbarControls()}${this._renderFindControls()}${this._renderPrintControls()}`, this, {
      host: this,
      renderBefore: this.#controlsMarker,
    });
  }
}

defineCustomElement(PdfViewer);

export { PdfViewer };
