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
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-rich-text-editor-popup.js';
import { html, LitElement, render } from 'lit';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { richTextEditorStyles } from './styles/vaadin-rich-text-editor-base-styles.js';
import { RichTextEditorMixin } from './vaadin-rich-text-editor-mixin.js';

/**
 * `<vaadin-rich-text-editor>` is a Web Component for rich text editing.
 * It provides a set of toolbar controls to apply formatting on the content,
 * which is stored and can be accessed as HTML5 or JSON string.
 *
 * ```html
 * <vaadin-rich-text-editor></vaadin-rich-text-editor>
 * ```
 *
 * Vaadin Rich Text Editor focuses on the structure, not the styling of content.
 * Therefore, the semantic HTML5 tags such as `<h1>`, `<strong>` and `<ul>` are used,
 * and CSS usage is limited to most common cases, like horizontal text alignment.
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------------------------
 * `disabled`   | Set to a disabled text editor
 * `readonly`   | Set to a readonly text editor
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                            | Description
 * -------------------------------------|----------------
 * `content`                            | The content wrapper
 * `toolbar`                            | The toolbar wrapper
 * `toolbar-group`                      | The group for toolbar controls
 * `toolbar-group-history`              | The group for history controls
 * `toolbar-group-emphasis`             | The group for emphasis controls
 * `toolbar-group-heading`              | The group for heading controls
 * `toolbar-group-style`                | The group for style controls
 * `toolbar-group-glyph-transformation` | The group for glyph transformation controls
 * `toolbar-group-list`                 | The group for list controls
 * `toolbar-group-indent`               | The group for indentation controls
 * `toolbar-group-alignment`            | The group for alignment controls
 * `toolbar-group-rich-text`            | The group for rich text controls
 * `toolbar-group-block`                | The group for preformatted block controls
 * `toolbar-group-format`               | The group for format controls
 * `toolbar-button`                     | The toolbar button (applies to all buttons)
 * `toolbar-button-pressed`             | The toolbar button in pressed state (applies to all buttons)
 * `toolbar-button-undo`                | The "undo" button
 * `toolbar-button-redo`                | The "redo" button
 * `toolbar-button-bold`                | The "bold" button
 * `toolbar-button-italic`              | The "italic" button
 * `toolbar-button-underline`           | The "underline" button
 * `toolbar-button-strike`              | The "strike-through" button
 * `toolbar-button-color`               | The "color" button
 * `toolbar-button-background`          | The "background" button
 * `toolbar-button-h1`                  | The "header 1" button
 * `toolbar-button-h2`                  | The "header 2" button
 * `toolbar-button-h3`                  | The "header 3" button
 * `toolbar-button-subscript`           | The "subscript" button
 * `toolbar-button-superscript`         | The "superscript" button
 * `toolbar-button-list-ordered`        | The "ordered list" button
 * `toolbar-button-list-bullet`         | The "bullet list" button
 * `toolbar-button-outdent`             | The "decrease indentation" button
 * `toolbar-button-indent`              | The "increase indentation" button
 * `toolbar-button-align-left`          | The "left align" button
 * `toolbar-button-align-center`        | The "center align" button
 * `toolbar-button-align-right`         | The "right align" button
 * `toolbar-button-image`               | The "image" button
 * `toolbar-button-link`                | The "link" button
 * `toolbar-button-blockquote`          | The "blockquote" button
 * `toolbar-button-code-block`          | The "code block" button
 * `toolbar-button-clean`               | The "clean formatting" button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} html-value-changed - Fired when the `htmlValue` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes RichTextEditorMixin
 * @mixes ThemableMixin
 */
