/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-month-picker-button.js';
import { html, LitElement } from 'lit';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { monthPickerOverlayContentStyles } from './styles/vaadin-month-picker-overlay-content-base-styles.js';
import { isInvalid, isYearDisabled, yearMonthToValue } from './vaadin-month-picker-helpers.js';

/**
 * An element used internally by `<vaadin-month-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes KeyboardMixin
 * @mixes ThemableMixin
 * @private
 */
class MonthPickerOverlayContent extends KeyboardMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-month-picker-overlay-content';
  }

  static get styles() {
    return monthPickerOverlayContentStyles;
  }

  static get properties() {
    return {
      /**
       * The selected month in YYYY-MM format.
       */
      value: {
        type: String,
      },

      /**
       * The object to localize this component.
       */
      i18n: {
        type: Object,
      },

      /**
       * The currently opened year in the calendar.
       * TODO: use focusedYear instead?
       */
      openedYear: {
        type: Number,
        value: new Date().getFullYear(),
      },

      /**
       * The minimum selectable year
       */
      minYear: {
        type: String,
        value: null,
      },

      /**
       * The minimum selectable year
       */
      maxYear: {
        type: String,
        value: null,
      },

      /**
       * Reference to the owner (month-picker).
       */
      owner: {
        type: Object,
      },
    };
  }

  /**
   * Returns the month button element that should be focused (tabindex=0).
   */
  get focusedMonth() {
    return this.shadowRoot.querySelector('[part~="month"][tabindex="0"]');
  }

  /**
   * Returns the previous year button element.
   */
  get prevButton() {
    return this.shadowRoot.querySelector('[part~="prev-year-button"]');
  }

  /**
   * Returns the previous year button element.
   */
  get nextButton() {
    return this.shadowRoot.querySelector('[part~="next-year-button"]');
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'dialog');

    // TODO: vcf-month-picker used aria-labelledby for "year-label",
    // located in shadow DOM. Consider moving it to the slot instead.

    // TODO: consider moving prev and next buttons to light DOM slots
  }

  /** @protected */
  render() {
    return html`
      <div part="header">
        <vaadin-month-picker-button
          part="year-button prev-year-button"
          aria-label="Previous year"
          .disabled=${isYearDisabled(this.openedYear - 1, this.minYear, this.maxYear)}
          @click="${this._onPrevYearClick}"
        ></vaadin-month-picker-button>
        <span id="year-label" aria-live="polite">${this.openedYear}</span>
        <vaadin-month-picker-button
          part="year-button next-year-button"
          aria-label="Next year"
          .disabled=${isYearDisabled(this.openedYear + 1, this.minYear, this.maxYear)}
          @click="${this._onNextYearClick}"
        ></vaadin-month-picker-button>
      </div>

      <div part="month-grid" role="grid">
        ${this.i18n.monthNamesShort.map((label, index) => {
          const value = yearMonthToValue({
            year: this.openedYear,
            month: index + 1,
          });
          const disabled = isInvalid(value, this.minYear, this.maxYear);
          const selected = this.value === value;

          return html`
            <div
              role="gridcell"
              part="${this.__computeMonthPart(disabled, selected)}"
              data-value="${value}"
              aria-selected="${selected}"
              ?disabled="${disabled}"
              aria-disabled="${disabled}"
              tabindex=${selected || (!this.value && index === 0) ? '0' : '-1'}
              aria-label="${this.i18n.monthNames[index]} ${this.openedYear}"
              @click="${this._onMonthClick}"
              @keydown="${this.__onMonthKeyDown}"
            >
              ${label}
            </div>
          `;
        })}
      </div>
    `;
  }

  /** @private */
  __computeMonthPart(selected, disabled) {
    const result = ['month'];

    if (disabled) {
      result.push('disabled-month');
    }

    if (selected) {
      result.push('focused-month');
    }

    return result.join(' ');
  }

  /**
   * @protected
   * @override
   */
  _onKeyDown(event) {
    super._onKeyDown(event);

    if (event.key === 'Tab') {
      // Prevent from bubbling to the host
      event.stopPropagation();

      const target = event.composedPath()[0];

      // Tab / Shift + Tab on previous / next year button
      if ((target === this.prevButton && !event.shiftKey) || (target === this.nextButton && event.shiftKey)) {
        event.preventDefault();
        this.focusedMonth.focus();
      }

      // Tab on next year button, focus the input field
      if (target === this.nextButton && !event.shiftKey) {
        event.preventDefault();
        this.owner.focus();
      }

      // Tab / Shift + Tab on the month cell
      if (target.getAttribute('role') === 'gridcell') {
        event.preventDefault();
        event.stopPropagation();
        const button = event.shiftKey ? this.prevButton : this.nextButton;
        button.focus();
      }
    }
  }

  /** @private */
  _onMonthClick(event) {
    const { value } = event.target.dataset;
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('month-clicked', { detail: { value } }));
  }

  /** @private */
  __onMonthKeyDown(event) {
    if (event.key === 'Tab') {
      // Tab is handled separately
      return;
    }

    const months = [...this.shadowRoot.querySelectorAll('[part~="month"]:not([disabled])')];

    const focusedButton = this.shadowRoot.activeElement;
    const currentIndex = months.indexOf(focusedButton);

    if (currentIndex === -1) {
      return;
    }

    let newIndex = currentIndex;

    // TODO: add RTL support for Arrow Left / Arrow Right
    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < months.length - 1 ? currentIndex + 1 : currentIndex;
        break;
      case 'ArrowUp':
        newIndex = currentIndex - 4 >= 0 ? currentIndex - 4 : currentIndex;
        break;
      case 'ArrowDown':
        newIndex = currentIndex + 4 < months.length ? currentIndex + 4 : currentIndex;
        break;
      case 'Enter':
        this._onMonthClick(event);
        break;
      case ' ':
        this._onMonthClick(event);
        break;
      default:
        break;
    }

    if (newIndex !== currentIndex) {
      event.preventDefault();
      months[newIndex].focus();
    }
  }

  /** @private */
  _onPrevYearClick() {
    this.openedYear -= 1;
  }

  /** @private */
  _onNextYearClick() {
    this.openedYear += 1;
  }
}

defineCustomElement(MonthPickerOverlayContent);

export { MonthPickerOverlayContent };
