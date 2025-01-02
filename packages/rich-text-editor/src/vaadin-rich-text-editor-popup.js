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
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RichTextEditorPopupMixin } from './vaadin-rich-text-editor-popup-mixin.js';

registerStyles('vaadin-rich-text-editor-popup-overlay', [overlayStyles], {
  moduleId: 'vaadin-rich-text-editor-popup-overlay-styles',
});

/**
 * An element used internally by `<vaadin-rich-text-editor>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes RichTextEditorPopupMixin
 * @private
 */
class RichTextEditorPopup extends RichTextEditorPopupMixin(PolymerElement) {
  static get is() {
    return 'vaadin-rich-text-editor-popup';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
      <vaadin-rich-text-editor-popup-overlay
        renderer="[[renderer]]"
        opened="{{opened}}"
        position-target="[[target]]"
        no-vertical-overlap
        horizontal-align="start"
        vertical-align="top"
        on-vaadin-overlay-escape-press="_onOverlayEscapePress"
        focus-trap
      ></vaadin-rich-text-editor-popup-overlay>
    `;
  }
}

defineCustomElement(RichTextEditorPopup);

export { RichTextEditorPopup };

/**
 * An element used internally by `<vaadin-rich-text-editor>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @private
 */
class RichTextEditorPopupOverlay extends PositionMixin(OverlayMixin(DirMixin(ThemableMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-rich-text-editor-popup-overlay';
  }

  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(RichTextEditorPopupOverlay);
