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
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
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
class MonthPickerOverlayContent extends KeyboardMixin(
  DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-month-picker-overlay-content';
  }

  static get styles() {
    return monthPickerOverlayContentStyles;
  }

  static get lumoInjector() {
    return {
      includeBaseStyles: true,
    };
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
       * The year currently shown in the calendar.
       */
      currentYear: {
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

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'dialog');

    this.addController(
      new SlotController(this, 'prev-button', 'vaadin-month-picker-button', {
        observe: false,
        initializer: (btn) => {
          btn.addEventListener('click', this._onPrevYearClick.bind(this));
          this._prevButton = btn;
        },
      }),
    );

    this._yearLabelController = new SlotController(this, 'year-label', 'span', {
      useUniqueId: true,
      initializer: (span) => {
        const id = this._yearLabelController.defaultId;
        span.id = id;
        this.setAttribute('aria-labelledby', id);
        this._yearLabel = span;
      },
    });

    this.addController(this._yearLabelController);

    this.addController(
      new SlotController(this, 'next-button', 'vaadin-month-picker-button', {
        observe: false,
        initializer: (btn) => {
          btn.addEventListener('click', this._onNextYearClick.bind(this));
          this._nextButton = btn;
        },
      }),
    );
  }

  /** @protected */
  render() {
    return html`
      <div part="header">
        <slot name="prev-button"></slot>
        <slot name="year-label"></slot>
        <slot name="next-button"></slot>
      </div>

      <div part="month-grid" role="grid">
        ${this.i18n.monthNamesShort.map((label, index) => {
          const value = yearMonthToValue({
            year: this.currentYear,
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
              aria-label="${this.i18n.monthNames[index]} ${this.currentYear}"
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

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('currentYear')) {
      this._yearLabel.textContent = this.currentYear;
    }

    if (props.has('currentYear') || props.has('minYear') || props.has('maxYear')) {
      this._prevButton.disabled = isYearDisabled(this.currentYear - 1, this.minYear, this.maxYear);
      this._nextButton.disabled = isYearDisabled(this.currentYear + 1, this.minYear, this.maxYear);
    }

    if (props.has('i18n')) {
      this._prevButton.setAttribute('aria-label', this.i18n.prevYear);
      this._nextButton.setAttribute('aria-label', this.i18n.nextYear);
    }
  }

  /** @private */
  __computeMonthPart(disabled, selected) {
    const result = ['month'];

    if (disabled) {
      result.push('disabled-month');
    }

    if (selected) {
      result.push('selected-month');
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
      if ((target === this._prevButton && !event.shiftKey) || (target === this._nextButton && event.shiftKey)) {
        event.preventDefault();
        // TODO: current behavior is implemented based on the add-on
        // where months are only focusable within the current year.
        // This can be an a11y issue, consider changing the logic.
        if (this.focusedMonth) {
          this.focusedMonth.focus();
        } else if (target === this._prevButton && !event.shiftKey) {
          this._nextButton.focus();
        } else if (target === this._nextButton && event.shiftKey) {
          this._prevButton.focus();
        }
      }

      // Tab on next year button, focus the input field
      if (target === this._nextButton && !event.shiftKey) {
        event.preventDefault();
        this.owner.focus();
      }

      // Tab / Shift + Tab on the month cell
      if (target.getAttribute('role') === 'gridcell') {
        event.preventDefault();
        event.stopPropagation();
        const button = event.shiftKey ? this._prevButton : this._nextButton;
        button.focus();
      }
    }
  }

  /** @private */
  _onMonthClick(event) {
    const { value } = event.target.dataset;
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('month-click', { detail: { value } }));
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
    this.currentYear -= 1;
  }

  /** @private */
  _onNextYearClick() {
    this.currentYear += 1;
  }
}

defineCustomElement(MonthPickerOverlayContent);

export { MonthPickerOverlayContent };
