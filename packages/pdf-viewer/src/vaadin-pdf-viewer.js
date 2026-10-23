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
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { pdfViewerStyles } from './styles/vaadin-pdf-viewer-base-styles.js';

/**
 * `<vaadin-pdf-viewer>` is a web component for viewing PDF documents.
 *
 * ```html
 * <vaadin-pdf-viewer></vaadin-pdf-viewer>
 * ```
 *
 * @customElement vaadin-pdf-viewer
 * @extends HTMLElement
 */
class PdfViewer extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
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
    return pdfViewerStyles;
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(PdfViewer);

export { PdfViewer };
