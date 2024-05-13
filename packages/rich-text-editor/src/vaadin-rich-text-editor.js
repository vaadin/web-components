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
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-rich-text-editor-popup.js';
import './vaadin-rich-text-editor-toolbar-styles.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RichTextEditorMixin } from './vaadin-rich-text-editor-mixin.js';
import { richTextEditorStyles } from './vaadin-rich-text-editor-styles.js';

registerStyles('vaadin-rich-text-editor', richTextEditorStyles, { moduleId: 'vaadin-rich-text-editor-styles' });

/**
 * `<vaadin-rich-text-editor>` is a Web Component for rich text editing.
 * It provides a set of toolbar controls to apply formatting on the content,
 * which is stored and can be accessed as HTML5 or JSON string.
 *
 * ```
 * <vaadin-rich-text-editor></vaadin-rich-text-editor>
 * ```
 *
 * Vaadin Rich Text Editor focuses on the structure, not the styling of content.
 * Therefore, the semantic HTML5 tags such as <h1>, <strong> and <ul> are used,
 * and CSS usage is limited to most common cases, like horizontal text alignment.
 *
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `disabled`   | Set to a disabled text editor | :host
 * `readonly`   | Set to a readonly text editor | :host
 * `on`         | Set to a toolbar button applied to the selected text | toolbar-button
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                            | Description
 * -------------------------------------|----------------
 * `content`                            | The content wrapper
 * `toolbar`                            | The toolbar wrapper
 * `toolbar-group`                      | The group for toolbar controls
 * `toolbar-group-history`              | The group for histroy controls
 * `toolbar-group-emphasis`             | The group for emphasis controls
 * `toolbar-group-heading`              | The group for heading controls
 * `toolbar-group-style`                | The group for style controls
 * `toolbar-group-glyph-transformation` | The group for glyph transformation controls
 * `toolbar-group-group-list`           | The group for group list controls
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
class RichTextEditor extends RichTextEditorMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <div class="vaadin-rich-text-editor-container">
        <!-- Create toolbar container -->
        <div part="toolbar" role="toolbar">
          <span part="toolbar-group toolbar-group-history">
            <!-- Undo and Redo -->
            <button id="btn-undo" type="button" part="toolbar-button toolbar-button-undo" on-click="_undo"></button>
            <vaadin-tooltip for="btn-undo" text="[[i18n.undo]]"></vaadin-tooltip>

            <button id="btn-redo" type="button" part="toolbar-button toolbar-button-redo" on-click="_redo"></button>
            <vaadin-tooltip for="btn-redo" text="[[i18n.redo]]"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-emphasis">
            <!-- Bold -->
            <button id="btn-bold" class="ql-bold" part="toolbar-button toolbar-button-bold"></button>
            <vaadin-tooltip for="btn-bold" text="[[i18n.bold]]"></vaadin-tooltip>

            <!-- Italic -->
            <button id="btn-italic" class="ql-italic" part="toolbar-button toolbar-button-italic"></button>
            <vaadin-tooltip for="btn-italic" text="[[i18n.italic]]"></vaadin-tooltip>

            <!-- Underline -->
            <button id="btn-underline" class="ql-underline" part="toolbar-button toolbar-button-underline"></button>
            <vaadin-tooltip for="btn-underline" text="[[i18n.underline]]"></vaadin-tooltip>

            <!-- Strike -->
            <button id="btn-strike" class="ql-strike" part="toolbar-button toolbar-button-strike"></button>
            <vaadin-tooltip for="btn-strike" text="[[i18n.strike]]"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-style">
            <!-- Color -->
            <button
              id="btn-color"
              type="button"
              part="toolbar-button toolbar-button-color"
              on-click="__onColorClick"
            ></button>
            <vaadin-tooltip for="btn-color" text="[[i18n.color]]"></vaadin-tooltip>
            <!-- Background -->
            <button
              id="btn-background"
              type="button"
              part="toolbar-button toolbar-button-background"
              on-click="__onBackgroundClick"
            ></button>
            <vaadin-tooltip for="btn-background" text="[[i18n.background]]"></vaadin-tooltip>
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
            <vaadin-tooltip for="btn-h1" text="[[i18n.h1]]"></vaadin-tooltip>
            <button
              id="btn-h2"
              type="button"
              class="ql-header"
              value="2"
              part="toolbar-button toolbar-button-h2"
            ></button>
            <vaadin-tooltip for="btn-h2" text="[[i18n.h2]]"></vaadin-tooltip>
            <button
              id="btn-h3"
              type="button"
              class="ql-header"
              value="3"
              part="toolbar-button toolbar-button-h3"
            ></button>
            <vaadin-tooltip for="btn-h3" text="[[i18n.h3]]"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-glyph-transformation">
            <!-- Subscript and superscript -->
            <button
              id="btn-subscript"
              class="ql-script"
              value="sub"
              part="toolbar-button toolbar-button-subscript"
            ></button>
            <vaadin-tooltip for="btn-subscript" text="[[i18n.subscript]]"></vaadin-tooltip>
            <button
              id="btn-superscript"
              class="ql-script"
              value="super"
              part="toolbar-button toolbar-button-superscript"
            ></button>
            <vaadin-tooltip for="btn-superscript" text="[[i18n.superscript]]"></vaadin-tooltip>
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
            <vaadin-tooltip for="btn-ol" text="[[i18n.listOrdered]]"></vaadin-tooltip>
            <button
              id="btn-ul"
              type="button"
              class="ql-list"
              value="bullet"
              part="toolbar-button toolbar-button-list-bullet"
            ></button>
            <vaadin-tooltip for="btn-ul" text="[[i18n.listBullet]]"></vaadin-tooltip>
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
            <vaadin-tooltip for="btn-left" text="[[i18n.alignLeft]]"></vaadin-tooltip>
            <button
              id="btn-center"
              type="button"
              class="ql-align"
              value="center"
              part="toolbar-button toolbar-button-align-center"
            ></button>
            <vaadin-tooltip for="btn-center" text="[[i18n.alignCenter]]"></vaadin-tooltip>
            <button
              id="btn-right"
              type="button"
              class="ql-align"
              value="right"
              part="toolbar-button toolbar-button-align-right"
            ></button>
            <vaadin-tooltip for="btn-right" text="[[i18n.alignRight]]"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-rich-text">
            <!-- Image -->
            <button
              id="btn-image"
              type="button"
              part="toolbar-button toolbar-button-image"
              on-touchend="_onImageTouchEnd"
              on-click="_onImageClick"
            ></button>
            <vaadin-tooltip for="btn-image" text="[[i18n.image]]"></vaadin-tooltip>
            <!-- Link -->
            <button
              id="btn-link"
              type="button"
              part="toolbar-button toolbar-button-link"
              on-click="_onLinkClick"
            ></button>
            <vaadin-tooltip for="btn-link" text="[[i18n.link]]"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-block">
            <!-- Blockquote -->
            <button
              id="btn-blockquote"
              type="button"
              class="ql-blockquote"
              part="toolbar-button toolbar-button-blockquote"
            ></button>
            <vaadin-tooltip for="btn-blockquote" text="[[i18n.blockquote]]"></vaadin-tooltip>
            <!-- Code block -->
            <button
              id="btn-code"
              type="button"
              class="ql-code-block"
              part="toolbar-button toolbar-button-code-block"
            ></button>
            <vaadin-tooltip for="btn-code" text="[[i18n.codeBlock]]"></vaadin-tooltip>
          </span>

          <span part="toolbar-group toolbar-group-format">
            <!-- Clean -->
            <button id="btn-clean" type="button" class="ql-clean" part="toolbar-button toolbar-button-clean"></button>
            <vaadin-tooltip for="btn-clean" text="[[i18n.clean]]"></vaadin-tooltip>
          </span>

          <input
            id="fileInput"
            type="file"
            accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
            on-change="_uploadImage"
          />
        </div>

        <div part="content"></div>

        <div class="announcer" aria-live="polite"></div>
      </div>

      <vaadin-confirm-dialog id="linkDialog" opened="{{_linkEditing}}" header="[[i18n.linkDialogTitle]]">
        <vaadin-text-field
          id="linkUrl"
          value="{{_linkUrl}}"
          style="width: 100%;"
          on-keydown="_onLinkKeydown"
        ></vaadin-text-field>
        <vaadin-button id="confirmLink" slot="confirm-button" theme="primary" on-click="_onLinkEditConfirm">
          [[i18n.ok]]
        </vaadin-button>
        <vaadin-button
          id="removeLink"
          slot="reject-button"
          theme="error"
          on-click="_onLinkEditRemove"
          hidden$="[[!_linkRange]]"
        >
          [[i18n.remove]]
        </vaadin-button>
        <vaadin-button id="cancelLink" slot="cancel-button" on-click="_onLinkEditCancel">
          [[i18n.cancel]]
        </vaadin-button>
      </vaadin-confirm-dialog>

      <vaadin-rich-text-editor-popup
        id="colorPopup"
        colors="[[colorOptions]]"
        opened="{{_colorEditing}}"
        on-color-selected="__onColorSelected"
      ></vaadin-rich-text-editor-popup>

      <vaadin-rich-text-editor-popup
        id="backgroundPopup"
        colors="[[colorOptions]]"
        opened="{{_backgroundEditing}}"
        on-color-selected="__onBackgroundSelected"
      ></vaadin-rich-text-editor-popup>
    `;
  }

  static get is() {
    return 'vaadin-rich-text-editor';
  }

  static get cvdlName() {
    return 'vaadin-rich-text-editor';
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

defineCustomElement(RichTextEditor);

export { RichTextEditor };
