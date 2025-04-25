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
import '../vendor/vaadin-quill.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

const Quill = window.Quill;

// Fix to add `spellcheck="false"` on the `<pre>` tag removed by Quill
// TODO: Quill also removes `<code>` tag from the output, should add it?
const QuillCodeBlockContainer = Quill.import('formats/code-block-container');

class CodeBlockContainer extends QuillCodeBlockContainer {
  html(index, length) {
    const markup = super.html(index, length);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = markup;
    const preTag = tempDiv.querySelector('pre');
    if (preTag) {
      preTag.setAttribute('spellcheck', 'false');
      return preTag.outerHTML;
    }
    return markup; // fallback
  }
}

Quill.register('formats/code-block-container', CodeBlockContainer, true);

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

const DEFAULT_I18N = {
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

/**
 * @polymerMixin
 */
export const RichTextEditorMixin = (superClass) =>
  class RichTextEditorMixinClass extends I18nMixin(DEFAULT_I18N, superClass) {
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
              '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466',
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

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The properties are used e.g. as the tooltips for the editor toolbar
     * buttons.
     *
     * @return {!RichTextEditorI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
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
    connectedCallback() {
      super.connectedCallback();

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

      editorContent.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (!this.__tabBindings) {
            this.__tabBindings = this._editor.keyboard.bindings.Tab;
            this._editor.keyboard.bindings.Tab = null;
          }
        } else if (this.__tabBindings) {
          this._editor.keyboard.bindings.Tab = this.__tabBindings;
          this.__tabBindings = null;
        }
      });

      editorContent.addEventListener('blur', () => {
        if (this.__tabBindings) {
          this._editor.keyboard.bindings.Tab = this.__tabBindings;
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

      this.querySelector('[slot="color-popup"]').target = this.shadowRoot.querySelector('#btn-color');
      this.querySelector('[slot="background-popup"]').target = this.shadowRoot.querySelector('#btn-background');

      // Set up tooltip to show when hovering or focusing toolbar buttons
      this._tooltip = document.createElement('vaadin-tooltip');
      this._tooltip.slot = 'tooltip';
      // Create dummy aria target, as toolbar buttons already have aria-label, and also cannot be linked with the
      // tooltip being in the light DOM
      this._tooltip.ariaTarget = document.createElement('div');
      this.append(this._tooltip);

      const buttons = this.shadowRoot.querySelectorAll('[part~="toolbar-button"]');
      buttons.forEach((button) => {
        button.addEventListener('mouseenter', this.__showTooltip.bind(this));
        button.addEventListener('focusin', this.__showTooltip.bind(this));
      });
    }

    /** @private */
    __showTooltip(event) {
      const target = event.target;
      this._tooltip.target = target;
      this._tooltip.text = target.ariaLabel;
      this._tooltip._stateController.open({
        focus: event.type === 'focusin',
        hover: event.type === 'mouseenter',
      });
    }

    /** @private */
    _prepareToolbar() {
      const clean = Quill.imports['modules/toolbar'].DEFAULTS.handlers.clean;
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
        if (e.keyCode === 27 || (e.key === 'Tab' && !e.shiftKey)) {
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

      const keyboard = this._editor.keyboard;
      const bindings = keyboard.bindings.Tab;

      // Exclude Quill shift-tab bindings, except for code block,
      // as some of those are breaking when on a newline in the list
      // https://github.com/vaadin/vaadin-rich-text-editor/issues/67
      const originalBindings = bindings.filter((b) => !b.shiftKey || (b.format && b.format['code-block']));
      const moveFocusBinding = { key: 'Tab', shiftKey: true, handler: focusToolbar };

      keyboard.bindings.Tab = [...originalBindings, moveFocusBinding];

      // Alt-f10 focuses a toolbar button
      keyboard.addBinding({ key: 'F10', altKey: true, handler: focusToolbar });
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
        this._editor.focus();
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
        this._onLinkEditConfirm();
        this._closeLinkDialog();
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
      this._editor.focus();
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
      this._editor.focus();
      this._editor.format('background', this._backgroundValue, SOURCE.USER);
      this._toolbar.style.setProperty('--_background-value', this._backgroundValue);
      this._backgroundEditing = false;
    }

    /** @private */
    __updateHtmlValue() {
      // We have to use this instead of `innerHTML` to get correct tags like `<pre>` etc.
      let content = this._editor.getSemanticHTML();

      // TODO there are some issues e.g. `spellcheck="false"` not preserved
      // See https://github.com/slab/quill/issues/4289

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

      const deltaFromHtml = this._editor.clipboard.convert({ html: htmlValue });

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
            .map((button) => button.getAttribute('aria-label'))
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
