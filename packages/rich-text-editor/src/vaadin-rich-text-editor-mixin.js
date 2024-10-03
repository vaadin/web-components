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
import '../vendor/vaadin-quill.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { isFirefox } from '@vaadin/component-base/src/browser-utils.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

const Quill = window.Quill;

// Workaround for text disappearing when accepting spellcheck suggestion
// See https://github.com/quilljs/quill/issues/2096#issuecomment-399576957
const Inline = Quill.import('blots/inline');

class CustomColor extends Inline {
  constructor(domNode, value) {
    super(domNode, value);

    // Map <font> properties
    domNode.style.color = domNode.color;

    const span = this.replaceWith(new Inline(Inline.create()));

    span.children.forEach((child) => {
      if (child.attributes) child.attributes.copy(span);
      if (child.unwrap) child.unwrap();
    });

    this.remove();

    return span; // eslint-disable-line no-constructor-return
  }
}

CustomColor.blotName = 'customColor';
CustomColor.tagName = 'FONT';

Quill.register(CustomColor, true);

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
 * @polymerMixin
 */
export const RichTextEditorMixin = (superClass) =>
  class RichTextEditorMixinClass extends superClass {
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
          sync: true,
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
              color: 'color',
              background: 'background',
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

        /**
         * The list of colors used by the background and text color
         * selection controls. Should contain an array of HEX strings.
         *
         * When user selects `#000000` (black) as a text color,
         * or `#ffffff` (white) as a background color, it resets
         * the corresponding format for the selected text.
         */
        colorOptions: {
          type: Array,
          value: () => {
            /* prettier-ignore */
            return [
              '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
              '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
              '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
              '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
              '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
            ];
          },
        },

        /** @private */
        _editor: {
          type: Object,
          sync: true,
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
          value: false,
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

        /** @private */
        _colorEditing: {
          type: Boolean,
          value: false,
        },

        /** @private */
        _colorValue: {
          type: String,
          value: '',
        },

        /** @private */
        _backgroundEditing: {
          type: Boolean,
          value: false,
        },

        /** @private */
        _backgroundValue: {
          type: String,
          value: '',
        },
      };
    }

    static get observers() {
      return ['_valueChanged(value, _editor)', '_disabledChanged(disabled, readonly, _editor)'];
    }

    /** @private */
    get _toolbarButtons() {
      return Array.from(this.shadowRoot.querySelectorAll('[part="toolbar"] button')).filter((btn) => {
        return btn.clientHeight > 0;
      });
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

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this._editor.emitter.disconnect();
    }

    /** @private */
    __setDirection(dir) {
      if (!this._editor) {
        return;
      }

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
    async connectedCallback() {
      super.connectedCallback();

      if (!this.$ && this.updateComplete) {
        await this.updateComplete;
      }

      this._editor.emitter.connect();
    }

    /** @protected */
    ready() {
      super.ready();

      this._toolbarConfig = this._prepareToolbar();
      this._toolbar = this._toolbarConfig.container;

      this._addToolbarListeners();

      const editor = this.shadowRoot.querySelector('[part="content"]');

      this._editor = new Quill(editor, {
        modules: {
          toolbar: this._toolbarConfig,
        },
      });

      this.__patchToolbar();
      this.__patchKeyboard();

      /* c8 ignore next 3 */
      if (isFirefox) {
        this.__patchFirefoxFocus();
      }

      this.__setDirection(this.__dir);

      const editorContent = editor.querySelector('.ql-editor');

      editorContent.setAttribute('role', 'textbox');
      editorContent.setAttribute('aria-multiline', 'true');

      this._editor.on('text-change', () => {
        const timeout = 200;
        this.__debounceSetValue = Debouncer.debounce(this.__debounceSetValue, timeOut.after(timeout), () => {
          this.value = JSON.stringify(this._editor.getContents().ops);
        });
      });

      this._editor.on('editor-change', () => {
        const selection = this._editor.getSelection();
        if (selection) {
          const format = this._editor.getFormat(selection.index, selection.length);
          this._toolbar.style.setProperty('--_color-value', format.color || null);
          this._toolbar.style.setProperty('--_background-value', format.background || null);
        }
      });

      const TAB_KEY = 9;

      editorContent.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (!this.__tabBindings) {
            this.__tabBindings = this._editor.keyboard.bindings[TAB_KEY];
            this._editor.keyboard.bindings[TAB_KEY] = null;
          }
        } else if (this.__tabBindings) {
          this._editor.keyboard.bindings[TAB_KEY] = this.__tabBindings;
          this.__tabBindings = null;
        }
      });

      editorContent.addEventListener('blur', () => {
        if (this.__tabBindings) {
          this._editor.keyboard.bindings[TAB_KEY] = this.__tabBindings;
          this.__tabBindings = null;
        }
      });

      editorContent.addEventListener('focusout', () => {
        if (this._toolbarState === STATE.FOCUSED) {
          this._cleanToolbarState();
        } else {
          this.__emitChangeEvent();
        }
      });

      editorContent.addEventListener('focus', () => {
        // When editing link, editor gets focus while dialog is still open.
        // Keep toolbar state as clicked in this case to fire change event.
        if (this._toolbarState === STATE.CLICKED && !this._linkEditing) {
          this._cleanToolbarState();
        }
      });

      this._editor.on('selection-change', this.__announceFormatting.bind(this));

      // Flush pending htmlValue only once the editor is fully initialized
      this.__flushPendingHtmlValue();

      this.$.backgroundPopup.target = this.shadowRoot.querySelector('#btn-background');
      this.$.colorPopup.target = this.shadowRoot.querySelector('#btn-color');

      requestAnimationFrame(() => {
        this.$.linkDialog.$.dialog.$.overlay.addEventListener('vaadin-overlay-open', () => {
          this.$.linkUrl.focus();
        });
      });
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
          const isActive = input.classList.contains('ql-active');
          input.toggleAttribute('on', isActive);
          input.part.toggle('toolbar-button-pressed', isActive);
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
    __onColorClick() {
      this._colorEditing = true;
    }

    /** @private */
    __onColorSelected(event) {
      const color = event.detail.color;
      this._colorValue = color === '#000000' ? null : color;
      this._markToolbarClicked();
      this._editor.format('color', this._colorValue, SOURCE.USER);
      this._toolbar.style.setProperty('--_color-value', this._colorValue);
      this._colorEditing = false;
    }

    /** @private */
    __onBackgroundClick() {
      this._backgroundEditing = true;
    }

    /** @private */
    __onBackgroundSelected(event) {
      const color = event.detail.color;
      this._backgroundValue = color === '#ffffff' ? null : color;
      this._markToolbarClicked();
      this._editor.format('background', this._backgroundValue, SOURCE.USER);
      this._toolbar.style.setProperty('--_background-value', this._backgroundValue);
      this._backgroundEditing = false;
    }

    /** @private */
    __updateHtmlValue() {
      const editor = this.shadowRoot.querySelector('.ql-editor');
      let content = editor.innerHTML;

      // Remove Quill classes, e.g. ql-syntax, except for align
      content = content.replace(/class="([^"]*)"/gu, (_match, group1) => {
        const classes = group1.split(' ').filter((className) => {
          return !className.startsWith('ql-') || className.startsWith('ql-align');
        });
        return `class="${classes.join(' ')}"`;
      });
      // Remove meta spans, e.g. cursor which are empty after Quill classes removed
      content = content.replace(/<span[^>]*><\/span>/gu, '');

      // Replace Quill align classes with inline styles
      [this.__dir === 'rtl' ? 'left' : 'right', 'center', 'justify'].forEach((align) => {
        content = content.replace(
          new RegExp(` class=[\\\\]?"\\s?ql-align-${align}[\\\\]?"`, 'gu'),
          ` style="text-align: ${align}"`,
        );
      });

      content = content.replace(/ class=""/gu, '');

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
      if (!this._editor) {
        this.__savePendingHtmlValue(htmlValue);

        return;
      }

      // In Firefox, the styles are not properly computed when the element is placed
      // in a Lit component, as the element is first attached to the DOM and then
      // the shadowRoot is initialized. This causes the `hmlValue` to not be correctly
      // parsed into the delta format used by Quill. To work around this, we check
      // if the display property is set and if not, we wait for the element to intersect
      // with the viewport before trying to set the value again.
      if (!getComputedStyle(this).display) {
        this.__savePendingHtmlValue(htmlValue);
        const observer = new IntersectionObserver(() => {
          if (getComputedStyle(this).display) {
            this.__flushPendingHtmlValue();
            observer.disconnect();
          }
        });
        observer.observe(this);
        return;
      }

      const whitespaceCharacters = {
        '\t': '__VAADIN_RICH_TEXT_EDITOR_TAB',
        '  ': '__VAADIN_RICH_TEXT_EDITOR_DOUBLE_SPACE',
      };
      // Replace whitespace characters with placeholders before the Delta conversion to prevent Quill from trimming them
      Object.entries(whitespaceCharacters).forEach(([character, replacement]) => {
        htmlValue = htmlValue.replaceAll(/>[^<]*</gu, (match) => match.replaceAll(character, replacement)); // NOSONAR
      });

      const deltaFromHtml = this._editor.clipboard.convert(htmlValue);

      // Restore whitespace characters after the conversion
      Object.entries(whitespaceCharacters).forEach(([character, replacement]) => {
        deltaFromHtml.ops.forEach((op) => {
          if (typeof op.insert === 'string') {
            op.insert = op.insert.replaceAll(replacement, character);
          }
        });
      });

      this._editor.setContents(deltaFromHtml, SOURCE.API);
    }

    /** @private */
    __savePendingHtmlValue(htmlValue) {
      // The editor isn't ready yet, store the value for later
      this.__pendingHtmlValue = htmlValue;
      // Clear a possible value to prevent it from clearing the pending htmlValue once the editor property is set
      this.value = '';
    }

    /** @private */
    __flushPendingHtmlValue() {
      if (this.__pendingHtmlValue) {
        this.dangerouslySetHtmlValue(this.__pendingHtmlValue);
      }
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
            .map((button) => {
              const tooltip = this.shadowRoot.querySelector(`[for="${button.id}"]`);
              return tooltip.text;
            })
            .join(', ');
          announcer.textContent = formatting;
        },
      );
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
      if (value && this.__pendingHtmlValue) {
        // A non-empty value is set explicitly. Clear pending htmlValue to prevent it from overriding the value.
        this.__pendingHtmlValue = undefined;
      }

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
  };