class RichTextEditor extends RichTextEditorMixin(
  ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-rich-text-editor';
  }

  static get cvdlName() {
    return 'vaadin-rich-text-editor';
  }

  static get styles() {
    return richTextEditorStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-field-container">
        <!-- Label slot -->
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div class="vaadin-rich-text-editor-container">
          <!-- Create toolbar container -->
          <div part="toolbar" role="toolbar">
            <span part="toolbar-group toolbar-group-history">
              <!-- Undo and Redo -->
              <button
                id="btn-undo"
                type="button"
                part="toolbar-button toolbar-button-undo"
                aria-label="${this.__effectiveI18n.undo}"
                @click="${this._undo}"
              ></button>

              <button
                id="btn-redo"
                type="button"
                part="toolbar-button toolbar-button-redo"
                aria-label="${this.__effectiveI18n.redo}"
                @click="${this._redo}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-emphasis">
              <!-- Bold -->
              <button
                id="btn-bold"
                class="ql-bold"
                part="toolbar-button toolbar-button-bold"
                aria-label="${this.__effectiveI18n.bold}"
              ></button>

              <!-- Italic -->
              <button
                id="btn-italic"
                class="ql-italic"
                part="toolbar-button toolbar-button-italic"
                aria-label="${this.__effectiveI18n.italic}"
              ></button>

              <!-- Underline -->
              <button
                id="btn-underline"
                class="ql-underline"
                part="toolbar-button toolbar-button-underline"
                aria-label="${this.__effectiveI18n.underline}"
              ></button>

              <!-- Strike -->
              <button
                id="btn-strike"
                class="ql-strike"
                part="toolbar-button toolbar-button-strike"
                aria-label="${this.__effectiveI18n.strike}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-style">
              <!-- Color -->
              <button
                id="btn-color"
                type="button"
                part="toolbar-button toolbar-button-color"
                aria-label="${this.__effectiveI18n.color}"
                @click="${this.__onColorClick}"
              ></button>
              <!-- Background -->
              <button
                id="btn-background"
                type="button"
                part="toolbar-button toolbar-button-background"
                aria-label="${this.__effectiveI18n.background}"
                @click="${this.__onBackgroundClick}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-heading">
              <!-- Header buttons -->
              <button
                id="btn-h1"
                type="button"
                class="ql-header"
                value="1"
                part="toolbar-button toolbar-button-h1"
                aria-label="${this.__effectiveI18n.h1}"
              ></button>
              <button
                id="btn-h2"
                type="button"
                class="ql-header"
                value="2"
                part="toolbar-button toolbar-button-h2"
                aria-label="${this.__effectiveI18n.h2}"
              ></button>
              <button
                id="btn-h3"
                type="button"
                class="ql-header"
                value="3"
                part="toolbar-button toolbar-button-h3"
                aria-label="${this.__effectiveI18n.h3}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-glyph-transformation">
              <!-- Subscript and superscript -->
              <button
                id="btn-subscript"
                class="ql-script"
                value="sub"
                part="toolbar-button toolbar-button-subscript"
                aria-label="${this.__effectiveI18n.subscript}"
              ></button>
              <button
                id="btn-superscript"
                class="ql-script"
                value="super"
                part="toolbar-button toolbar-button-superscript"
                aria-label="${this.__effectiveI18n.superscript}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-list">
              <!-- List buttons -->
              <button
                id="btn-ol"
                type="button"
                class="ql-list"
                value="ordered"
                part="toolbar-button toolbar-button-list-ordered"
                aria-label="${this.__effectiveI18n.listOrdered}"
              ></button>
              <button
                id="btn-ul"
                type="button"
                class="ql-list"
                value="bullet"
                part="toolbar-button toolbar-button-list-bullet"
                aria-label="${this.__effectiveI18n.listBullet}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-indent">
              <!-- Decrease -->
              <button
                id="btn-outdent"
                type="button"
                class="ql-indent"
                value="-1"
                part="toolbar-button toolbar-button-outdent"
                aria-label="${this.__effectiveI18n.outdent}"
              ></button>
              <!-- Increase -->
              <button
                id="btn-indent"
                type="button"
                class="ql-indent"
                value="+1"
                part="toolbar-button toolbar-button-indent"
                aria-label="${this.__effectiveI18n.indent}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-alignment">
              <!-- Align buttons -->
              <button
                id="btn-left"
                type="button"
                class="ql-align"
                value=""
                part="toolbar-button toolbar-button-align-left"
                aria-label="${this.__effectiveI18n.alignLeft}"
              ></button>
              <button
                id="btn-center"
                type="button"
                class="ql-align"
                value="center"
                part="toolbar-button toolbar-button-align-center"
                aria-label="${this.__effectiveI18n.alignCenter}"
              ></button>
              <button
                id="btn-right"
                type="button"
                class="ql-align"
                value="right"
                part="toolbar-button toolbar-button-align-right"
                aria-label="${this.__effectiveI18n.alignRight}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-rich-text">
              <!-- Image -->
              <button
                id="btn-image"
                type="button"
                part="toolbar-button toolbar-button-image"
                aria-label="${this.__effectiveI18n.image}"
                @touchend="${this._onImageTouchEnd}"
                @click="${this._onImageClick}"
              ></button>
              <!-- Link -->
              <button
                id="btn-link"
                type="button"
                part="toolbar-button toolbar-button-link"
                aria-label="${this.__effectiveI18n.link}"
                @click="${this._onLinkClick}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-block">
              <!-- Blockquote -->
              <button
                id="btn-blockquote"
                type="button"
                class="ql-blockquote"
                part="toolbar-button toolbar-button-blockquote"
                aria-label="${this.__effectiveI18n.blockquote}"
              ></button>
              <!-- Code block -->
              <button
                id="btn-code"
                type="button"
                class="ql-code-block"
                part="toolbar-button toolbar-button-code-block"
                aria-label="${this.__effectiveI18n.codeBlock}"
              ></button>
            </span>

            <span part="toolbar-group toolbar-group-format">
              <!-- Clean -->
              <button
                id="btn-clean"
                type="button"
                class="ql-clean"
                part="toolbar-button toolbar-button-clean"
                aria-label="${this.__effectiveI18n.clean}"
              ></button>
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

        <!-- Helper text slot -->
        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <!-- Error message slot -->
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>

      <slot name="link-dialog"></slot>

      <slot name="color-popup"></slot>

      <slot name="background-popup"></slot>
    `;
  }

  /**
   * Override update to render slotted overlays into light DOM after rendering shadow DOM.
   * @param changedProperties
   * @protected
   */
  update(changedProperties) {
    super.update(changedProperties);

    this.__renderSlottedOverlays();
  }

  /** @private */
  __renderSlottedOverlays() {
    render(
      html`
        <vaadin-confirm-dialog
          slot="link-dialog"
          cancel-button-visible
          reject-theme="error"
          .opened="${this._linkEditing}"
          .header="${this.__effectiveI18n.linkDialogTitle}"
          .confirmText="${this.__effectiveI18n.ok}"
          .rejectText="${this.__effectiveI18n.remove}"
          .cancelText="${this.__effectiveI18n.cancel}"
          .rejectButtonVisible="${!!this._linkRange}"
          @confirm="${this._onLinkEditConfirm}"
          @cancel="${this._onLinkEditCancel}"
          @reject="${this._onLinkEditRemove}"
          @opened-changed="${this._onLinkEditingChanged}"
        >
          <vaadin-text-field
            .value="${this._linkUrl}"
            style="width: 100%;"
            @keydown="${this._onLinkKeydown}"
            @value-changed="${this._onLinkUrlChanged}"
          ></vaadin-text-field>
        </vaadin-confirm-dialog>

        <vaadin-rich-text-editor-popup
          slot="color-popup"
          .colors="${['#000000', ...[...this.colorOptions].filter((c) => c !== '#000000')]}"
          .opened="${this._colorEditing}"
          @color-selected="${this.__onColorSelected}"
          @opened-changed="${this.__onColorEditingChanged}"
        ></vaadin-rich-text-editor-popup>

        <vaadin-rich-text-editor-popup
          slot="background-popup"
          .colors="${['#ffffff', ...[...this.colorOptions].filter((c) => c !== '#ffffff')]}"
          .opened="${this._backgroundEditing}"
          @color-selected="${this.__onBackgroundSelected}"
          @opened-changed="${this.__onBackgroundEditingChanged}"
        ></vaadin-rich-text-editor-popup>
      `,
      this,
      { host: this },
    );
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
    // Autofocus the URL field when the dialog opens
    if (event.detail.value) {
      const confirmDialog = event.target;
      const urlField = confirmDialog.querySelector('vaadin-text-field');
      confirmDialog.$.overlay.addEventListener(
        'vaadin-overlay-open',
        () => {
          urlField.focus({ focusVisible: isKeyboardActive() });
        },
        { once: true },
      );
    }
    this._linkEditing = event.detail.value;
  }

  /** @private */
  _onLinkUrlChanged(event) {
    this._linkUrl = event.detail.value;
  }
}

defineCustomElement(RichTextEditor);

export { RichTextEditor };
