/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RichTextEditorPopupMixin } from './vaadin-rich-text-editor-popup-mixin.js';

/**
 * An element used internally by `<vaadin-rich-text-editor>`. Not intended to be used separately.
 * @private
 */
class RichTextEditorPopup extends RichTextEditorPopupMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-rich-text-editor-popup';
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-rich-text-editor-popup-overlay
        .renderer="${this.renderer}"
        .opened="${this.opened}"
        .positionTarget="${this.target}"
        no-vertical-overlap
        horizontal-align="start"
        vertical-align="top"
        focus-trap
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-escape-press="${this._onOverlayEscapePress}"
      ></vaadin-rich-text-editor-popup-overlay>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }
}

defineCustomElement(RichTextEditorPopup);

export { RichTextEditorPopup };

/**
 * An element used internally by `<vaadin-rich-text-editor>`. Not intended to be used separately.
 * @private
 */
class RichTextEditorPopupOverlay extends PositionMixin(
  OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-rich-text-editor-popup-overlay';
  }

  static get styles() {
    return overlayStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(RichTextEditorPopupOverlay);
