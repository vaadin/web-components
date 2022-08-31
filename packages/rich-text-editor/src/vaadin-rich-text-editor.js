/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '../vendor/vaadin-quill.js';
import './vaadin-rich-text-editor-toolbar-styles.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { isFirefox } from '@vaadin/component-base/src/browser-utils.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { richTextEditorStyles } from './vaadin-rich-text-editor-styles.js';

registerStyles('vaadin-rich-text-editor', richTextEditorStyles, { moduleId: 'vaadin-rich-text-editor-styles' });

const Quill = window.Quill;

const HANDLERS = [
  'bold',
  'italic',
  'underline',
  'strike',
  'header',
  'script',
  'list',
  'align',
  'blockquote',
  'code-block',
];

const SOURCE = {
  API: 'api',
  USER: 'user',
  SILENT: 'silent',
};

const STATE = {
  DEFAULT: 0,
  FOCUSED: 1,
  CLICKED: 2,
};

const TAB_KEY = 9;

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
 * `toolbar-group-glyph-transformation` | The group for glyph transformation controls
 * `toolbar-group-group-list`           | The group for group list controls
 * `toolbar-group-alignment`            | The group for alignment controls
 * `toolbar-group-rich-text`            | The group for rich text controls
 * `toolbar-group-block`                | The group for preformatted block controls
 * `toolbar-group-format`               | The group for format controls
 * `toolbar-button`                     | The toolbar button (applies to all buttons)
 * `toolbar-button-undo`                | The "undo" button
 * `toolbar-button-redo`                | The "redo" button
 * `toolbar-button-bold`                | The "bold" button
 * `toolbar-button-italic`              | The "italic" button
 * `toolbar-button-underline`           | The "underline" button
 * `toolbar-button-strike`              | The "strike-through" button
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} html-value-changed - Fired when the `htmlValue` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class RichTextEditor extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        :host([hidden]) {
          display: none !important;
        }

        .announcer {
          position: fixed;
          clip: rect(0, 0, 0, 0);
        }

        input[type='file'] {
          display: none;
        }

        .vaadin-rich-text-editor-container {
          display: flex;
          flex-direction: column;
          min-height: inherit;
          max-height: inherit;
          flex: auto;
        }
      </style>

      <div class="vaadin-rich-text-editor-container">
        <!-- Create toolbar container -->
        <div part="toolbar">
          <span part="toolbar-group toolbar-group-history">
            <!-- Undo and Redo -->
            <button
              type="button"
              part="toolbar-button toolbar-button-undo"
              on-click="_undo"
              title$="[[i18n.undo]]"
            ></button>
            <button
              type="button"
              part="toolbar-button toolbar-button-redo"
              on-click="_redo"
              title$="[[i18n.redo]]"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-emphasis">
            <!-- Bold -->
            <button class="ql-bold" part="toolbar-button toolbar-button-bold" title$="[[i18n.bold]]"></button>

            <!-- Italic -->
            <button class="ql-italic" part="toolbar-button toolbar-button-italic" title$="[[i18n.italic]]"></button>

            <!-- Underline -->
            <button
              class="ql-underline"
              part="toolbar-button toolbar-button-underline"
              title$="[[i18n.underline]]"
            ></button>

            <!-- Strike -->
            <button class="ql-strike" part="toolbar-button toolbar-button-strike" title$="[[i18n.strike]]"></button>
          </span>

          <span part="toolbar-group toolbar-group-heading">
            <!-- Header buttons -->
            <button
              type="button"
              class="ql-header"
              value="1"
              part="toolbar-button toolbar-button-h1"
              title$="[[i18n.h1]]"
            ></button>
            <button
              type="button"
              class="ql-header"
              value="2"
              part="toolbar-button toolbar-button-h2"
              title$="[[i18n.h2]]"
            ></button>
            <button
              type="button"
              class="ql-header"
              value="3"
              part="toolbar-button toolbar-button-h3"
              title$="[[i18n.h3]]"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-glyph-transformation">
            <!-- Subscript and superscript -->
            <button
              class="ql-script"
              value="sub"
              part="toolbar-button toolbar-button-subscript"
              title$="[[i18n.subscript]]"
            ></button>
            <button
              class="ql-script"
              value="super"
              part="toolbar-button toolbar-button-superscript"
              title$="[[i18n.superscript]]"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-list">
            <!-- List buttons -->
            <button
              type="button"
              class="ql-list"
              value="ordered"
              part="toolbar-button toolbar-button-list-ordered"
              title$="[[i18n.listOrdered]]"
            ></button>
            <button
              type="button"
              class="ql-list"
              value="bullet"
              part="toolbar-button toolbar-button-list-bullet"
              title$="[[i18n.listBullet]]"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-alignment">
            <!-- Align buttons -->
            <button
              type="button"
              class="ql-align"
              value=""
              part="toolbar-button toolbar-button-align-left"
              title$="[[i18n.alignLeft]]"
            ></button>
            <button
              type="button"
              class="ql-align"
              value="center"
              part="toolbar-button toolbar-button-align-center"
              title$="[[i18n.alignCenter]]"
            ></button>
            <button
              type="button"
              class="ql-align"
              value="right"
              part="toolbar-button toolbar-button-align-right"
              title$="[[i18n.alignRight]]"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-rich-text">
            <!-- Image -->
            <button
              type="button"
              part="toolbar-button toolbar-button-image"
              title$="[[i18n.image]]"
              on-touchend="_onImageTouchEnd"
              on-click="_onImageClick"
            ></button>
            <!-- Link -->
            <button
              type="button"
              part="toolbar-button toolbar-button-link"
              title$="[[i18n.link]]"
              on-click="_onLinkClick"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-block">
            <!-- Blockquote -->
            <button
              type="button"
              class="ql-blockquote"
              part="toolbar-button toolbar-button-blockquote"
              title$="[[i18n.blockquote]]"
            ></button>

            <!-- Code block -->
            <button
              type="button"
              class="ql-code-block"
              part="toolbar-button toolbar-button-code-block"
              title$="[[i18n.codeBlock]]"
            ></button>
          </span>

          <span part="toolbar-group toolbar-group-format">
            <!-- Clean -->
            <button
              type="button"
              class="ql-clean"
              part="toolbar-button toolbar-button-clean"
              title$="[[i18n.clean]]"
            ></button>
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
    `;
  }

  static get is() {
    return 'vaadin-rich-text-editor';
  }

  static get cvdlName() {
    return 'vaadin-rich-text-editor';
  }

  static get properties() {
    return {
      /**
       * Value is a list of the operations which describe change to the document.
       * Each of those operations describe the change at the current index.
       * They can be an `insert`, `delete` or `retain`. The format is as follows:
       *
       * ```js
       *  [
       *    { insert: 'Hello World' },
       *    { insert: '!', attributes: { bold: true }}
       *  ]
       * ```
       *
       * See also https://github.com/quilljs/delta for detailed documentation.
       * @type {string}
       */
      value: {
        type: String,
        notify: true,
        value: '',
      },

      /**
       * HTML representation of the rich text editor content.
       */
      htmlValue: {
        type: String,
        notify: true,
        readOnly: true,
      },

      /**
       * When true, the user can not modify, nor copy the editor content.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * When true, the user can not modify the editor content, but can copy it.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * An object used to localize this component. The properties are used
       * e.g. as the tooltips for the editor toolbar buttons.
       *
       * @type {!RichTextEditorI18n}
       * @default {English/US}
       */
      i18n: {
        type: Object,
        value: () => {
          return {
            undo: 'undo',
            redo: 'redo',
            bold: 'bold',
            italic: 'italic',
            underline: 'underline',
            strike: 'strike',
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            subscript: 'subscript',
            superscript: 'superscript',
            listOrdered: 'list ordered',
            listBullet: 'list bullet',
            alignLeft: 'align left',
            alignCenter: 'align center',
            alignRight: 'align right',
            image: 'image',
            link: 'link',
            blockquote: 'blockquote',
            codeBlock: 'code block',
            clean: 'clean',
            linkDialogTitle: 'Link address',
            ok: 'OK',
            cancel: 'Cancel',
            remove: 'Remove',
          };
        },
      },

      /** @private */
      _editor: {
        type: Object,
      },

      /**
       * Stores old value
       * @private
       */
      __oldValue: String,

      /** @private */
      __lastCommittedChange: {
        type: String,
        value: '',
      },

      /** @private */
      _linkEditing: {
        type: Boolean,
      },

      /** @private */
      _linkRange: {
        type: Object,
        value: null,
      },

      /** @private */
      _linkIndex: {
        type: Number,
        value: null,
      },

      /** @private */
      _linkUrl: {
        type: String,
        value: '',
      },
    };
  }

  static get observers() {
    return ['_valueChanged(value, _editor)', '_disabledChanged(disabled, readonly, _editor)'];
  }

  /**
   * @param {string} prop
   * @param {?string} oldVal
   * @param {?string} newVal
   * @protected
   */
  attributeChangedCallback(prop, oldVal, newVal) {
    super.attributeChangedCallback(prop, oldVal, newVal);

    if (prop === 'dir') {
      this.__dir = newVal;
      this.__setDirection(newVal);
    }
  }

  /** @private */
  __setDirection(dir) {
    // Needed for proper `ql-align` class to be set and activate the toolbar align button
    const alignAttributor = Quill.import('attributors/class/align');
    alignAttributor.whitelist = [dir === 'rtl' ? 'left' : 'right', 'center', 'justify'];
    Quill.register(alignAttributor, true);

    const alignGroup = this._toolbar.querySelector('[part~="toolbar-group-alignment"]');

    if (dir === 'rtl') {
      alignGroup.querySelector('[part~="toolbar-button-align-left"]').value = 'left';
      alignGroup.querySelector('[part~="toolbar-button-align-right"]').value = '';
    } else {
      alignGroup.querySelector('[part~="toolbar-button-align-left"]').value = '';
      alignGroup.querySelector('[part~="toolbar-button-align-right"]').value = 'right';
    }

    this._editor.getModule('toolbar').update(this._editor.getSelection());
  }

  /** @protected */
  ready() {
    super.ready();

    const editor = this.shadowRoot.querySelector('[part="content"]');
    const toolbarConfig = this._prepareToolbar();
    this._toolbar = toolbarConfig.container;

    this._addToolbarListeners();

    this._editor = new Quill(editor, {
      modules: {
        toolbar: toolbarConfig,
      },
    });

    this.__patchToolbar();
    this.__patchKeyboard();

    /* c8 ignore next 3 */
    if (isFirefox) {
      this.__patchFirefoxFocus();
    }

    this.$.linkDialog.$.dialog.$.overlay.addEventListener('vaadin-overlay-open', () => {
      this.$.linkUrl.focus();
    });

    const editorContent = editor.querySelector('.ql-editor');

    editorContent.setAttribute('role', 'textbox');
    editorContent.setAttribute('aria-multiline', 'true');

    this._editor.on('text-change', () => {
      const timeout = 200;
      this.__debounceSetValue = Debouncer.debounce(this.__debounceSetValue, timeOut.after(timeout), () => {
        this.value = JSON.stringify(this._editor.getContents().ops);
      });
    });

    editorContent.addEventListener('focusout', () => {
      if (this._toolbarState === STATE.FOCUSED) {
        this._cleanToolbarState();
      } else {
        this.__emitChangeEvent();
      }
    });

    editorContent.addEventListener('focus', () => {
      // Format changed, but no value changed happened
      if (this._toolbarState === STATE.CLICKED) {
        this._cleanToolbarState();
      }
    });

    this._editor.on('selection-change', this.__announceFormatting.bind(this));
  }

  /** @private */
  _prepareToolbar() {
    const clean = Quill.imports['modules/toolbar'].DEFAULTS.handlers.clean;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const toolbar = {
      container: this.shadowRoot.querySelector('[part="toolbar"]'),
      handlers: {
        clean() {
          self._markToolbarClicked();
          clean.call(this);
        },
      },
    };

    HANDLERS.forEach((handler) => {
      toolbar.handlers[handler] = (value) => {
        this._markToolbarClicked();
        this._editor.format(handler, value, SOURCE.USER);
      };
    });

    return toolbar;
  }

  /** @private */
  _addToolbarListeners() {
    const buttons = this._toolbarButtons;
    const toolbar = this._toolbar;

    // Disable tabbing to all buttons but the first one
    buttons.forEach((button, index) => index > 0 && button.setAttribute('tabindex', '-1'));

    toolbar.addEventListener('keydown', (e) => {
      // Use roving tab-index for the toolbar buttons
      if ([37, 39].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        let index = buttons.indexOf(e.target);
        buttons[index].setAttribute('tabindex', '-1');

        let step;
        if (e.keyCode === 39) {
          step = 1;
        } else if (e.keyCode === 37) {
          step = -1;
        }
        index = (buttons.length + index + step) % buttons.length;
        buttons[index].removeAttribute('tabindex');
        buttons[index].focus();
      }
      // Esc and Tab focuses the content
      if (e.keyCode === 27 || (e.keyCode === TAB_KEY && !e.shiftKey)) {
        e.preventDefault();
        this._editor.focus();
      }
    });

    // Mousedown happens before editor focusout
    toolbar.addEventListener('mousedown', (e) => {
      if (buttons.indexOf(e.composedPath()[0]) > -1) {
        this._markToolbarFocused();
      }
    });
  }

  /** @private */
  _markToolbarClicked() {
    this._toolbarState = STATE.CLICKED;
  }

  /** @private */
  _markToolbarFocused() {
    this._toolbarState = STATE.FOCUSED;
  }

  /** @private */
  _cleanToolbarState() {
    this._toolbarState = STATE.DEFAULT;
  }

  /** @private */
  __createFakeFocusTarget() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const elem = document.createElement('textarea');
    // Reset box model
    elem.style.border = '0';
    elem.style.padding = '0';
    elem.style.margin = '0';
    // Move element out of screen horizontally
    elem.style.position = 'absolute';
    elem.style[isRTL ? 'right' : 'left'] = '-9999px';
    // Move element to the same position vertically
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    elem.style.top = `${yPosition}px`;
    return elem;
  }

  /** @private */
  __patchFirefoxFocus() {
    // In Firefox 63+ with native Shadow DOM, when moving focus out of
    // contenteditable and back again within same shadow root, cursor
    // disappears. See https://bugzilla.mozilla.org/show_bug.cgi?id=1496769
    const editorContent = this.shadowRoot.querySelector('.ql-editor');
    let isFake = false;

    const focusFake = () => {
      isFake = true;
      this.__fakeTarget = this.__createFakeFocusTarget();
      document.body.appendChild(this.__fakeTarget);
      // Let the focus step out of shadow root!
      this.__fakeTarget.focus();
      return new Promise((resolve) => {
        setTimeout(resolve);
      });
    };

    const focusBack = (offsetNode, offset) => {
      this._editor.focus();
      if (offsetNode) {
        this._editor.selection.setNativeRange(offsetNode, offset);
      }
      document.body.removeChild(this.__fakeTarget);
      delete this.__fakeTarget;
      isFake = false;
    };

    editorContent.addEventListener('mousedown', (e) => {
      if (!this._editor.hasFocus()) {
        const { x, y } = e;
        const { offset, offsetNode } = document.caretPositionFromPoint(x, y);
        focusFake().then(() => {
          focusBack(offsetNode, offset);
        });
      }
    });

    editorContent.addEventListener('focusin', () => {
      if (isFake === false) {
        focusFake().then(() => focusBack());
      }
    });
  }

  /** @private */
  __patchToolbar() {
    const toolbar = this._editor.getModule('toolbar');
    const update = toolbar.update;

    // Add custom link button to toggle state attribute
    toolbar.controls.push(['link', this.shadowRoot.querySelector('[part~="toolbar-button-link"]')]);

    toolbar.update = function (range) {
      update.call(toolbar, range);

      toolbar.controls.forEach((pair) => {
        const input = pair[1];
        if (input.classList.contains('ql-active')) {
          input.setAttribute('on', '');
        } else {
          input.removeAttribute('on');
        }
      });
    };
  }

  /** @private */
  __patchKeyboard() {
    const focusToolbar = () => {
      this._markToolbarFocused();
      this._toolbar.querySelector('button:not([tabindex])').focus();
    };

    const keyboard = this._editor.getModule('keyboard');
    const bindings = keyboard.bindings[TAB_KEY];

    // Exclude Quill shift-tab bindings, except for code block,
    // as some of those are breaking when on a newline in the list
    // https://github.com/vaadin/vaadin-rich-text-editor/issues/67
    const originalBindings = bindings.filter((b) => !b.shiftKey || (b.format && b.format['code-block']));
    const moveFocusBinding = { key: TAB_KEY, shiftKey: true, handler: focusToolbar };

    keyboard.bindings[TAB_KEY] = [...originalBindings, moveFocusBinding];

    // Alt-f10 focuses a toolbar button
    keyboard.addBinding({ key: 121, altKey: true, handler: focusToolbar });
  }

  /** @private */
  __emitChangeEvent() {
    let lastCommittedChange = this.__lastCommittedChange;

    if (this.__debounceSetValue && this.__debounceSetValue.isActive()) {
      lastCommittedChange = this.value;
      this.__debounceSetValue.flush();
    }

    if (lastCommittedChange !== this.value) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, cancelable: false }));
      this.__lastCommittedChange = this.value;
    }
  }

  /** @private */
  _onLinkClick() {
    const range = this._editor.getSelection();
    if (range) {
      const LinkBlot = Quill.imports['formats/link'];
      const [link, offset] = this._editor.scroll.descendant(LinkBlot, range.index);
      if (link != null) {
        // Existing link
        this._linkRange = { index: range.index - offset, length: link.length() };
        this._linkUrl = LinkBlot.formats(link.domNode);
      } else if (range.length === 0) {
        this._linkIndex = range.index;
      }
      this._linkEditing = true;
    }
  }

  /** @private */
  _applyLink(link) {
    if (link) {
      this._markToolbarClicked();
      this._editor.format('link', link, SOURCE.USER);
      this._editor.getModule('toolbar').update(this._editor.selection.savedRange);
    }
    this._closeLinkDialog();
  }

  /** @private */
  _insertLink(link, position) {
    if (link) {
      this._markToolbarClicked();
      this._editor.insertText(position, link, { link });
      this._editor.setSelection(position, link.length);
    }
    this._closeLinkDialog();
  }

  /** @private */
  _updateLink(link, range) {
    this._markToolbarClicked();
    this._editor.formatText(range, 'link', link, SOURCE.USER);
    this._closeLinkDialog();
  }

  /** @private */
  _removeLink() {
    this._markToolbarClicked();
    if (this._linkRange != null) {
      this._editor.formatText(this._linkRange, { link: false, color: false }, SOURCE.USER);
    }
    this._closeLinkDialog();
  }

  /** @private */
  _closeLinkDialog() {
    this._linkEditing = false;
    this._linkUrl = '';
    this._linkIndex = null;
    this._linkRange = null;
  }

  /** @private */
  _onLinkEditConfirm() {
    if (this._linkIndex != null) {
      this._insertLink(this._linkUrl, this._linkIndex);
    } else if (this._linkRange) {
      this._updateLink(this._linkUrl, this._linkRange);
    } else {
      this._applyLink(this._linkUrl);
    }
  }

  /** @private */
  _onLinkEditCancel() {
    this._closeLinkDialog();
    this._editor.focus();
  }

  /** @private */
  _onLinkEditRemove() {
    this._removeLink();
    this._closeLinkDialog();
  }

  /** @private */
  _onLinkKeydown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.$.confirmLink.click();
    }
  }

  /** @private */
  __updateHtmlValue() {
    const editor = this.shadowRoot.querySelector('.ql-editor');
    let content = editor.innerHTML;

    // Remove Quill classes, e.g. ql-syntax, except for align
    content = content.replace(/\s*ql-(?!align)[\w-]*\s*/g, '');

    // Replace Quill align classes with inline styles
    [this.__dir === 'rtl' ? 'left' : 'right', 'center', 'justify'].forEach((align) => {
      content = content.replace(
        new RegExp(` class=[\\\\]?"\\s?ql-align-${align}[\\\\]?"`, 'g'),
        ` style="text-align: ${align}"`,
      );
    });

    content = content.replace(/ class=""/g, '');

    this._setHtmlValue(content);
  }

  /**
   * Sets content represented by HTML snippet into the editor.
   * The snippet is interpreted by [Quill's Clipboard matchers](https://quilljs.com/docs/modules/clipboard/#matchers),
   * which may not produce the exactly input HTML.
   *
   * **NOTE:** Improper handling of HTML can lead to cross site scripting (XSS) and failure to sanitize
   * properly is both notoriously error-prone and a leading cause of web vulnerabilities.
   * This method is aptly named to ensure the developer has taken the necessary precautions.
   * @param {string} htmlValue
   */
  dangerouslySetHtmlValue(htmlValue) {
    const deltaFromHtml = this._editor.clipboard.convert(htmlValue);
    this._editor.setContents(deltaFromHtml, SOURCE.API);
  }

  /** @private */
  __announceFormatting() {
    const timeout = 200;

    const announcer = this.shadowRoot.querySelector('.announcer');
    announcer.textContent = '';

    this.__debounceAnnounceFormatting = Debouncer.debounce(
      this.__debounceAnnounceFormatting,
      timeOut.after(timeout),
      () => {
        const formatting = Array.from(this.shadowRoot.querySelectorAll('[part="toolbar"] .ql-active'))
          .map((button) => button.getAttribute('title'))
          .join(', ');
        announcer.textContent = formatting;
      },
    );
  }

  /** @private */
  get _toolbarButtons() {
    return Array.from(this.shadowRoot.querySelectorAll('[part="toolbar"] button')).filter((btn) => {
      return btn.clientHeight > 0;
    });
  }

  /** @private */
  _clear() {
    this._editor.deleteText(0, this._editor.getLength(), SOURCE.SILENT);
    this.__updateHtmlValue();
  }

  /** @private */
  _undo(e) {
    e.preventDefault();
    this._editor.history.undo();
    this._editor.focus();
  }

  /** @private */
  _redo(e) {
    e.preventDefault();
    this._editor.history.redo();
    this._editor.focus();
  }

  /** @private */
  _toggleToolbarDisabled(disable) {
    const buttons = this._toolbarButtons;
    if (disable) {
      buttons.forEach((btn) => btn.setAttribute('disabled', 'true'));
    } else {
      buttons.forEach((btn) => btn.removeAttribute('disabled'));
    }
  }

  /** @private */
  _onImageTouchEnd(e) {
    // Cancel the event to avoid the following click event
    e.preventDefault();
    this._onImageClick();
  }

  /** @private */
  _onImageClick() {
    this.$.fileInput.value = '';
    this.$.fileInput.click();
  }

  /** @private */
  _uploadImage(e) {
    const fileInput = e.target;
    // NOTE: copied from https://github.com/quilljs/quill/blob/1.3.6/themes/base.js#L128
    // needs to be updated in case of switching to Quill 2.0.0
    if (fileInput.files != null && fileInput.files[0] != null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = e.target.result;
        const range = this._editor.getSelection(true);
        this._editor.updateContents(
          new Quill.imports.delta().retain(range.index).delete(range.length).insert({ image }),
          SOURCE.USER,
        );
        this._markToolbarClicked();
        this._editor.setSelection(range.index + 1, SOURCE.SILENT);
        fileInput.value = '';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  /** @private */
  _disabledChanged(disabled, readonly, editor) {
    if (disabled === undefined || readonly === undefined || editor === undefined) {
      return;
    }

    if (disabled || readonly) {
      editor.enable(false);

      if (disabled) {
        this._toggleToolbarDisabled(true);
      }
    } else {
      editor.enable();

      if (this.__oldDisabled) {
        this._toggleToolbarDisabled(false);
      }
    }

    this.__oldDisabled = disabled;
  }

  /** @private */
  _valueChanged(value, editor) {
    if (editor === undefined) {
      return;
    }

    if (value == null || value === '[{"insert":"\\n"}]') {
      this.value = '';
      return;
    }

    if (value === '') {
      this._clear();
      return;
    }

    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        this.__oldValue = value;
      } else {
        throw new Error(`expected JSON string with array of objects, got: ${value}`);
      }
    } catch (err) {
      // Use old value in case new one is not suitable
      this.value = this.__oldValue;
      console.error('Invalid value set to rich-text-editor:', err);
      return;
    }
    const delta = new Quill.imports.delta(parsedValue);
    // Suppress text-change event to prevent infinite loop
    if (JSON.stringify(editor.getContents()) !== JSON.stringify(delta)) {
      editor.setContents(delta, SOURCE.SILENT);
    }
    this.__updateHtmlValue();

    if (this._toolbarState === STATE.CLICKED) {
      this._cleanToolbarState();
      this.__emitChangeEvent();
    } else if (!this._editor.hasFocus()) {
      // Value changed from outside
      this.__lastCommittedChange = this.value;
    }
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(RichTextEditor.is, RichTextEditor);

export { RichTextEditor };
