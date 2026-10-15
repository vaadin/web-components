/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/item/src/vaadin-item.js';
import { html, nothing, render } from 'lit';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { formatFilterValue, parseQuery } from './vaadin-query-field-parser.js';

const NUMBER_REGEX = /^[+-]?(\d+\.?\d*|\.\d+)$/u;

/**
 * Normalizes an entry of `QueryFieldFilter.options` into an object.
 */
function toOption(option) {
  return typeof option === 'string' ? { value: option } : option;
}

/**
 * Returns the option of the filter matching the given value, case-insensitive.
 */
function findOption(filter, value) {
  const lowerCaseValue = value.toLowerCase();
  return (filter.options || []).map(toOption).find((option) => option.value.toLowerCase() === lowerCaseValue);
}

/**
 * Returns true when the given filter segment has a valid value for its filter definition.
 */
function isValidFilterValue(segment, filter) {
  if (!filter || !segment.closed || segment.value.trim() === '') {
    return false;
  }
  if (filter.type === 'number') {
    return NUMBER_REGEX.test(segment.value);
  }
  if (filter.options && !filter.allowCustomValue) {
    return !!findOption(filter, segment.value);
  }
  return true;
}

/**
 * A mixin providing the query parsing, highlighting and autocomplete logic of `<vaadin-query-field>`.
 *
 * @polymerMixin
 * @mixes InputFieldMixin
 */
