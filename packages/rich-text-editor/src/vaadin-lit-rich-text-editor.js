/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/button/src/vaadin-lit-button.js';
import '@vaadin/confirm-dialog/src/vaadin-lit-confirm-dialog.js';
import '@vaadin/text-field/src/vaadin-lit-text-field.js';
import '@vaadin/tooltip/src/vaadin-lit-tooltip.js';
import './vaadin-lit-rich-text-editor-popup.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RichTextEditorMixin } from './vaadin-rich-text-editor-mixin.js';
import { richTextEditorStyles } from './vaadin-rich-text-editor-styles.js';

/**
 * LitElement based version of `<vaadin-rich-text-editor>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class RichTextEditor extends RichTextEditorMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-rich-text-editor';
  }

  static get cvdlName() {
    return 'vaadin-rich-text-editor';
  }

  static get styles() {
    return richTextEditorStyles;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-rich-text-editor-container">
        <!-- Create toolbar container -->
        <div part="toolbar" role="toolbar">
          <span part="toolbar-group toolbar-group-history">
            <!-- Undo and Redo -->
            <button
              id="btn-undo"
              type="button"
              part="toolbar-button toolbar-button-undo"
              @click="${this._undo}"
            ></button>
            <vaadin-tooltip for="btn-undo" .text="${this.i18n.undo}"></vaadin-tooltip>

            <button
              id="btn-redo"
              type="button"
              part="toolbar-button toolbar-button-redo"
              @click="${this._redo}"
            ></button>
            <vaadin-tooltip for="btn-redo" .text="${this.i18n.redo}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-emphasis">
            <!-- Bold -->
            <button id="btn-bold" class="ql-bold" part="toolbar-button toolbar-button-bold"></button>
            <vaadin-tooltip for="btn-bold" .text="${this.i18n.bold}"></vaadin-tooltip>

            <!-- Italic -->
            <button id="btn-italic" class="ql-italic" part="toolbar-button toolbar-button-italic"></button>
            <vaadin-tooltip for="btn-italic" .text="${this.i18n.italic}"></vaadin-tooltip>

            <!-- Underline -->
            <button id="btn-underline" class="ql-underline" part="toolbar-button toolbar-button-underline"></button>
            <vaadin-tooltip for="btn-underline" .text="${this.i18n.underline}"></vaadin-tooltip>

            <!-- Strike -->
            <button id="btn-strike" class="ql-strike" part="toolbar-button toolbar-button-strike"></button>
            <vaadin-tooltip for="btn-strike" .text="${this.i18n.strike}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-style">
            <!-- Color -->
            <button
              id="btn-color"
              type="button"
              part="toolbar-button toolbar-button-color"
              @click="${this.__onColorClick}"
            ></button>
            <vaadin-tooltip for="btn-color" .text="${this.i18n.color}"></vaadin-tooltip>
            <!-- Background -->
            <button
              id="btn-background"
              type="button"
              part="toolbar-button toolbar-button-background"
              @click="${this.__onBackgroundClick}"
            ></button>
            <vaadin-tooltip for="btn-background" .text="${this.i18n.background}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-heading">
            <!-- Header buttons -->
            <button
              id="btn-h1"
              type="button"
              class="ql-header"
              value="1"
              part="toolbar-button toolbar-button-h1"
            ></button>
            <vaadin-tooltip for="btn-h1" .text="${this.i18n.h1}"></vaadin-tooltip>
            <button
              id="btn-h2"
              type="button"
              class="ql-header"
              value="2"
              part="toolbar-button toolbar-button-h2"
            ></button>
            <vaadin-tooltip for="btn-h2" .text="${this.i18n.h2}"></vaadin-tooltip>
            <button
              id="btn-h3"
              type="button"
              class="ql-header"
              value="3"
              part="toolbar-button toolbar-button-h3"
            ></button>
            <vaadin-tooltip for="btn-h3" .text="${this.i18n.h3}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-glyph-transformation">
            <!-- Subscript and superscript -->
            <button
              id="btn-subscript"
              class="ql-script"
              value="sub"
              part="toolbar-button toolbar-button-subscript"
            ></button>
            <vaadin-tooltip for="btn-subscript" .text="${this.i18n.subscript}"></vaadin-tooltip>
            <button
              id="btn-superscript"
              class="ql-script"
              value="super"
              part="toolbar-button toolbar-button-superscript"
            ></button>
            <vaadin-tooltip for="btn-superscript" text="${this.i18n.superscript}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-list">
            <!-- List buttons -->
            <button
              id="btn-ol"
              type="button"
              class="ql-list"
              value="ordered"
              part="toolbar-button toolbar-button-list-ordered"
            ></button>
            <vaadin-tooltip for="btn-ol" text="${this.i18n.listOrdered}"></vaadin-tooltip>
            <button
              id="btn-ul"
              type="button"
              class="ql-list"
              value="bullet"
              part="toolbar-button toolbar-button-list-bullet"
            ></button>
            <vaadin-tooltip for="btn-ul" text="${this.i18n.listBullet}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-alignment">
            <!-- Align buttons -->
            <button
              id="btn-left"
              type="button"
              class="ql-align"
              value=""
              part="toolbar-button toolbar-button-align-left"
            ></button>
            <vaadin-tooltip for="btn-left" .text="${this.i18n.alignLeft}"></vaadin-tooltip>
            <button
              id="btn-center"
              type="button"
              class="ql-align"
              value="center"
              part="toolbar-button toolbar-button-align-center"
            ></button>
            <vaadin-tooltip for="btn-center" .text="${this.i18n.alignCenter}"></vaadin-tooltip>
            <button
              id="btn-right"
              type="button"
              class="ql-align"
              value="right"
              part="toolbar-button toolbar-button-align-right"
            ></button>
            <vaadin-tooltip for="btn-right" .text="${this.i18n.alignRight}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-rich-text">
            <!-- Image -->
            <button
              id="btn-image"
              type="button"
              part="toolbar-button toolbar-button-image"
              @touchend="${this._onImageTouchEnd}"
              @click="${this._onImageClick}"
            ></button>
            <vaadin-tooltip for="btn-image" .text="${this.i18n.image}"></vaadin-tooltip>
            <!-- Link -->
            <button
              id="btn-link"
              type="button"
              part="toolbar-button toolbar-button-link"
              @click="${this._onLinkClick}"
            ></button>
            <vaadin-tooltip for="btn-link" .text="${this.i18n.link}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-block">
            <!-- Blockquote -->
            <button
              id="btn-blockquote"
              type="button"
              class="ql-blockquote"
              part="toolbar-button toolbar-button-blockquote"
            ></button>
            <vaadin-tooltip for="btn-blockquote" .text="${this.i18n.blockquote}"></vaadin-tooltip>
            <!-- Code block -->
            <button
              id="btn-code"
              type="button"
              class="ql-code-block"
              part="toolbar-button toolbar-button-code-block"
            ></button>
            <vaadin-tooltip for="btn-code" .text="${this.i18n.codeBlock}"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-format">
            <!-- Clean -->
            <button id="btn-clean" type="button" class="ql-clean" part="toolbar-button toolbar-button-clean"></button>
            <vaadin-tooltip for="btn-clean" .text="${this.i18n.clean}"></vaadin-tooltip>
          </span>

          <input
            id="fileInput"
            type="file"
            accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
            @change="${this._uploadImage}"
          />
        </div>

        <div part="content"></div>

        <div class="announcer" aria-live="polite"></div>
      </div>

      <vaadin-confirm-dialog
        id="linkDialog"
        .opened="${this._linkEditing}"
        .header="${this.i18n.linkDialogTitle}"
        @opened-changed="${this._onLinkEditingChanged}"
      >
        <vaadin-text-field
          id="linkUrl"
          .value="${this._linkUrl}"
          style="width: 100%;"
          @keydown="${this._onLinkKeydown}"
          @value-changed="${this._onLinkUrlChanged}"
        ></vaadin-text-field>
        <vaadin-button id="confirmLink" slot="confirm-button" theme="primary" @click="${this._onLinkEditConfirm}">
          ${this.i18n.ok}
        </vaadin-button>
        <vaadin-button
          id="removeLink"
          slot="reject-button"
          theme="error"
          @click="${this._onLinkEditRemove}"
          ?hidden="${!this._linkRange}"
        >
          ${this.i18n.remove}
        </vaadin-button>
        <vaadin-button id="cancelLink" slot="cancel-button" @click="${this._onLinkEditCancel}">
          ${this.i18n.cancel}
        </vaadin-button>
      </vaadin-confirm-dialog>

      <vaadin-rich-text-editor-popup
        id="colorPopup"
        .colors="${this.colorOptions}"
        .opened="${this._colorEditing}"
        @color-selected="${this.__onColorSelected}"
        @opened-changed="${this.__onColorEditingChanged}"
      ></vaadin-rich-text-editor-popup>

      <vaadin-rich-text-editor-popup
        id="backgroundPopup"
        .colors="${this.colorOptions}"
        .opened="${this._backgroundEditing}"
        @color-selected="${this.__onBackgroundSelected}"
        @opened-changed="${this.__onBackgroundEditingChanged}"
      ></vaadin-rich-text-editor-popup>
    `;
  }

  /** @private */
  __onBackgroundEditingChanged(event) {
    this._backgroundEditing = event.detail.value;
  }

  /** @private */
  __onColorEditingChanged(event) {
    this._colorEditing = event.detail.value;
  }

  /** @private */
  _onLinkEditingChanged(event) {
    this._linkEditing = event.detail.value;
  }

  /** @private */
  _onLinkUrlChanged(event) {
    this._linkUrl = event.detail.value;
  }
}

defineCustomElement(RichTextEditor);

export { RichTextEditor };
