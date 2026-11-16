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
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { pdfViewerIcons } from './styles/vaadin-pdf-viewer-base-icons.js';
import { pdfViewerIconStyles } from './styles/vaadin-pdf-viewer-icon-base-styles.js';

/**
 * An element used internally by `<vaadin-pdf-viewer>`. Not intended to be used separately.
 *
 * @customElement vaadin-pdf-viewer-icon
 * @extends HTMLElement
 * @private
 */
class PdfViewerIcon extends LumoInjectionMixin(LitElement) {
  static get is() {
    return 'vaadin-pdf-viewer-icon';
  }

  static get experimental() {
    return 'pdfViewerComponent';
  }

  static get styles() {
    return [pdfViewerIcons, pdfViewerIconStyles];
  }
}

defineCustomElement(PdfViewerIcon);

export { PdfViewerIcon };