export const QueryFieldMixin = (superClass) =>
  class QueryFieldMixinClass extends InputFieldMixin(superClass) {
    static get properties() {
      return {
        /**
         * The filters that can be used in the query. Each filter is typed as
         * `name:value` (or `name:"some value"`) and has the following shape:
         *
         * - `name` — the filter name typed before the colon.
         * - `label` — optional human-readable label, shown in suggestions.
         * - `type` — optional, `'number'` requires a numeric value. Defaults to `'text'`.
         * - `options` — optional array of allowed values, suggested while typing the value.
         *   Each option is either a string, or an object with `value` and optional `label`.
         * - `allowCustomValue` — optional, when true, values that are not in `options` are accepted.
         *
         * @type {!Array<!QueryFieldFilter>}
         */
        filters: {
          type: Array,
          value: () => [],
        },

        /**
         * The parsed query: an object with the free `text` (all words that are not
         * filters, joined by a single space), and the list of valid `filters` as
         * `{ name, value }` objects. Invalid filters are not included.
         *
         * @type {!QueryFieldQuery}
         */
        query: {
          type: Object,
          value: () => ({ text: '', filters: [] }),
          readOnly: true,
          notify: true,
        },

        /** @private */
        _segments: {
          type: Array,
          value: () => [],
          attribute: false,
        },

        /** @private */
        _caret: {
          type: Number,
          value: -1,
          attribute: false,
        },

        /** @private */
        _suggestions: {
          type: Array,
          value: () => [],
          attribute: false,
        },

        /** @private */
        _focusedIndex: {
          type: Number,
          value: -1,
          attribute: false,
        },

        /** @private */
        _suggestionsRequested: {
          type: Boolean,
          value: false,
          attribute: false,
        },

        /** @private */
        _showAllFilters: {
          type: Boolean,
          value: false,
          attribute: false,
        },
      };
    }

    static get constraints() {
      return [...super.constraints, 'filters'];
    }

    constructor() {
      super();
      this._setType('text');
      // Browser autofill suggestions would cover the query suggestions
      this.autocomplete = 'off';

      this.__onSelectionChange = this.__onSelectionChange.bind(this);
      this.__syncScroll = this.__syncScroll.bind(this);
      this.__resizeObserver = new ResizeObserver(() => this.__syncHighlightsGeometry());
    }

    /** @protected */
    get clearElement() {
      return this.$.clearButton;
    }

    /**
     * Whether the suggestions overlay is opened.
     * @protected
     */
    get _overlayOpened() {
      return this._suggestionsRequested && this._suggestions.length > 0 && !this.readonly && !this.disabled;
    }

    /** @protected */
    get slotStyles() {
      const tag = this.localName;

      return [
        ...super.slotStyles,
        `
          ${tag} > input[slot='input']::selection {
            background: var(--vaadin-query-field-selection-background, color-mix(in srgb, Highlight 40%, transparent));
          }
        `,
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );
      this.addController(new LabelledInputController(this.inputElement, this._labelController));

      this._listBoxController = new SlotController(this, 'overlay', 'div', {
        initializer: (listBox) => {
          listBox.setAttribute('role', 'listbox');
          listBox.id = SlotController.generateId(this, 'listbox');
          // Keep focus in the input when interacting with suggestions
          listBox.addEventListener('mousedown', (event) => event.preventDefault());
          this._listBox = listBox;
        },
      });
      this.addController(this._listBoxController);

      this.$.overlay.positionTarget = this.$.inputField;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this.inputElement) {
        this.__resizeObserver.observe(this.inputElement);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.__resizeObserver.disconnect();
      this._suggestionsRequested = false;
    }

    /**
     * Override method from `InputMixin` to set up the combobox
     * ARIA attributes and the listeners used for tracking the caret.
     *
     * @param {HTMLElement | undefined} input
     * @param {HTMLElement | undefined} oldInput
     * @protected
     * @override
     */
    _inputElementChanged(input, oldInput) {
      super._inputElementChanged(input, oldInput);

      if (oldInput) {
        this.__resizeObserver.unobserve(oldInput);
      }

      if (input) {
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('spellcheck', 'false');
        if (this.isConnected) {
          this.__resizeObserver.observe(input);
        }
      }
    }

    /**
     * Override method from `InputMixin` to also track caret changes.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _addInputListeners(input) {
      super._addInputListeners(input);

      ['selectionchange', 'select', 'keyup', 'click'].forEach((type) => {
        input.addEventListener(type, this.__onSelectionChange);
      });
      input.addEventListener('scroll', this.__syncScroll);
    }

    /**
     * Override method from `InputMixin` to remove the listeners added in `_addInputListeners`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _removeInputListeners(input) {
      super._removeInputListeners(input);

      ['selectionchange', 'select', 'keyup', 'click'].forEach((type) => {
        input.removeEventListener(type, this.__onSelectionChange);
      });
      input.removeEventListener('scroll', this.__syncScroll);
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('value') || props.has('filters')) {
        this.__updateSegments();
      }

      if (
        props.has('_segments') ||
        props.has('_caret') ||
        props.has('_suggestionsRequested') ||
        props.has('_showAllFilters')
      ) {
        this.__updateSuggestions();
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('_suggestions') || props.has('_focusedIndex')) {
        this.__renderSuggestions();
      }

      if (props.has('_segments') || props.has('_caret')) {
        this.__syncScroll();
      }

      if (
        props.has('_suggestions') ||
        props.has('_suggestionsRequested') ||
        props.has('_focusedIndex') ||
        props.has('readonly') ||
        props.has('disabled')
      ) {
        this.__updateAria();
      }

      if (props.has('_segments') || props.has('_caret') || props.has('_suggestions')) {
        this.__updatePositionTarget();
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints,
     * including that all filters in the query are valid.
     * @return {boolean}
     */
    checkValidity() {
      return super.checkValidity() && this._segments.every((segment) => segment.type !== 'filter' || segment.valid);
    }

    /**
     * Override method from `FocusMixin` to track the caret and
     * close the suggestions when focus leaves the field.
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused) {
        this._suggestionsRequested = false;
        this._showAllFilters = false;
      }
      this.__onSelectionChange();
    }

    /**
     * Override method from `InputFieldMixin` to open suggestions on user input.
     * @param {Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      super._onInput(event);

      this._showAllFilters = false;
      this._suggestionsRequested = true;
      this.__onSelectionChange();
    }

    /**
     * Override method from `KeyboardMixin` to handle suggestions navigation.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (this.__handleSuggestionsKeyDown(event)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      super._onKeyDown(event);
    }

    /** @private */
    __handleSuggestionsKeyDown(event) {
      if (this.readonly || this.disabled || event.isComposing) {
        return false;
      }

      const count = this._suggestions.length;
      const opened = this._overlayOpened;

      switch (event.key) {
        case 'ArrowDown':
          if (!opened) {
            this._suggestionsRequested = true;
            this._showAllFilters = true;
            this._focusedIndex = 0;
            return true;
          }
          this._focusedIndex = (this._focusedIndex + 1) % count;
          return true;
        case 'ArrowUp':
          if (!opened) {
            return false;
          }
          this._focusedIndex = this._focusedIndex <= 0 ? count - 1 : this._focusedIndex - 1;
          return true;
        case 'Enter':
          if (!opened || this._focusedIndex < 0) {
            return false;
          }
          this.__pickSuggestion(this._suggestions[this._focusedIndex]);
          return true;
        case 'Tab':
          if (!opened || event.shiftKey) {
            return false;
          }
          this.__pickSuggestion(this._suggestions[Math.max(this._focusedIndex, 0)]);
          return true;
        case 'Escape':
          if (!opened) {
            return false;
          }
          this._suggestionsRequested = false;
          this._showAllFilters = false;
          return true;
        default:
          return false;
      }
    }

    /** @private */
    __updateSegments() {
      const filtersByName = new Map((this.filters || []).map((filter) => [filter.name, filter]));
      const segments = parseQuery(this.value || '');
      const words = [];
      const filters = [];

      segments.forEach((segment) => {
        if (segment.type === 'text') {
          words.push(segment.raw);
        } else if (segment.type === 'filter') {
          const filter = filtersByName.get(segment.name);
          segment.filter = filter;
          segment.valid = isValidFilterValue(segment, filter);
          if (segment.valid) {
            const option = filter.options && findOption(filter, segment.value);
            filters.push({ name: segment.name, value: option ? option.value : segment.value });
          }
        }
      });

      this._segments = segments;

      const query = { text: words.join(' '), filters };
      if (JSON.stringify(query) !== JSON.stringify(this.query)) {
        this._setQuery(query);
      }
    }

    /**
     * Returns the index of the non-whitespace segment containing the caret, or -1.
     * @protected
     */
    _getActiveSegmentIndex() {
      const caret = this._caret;
      if (caret < 0) {
        return -1;
      }
      return this._segments.findIndex(
        (segment) => segment.type !== 'space' && segment.start <= caret && caret <= segment.end,
      );
    }

    /** @private */
    __updateSuggestions() {
      const filters = this.filters || [];
      const segment = this._segments[this._getActiveSegmentIndex()];
      let suggestions = [];

      if (segment && segment.type === 'text') {
        const word = segment.raw.toLowerCase();
        suggestions = filters
          .filter(
            (filter) => filter.name.toLowerCase().startsWith(word) || (filter.label || '').toLowerCase().includes(word),
          )
          .map((filter) => ({ kind: 'name', filter, segment }));
      } else if (segment && segment.type === 'filter' && segment.filter) {
        const typed = segment.value.toLowerCase();
        suggestions = (segment.filter.options || [])
          .map(toOption)
          .filter(
            (option) =>
              option.value.toLowerCase().includes(typed) || (option.label || '').toLowerCase().includes(typed),
          )
          .map((option) => ({ kind: 'value', filter: segment.filter, option, segment }));
      } else if (!segment && this._showAllFilters) {
        suggestions = filters.map((filter) => ({ kind: 'name', filter }));
      }

      const changed =
        suggestions.length !== this._suggestions.length ||
        suggestions.some((suggestion, index) => {
          const old = this._suggestions[index];
          return old.filter !== suggestion.filter || old.option?.value !== suggestion.option?.value;
        });

      // Keep the segment references up to date, but only reset
      // the focused suggestion when the list actually changes.
      this._suggestions = suggestions;
      if (changed) {
        this._focusedIndex = this._showAllFilters && suggestions.length ? 0 : -1;
      }
    }

    /** @private */
    __pickSuggestion(suggestion) {
      const input = this.inputElement;
      const { filter, segment } = suggestion;
      const start = segment ? segment.start : this.__getCaret();
      const end = segment ? segment.end : start;

      if (suggestion.kind === 'name') {
        this.__replaceText(start, end, `${filter.name}:`);
        this._showAllFilters = false;
        this._suggestionsRequested = true;
      } else {
        const nextChar = input.value[end];
        const separator = nextChar && /\s/u.test(nextChar) ? '' : ' ';
        this.__replaceText(start, end, `${filter.name}:${formatFilterValue(suggestion.option.value)}${separator}`);
        if (!separator) {
          // Move the caret past the existing whitespace
          input.setSelectionRange(input.selectionEnd + 1, input.selectionEnd + 1);
        }
        this._suggestionsRequested = false;
      }

      // Browsers do not always scroll the caret into view after programmatic edits
      if (input.selectionEnd === input.value.length) {
        input.scrollLeft = input.scrollWidth;
      }
      this.__onSelectionChange();
    }

    /**
     * Replaces the given range of the input value with the text, using
     * `execCommand` where possible so that the change can be undone.
     * @private
     */
    __replaceText(start, end, text) {
      const input = this.inputElement;
      const expected = input.value.slice(0, start) + text + input.value.slice(end);

      input.setSelectionRange(start, end);
      if (this.__isInputFocused()) {
        document.execCommand('insertText', false, text);
      }

      if (input.value !== expected) {
        input.setRangeText(text, start, end, 'end');
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      }
    }

    /** @private */
    __isInputFocused() {
      return this.inputElement && this.inputElement.getRootNode().activeElement === this.inputElement;
    }

    /** @private */
    __getCaret() {
      const input = this.inputElement;
      return input ? input.selectionEnd : -1;
    }

    /** @private */
    __onSelectionChange() {
      this._caret = this.__isInputFocused() ? this.__getCaret() : -1;
      this.__syncScroll();
    }

    /** @private */
    __syncScroll() {
      const input = this.inputElement;
      const content = this.$ && this.$.highlightsContent;
      if (input && content) {
        content.style.transform = `translateX(${-input.scrollLeft}px)`;
      }
    }

    /** @private */
    __syncHighlightsGeometry() {
      const input = this.inputElement;
      const container = this.$.inputField;
      const highlights = this.$.highlights;
      if (!input || !container || !highlights) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      highlights.style.left = `${inputRect.left - containerRect.left - container.clientLeft}px`;
      highlights.style.top = `${inputRect.top - containerRect.top - container.clientTop}px`;
      highlights.style.width = `${inputRect.width}px`;
      highlights.style.height = `${inputRect.height}px`;
      this.__syncScroll();
    }

    /** @private */
    __updatePositionTarget() {
      const index = this._getActiveSegmentIndex();
      const token = index >= 0 && this.shadowRoot.querySelector(`[data-index="${index}"]`);
      this.$.overlay.positionTarget = token || this.$.inputField;
    }

    /** @private */
    __updateAria() {
      const input = this.inputElement;
      if (!input || !this._listBox) {
        return;
      }

      const opened = this._overlayOpened;
      input.setAttribute('aria-expanded', String(opened));
      if (opened) {
        input.setAttribute('aria-controls', this._listBox.id);
      } else {
        input.removeAttribute('aria-controls');
      }

      const focusedItem = opened && this._focusedIndex >= 0 && this._listBox.children[this._focusedIndex];
      if (focusedItem) {
        input.setAttribute('aria-activedescendant', focusedItem.id);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    /** @private */
    __renderSuggestions() {
      if (!this._listBox) {
        return;
      }

      const id = this._listBox.id;
      render(
        this._suggestions.map((suggestion, index) => {
          const { kind, filter, option } = suggestion;
          const text = kind === 'name' ? `${filter.name}:` : option.label || option.value;
          const description = kind === 'name' ? filter.label : option.label && option.value;
          return html`
            <vaadin-item
              id="${id}-${index}"
              ?focus-ring="${index === this._focusedIndex}"
              @click="${() => this.__pickSuggestion(suggestion)}"
              >${text}${description ? html` <small>${description}</small>` : nothing}</vaadin-item
            >
          `;
        }),
        this._listBox,
        { host: this },
      );
      this.__scrollFocusedIntoView();
    }

    /** @private */
    __scrollFocusedIntoView() {
      const item = this._listBox.children[this._focusedIndex];
      if (item && this._overlayOpened) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  };
