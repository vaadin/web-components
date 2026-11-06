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
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { pdfViewerButtonStyles } from './styles/vaadin-pdf-viewer-button-base-styles.js';

/**
 * An element used internally by `<vaadin-pdf-viewer>`. Not intended to be used separately.
 *
 * An icon-only button of the PDF viewer toolbar. The `icon` attribute selects the icon.
 *
 * @customElement vaadin-pdf-viewer-button
 * @extends HTMLElement
 * @private
 */
class PdfViewerButton extends ButtonMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-pdf-viewer-button';
  }

  static get experimental() {
    return 'pdfViewerComponent';
  }

  static get styles() {
    return [buttonStyles, pdfViewerButtonStyles];
  }

  /**
   * Override method from `LitElement` to render the icon of the button.
   * @protected
   * @override
   */
  render() {
    return html`
      <div class="vaadin-button-container" role="presentation">
        <span part="icon" aria-hidden="true"></span>
        <slot name="tooltip"></slot>
      </div>
    `;
  }

  /**
   * Override method from `PolylitMixin` to show a tooltip slotted into the button for it.
   * @protected
   * @override
   */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }
}

defineCustomElement(PdfViewerButton);

export { PdfViewerButton };
