/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateAllowed, dateEquals, getISOWeekNumber } from './vaadin-date-picker-helper.js';

/**
 * @extends HTMLElement
 * @private
 */
class MonthCalendar extends FocusMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      #monthGrid {
        width: 100%;
        border-collapse: collapse;
      }

      #days-container tr,
      #weekdays-container tr {
        display: flex;
      }

      [part~='date'] {
        outline: none;
      }

      [part~='disabled'] {
        pointer-events: none;
      }

      [part='week-number'][hidden],
      [part='weekday'][hidden] {
        display: none;
      }

      [part='weekday'],
      [part~='date'] {
        width: calc(100% / 7);
        padding: 0;
        font-weight: normal;
      }

      [part='weekday']:empty,
      [part='week-number'] {
        width: 12.5%;
        flex-shrink: 0;
        padding: 0;
      }

      :host([week-numbers]) [part='weekday']:not(:empty),
      :host([week-numbers]) [part~='date'] {
        width: 12.5%;
      }
    `;
  }

  render() {
    const weekDayNames = this._getWeekDayNames(this.i18n, this.showWeekNumbers);
    const weeks = this._weeks;
    const hideWeekSeparator = !this._showWeekNumbers;

    return html`
      <div part="month-header" id="month-header" aria-hidden="true">${this._getTitle(this.month, this.i18n)}</div>
      <table
        id="monthGrid"
        role="grid"
        aria-labelledby="month-header"
        @touchend="${this._preventDefault}"
        @touchstart="${this._onMonthGridTouchStart}"
      >
        <thead id="weekdays-container">
          <tr role="row" part="weekdays">
            <th part="weekday" aria-hidden="true" ?hidden="${hideWeekSeparator}"></th>
            ${weekDayNames.map(
              (item) => html`
                <th role="columnheader" part="weekday" scope="col" abbr="${item.weekDay}" aria-hidden="true">
                  ${item.weekDayShort}
                </th>
              `,
            )}
          </tr>
        </thead>
        <tbody id="days-container">
          ${weeks.map(
            (week) => html`
              <tr role="row">
                <td part="week-number" aria-hidden="true" ?hidden="${hideWeekSeparator}">
                  ${this.__getWeekNumber(week)}
                </td>
                ${week.map((date) => {
                  const isFocused = dateEquals(date, this.focusedDate);
                  const isSelected = dateEquals(date, this.selectedDate);
                  const isDisabled = !dateAllowed(date, this.minDate, this.maxDate);

                  const parts = [
                    'date',
                    isDisabled && 'disabled',
                    isFocused && 'focused',
                    isSelected && 'selected',
                    this._isToday(date) && 'today',
                  ].filter(Boolean);

                  return html`
                    <td
                      role="gridcell"
                      part="${parts.join(' ')}"
                      .date="${date}"
                      ?disabled="${isDisabled}"
                      tabindex="${isFocused ? '0' : '-1'}"
                      aria-selected="${isSelected ? 'true' : 'false'}"
                      aria-disabled="${isDisabled ? 'true' : 'false'}"
                      aria-label="${this.__getDayAriaLabel(date)}"
                      >${this._getDate(date)}</td
                    >
                  `;
                })}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  static get is() {
    return 'vaadin-month-calendar';
  }

  static get properties() {
    return {
      /**
       * A `Date` object defining the month to be displayed. Only year and
       * month properties are actually used.
       */
      month: {
        type: Object,
        value: new Date(),
      },

      /**
       * A `Date` object for the currently selected date.
       */
      selectedDate: {
        type: Object,
        notify: true,
      },

      /**
       * A `Date` object for the currently focused date.
       */
      focusedDate: {
        type: Object,
      },

      showWeekNumbers: {
        type: Boolean,
        value: false,
      },

      i18n: {
        type: Object,
      },

      /**
       * Flag stating whether taps on the component should be ignored.
       */
      ignoreTaps: Boolean,

      /** @private */
      _notTapping: Boolean,

      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       */
      minDate: {
        type: Object,
        value: null,
      },

      /**
       * The latest date that can be selected. All later dates will be disabled.
       */
      maxDate: {
        type: Object,
        value: null,
      },

      /** @private */
      _days: {
        type: Array,
      },

      /** @private */
      _weeks: {
        type: Array,
      },

      /** @private */
      _showWeekNumbers: {
        type: Boolean,
      },

      disabled: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  static get observers() {
    return ['__focusedDateChanged(focusedDate, _days)'];
  }

  /** @protected */
  ready() {
    super.ready();
    addListener(this.$.monthGrid, 'tap', this._handleTap.bind(this));
  }

  /** @protected */
  willUpdate(props) {
    if (props.has('month') || props.has('i18n')) {
      this._days = this._getDays(this.month, this.i18n);
      this._weeks = this._getWeeks(this._days);
    }

    if (props.has('month') || props.has('minDate') || props.has('maxDate')) {
      this.disabled = this._isDisabled(this.month, this.minDate, this.maxDate);
    }

    if (props.has('showWeekNumbers') || props.has('i18n')) {
      // Currently only supported for locales that start the week on Monday.
      this._showWeekNumbers = this.showWeekNumbers && this.i18n && this.i18n.firstDayOfWeek === 1;
      this.toggleAttribute('week-numbers', this._showWeekNumbers);
    }
  }

  get focusableDateElement() {
    return [...this.shadowRoot.querySelectorAll('[part~=date]')].find((datePart) => {
      return dateEquals(datePart.date, this.focusedDate);
    });
  }

  /**
   * Returns true if all the dates in the month are out of the allowed range
   * @private
   */
  _isDisabled(month, minDate, maxDate) {
    // First day of the month
    const firstDate = new Date(0, 0);
    firstDate.setFullYear(month.getFullYear());
    firstDate.setMonth(month.getMonth());
    firstDate.setDate(1);

    // Last day of the month
    const lastDate = new Date(0, 0);
    lastDate.setFullYear(month.getFullYear());
    lastDate.setMonth(month.getMonth() + 1);
    lastDate.setDate(0);

    if (
      minDate &&
      maxDate &&
      minDate.getMonth() === maxDate.getMonth() &&
      minDate.getMonth() === month.getMonth() &&
      maxDate.getDate() - minDate.getDate() >= 0
    ) {
      return false;
    }

    return !dateAllowed(firstDate, minDate, maxDate) && !dateAllowed(lastDate, minDate, maxDate);
  }

  /** @private */
  _getTitle(month, i18n) {
    if (month === undefined || i18n === undefined) {
      return;
    }
    return i18n.formatTitle(i18n.monthNames[month.getMonth()], month.getFullYear());
  }

  /** @private */
  _onMonthGridTouchStart() {
    this._notTapping = false;
    setTimeout(() => {
      this._notTapping = true;
    }, 300);
  }

  /** @private */
  _dateAdd(date, delta) {
    date.setDate(date.getDate() + delta);
  }

  /** @private */
  _applyFirstDayOfWeek(weekDayNames, firstDayOfWeek) {
    if (weekDayNames === undefined || firstDayOfWeek === undefined) {
      return;
    }

    return weekDayNames.slice(firstDayOfWeek).concat(weekDayNames.slice(0, firstDayOfWeek));
  }

  /** @private */
  _getWeekDayNames(i18n, showWeekNumbers) {
    if (i18n === undefined || showWeekNumbers === undefined) {
      return [];
    }
    const { weekdays, weekdaysShort, firstDayOfWeek } = i18n;

    const weekDayNamesShort = this._applyFirstDayOfWeek(weekdaysShort, firstDayOfWeek);
    const weekDayNames = this._applyFirstDayOfWeek(weekdays, firstDayOfWeek);

    return weekDayNames.map((day, index) => {
      return {
        weekDay: day,
        weekDayShort: weekDayNamesShort[index],
      };
    });
  }

  /** @private */
  __focusedDateChanged(focusedDate, days) {
    if (Array.isArray(days) && days.some((date) => dateEquals(date, focusedDate))) {
      this.removeAttribute('aria-hidden');
    } else {
      this.setAttribute('aria-hidden', 'true');
    }
  }

  /** @private */
  _getDate(date) {
    return date ? date.getDate() : '';
  }

  /** @private */
  _isToday(date) {
    return dateEquals(new Date(), date);
  }

  /** @private */
  _getDays(month, i18n) {
    if (month === undefined || i18n === undefined) {
      return [];
    }

    // First day of the month (at midnight).
    const date = new Date(0, 0);
    date.setFullYear(month.getFullYear());
    date.setMonth(month.getMonth());
    date.setDate(1);

    // Rewind to first day of the week.
    while (date.getDay() !== i18n.firstDayOfWeek) {
      this._dateAdd(date, -1);
    }

    const days = [];
    const startMonth = date.getMonth();
    const targetMonth = month.getMonth();
    while (date.getMonth() === targetMonth || date.getMonth() === startMonth) {
      days.push(date.getMonth() === targetMonth ? new Date(date.getTime()) : null);

      // Advance to next day.
      this._dateAdd(date, 1);
    }
    return days;
  }

  /** @private */
  _getWeeks(days) {
    return days.reduce((acc, day, i) => {
      if (i % 7 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(day);
      return acc;
    }, []);
  }

  /** @private */
  _handleTap(e) {
    if (!this.ignoreTaps && !this._notTapping && e.target.date && !e.target.hasAttribute('disabled')) {
      this.selectedDate = e.target.date;
      this.dispatchEvent(
        new CustomEvent('date-tap', { detail: { date: e.target.date }, bubbles: true, composed: true }),
      );
    }
  }

  /** @private */
  _preventDefault(e) {
    e.preventDefault();
  }

  /** @private */
  __getWeekNumber(days) {
    const date = days.reduce((acc, d) => {
      return !acc && d ? d : acc;
    });

    return getISOWeekNumber(date);
  }

  /** @private */
  __getDayAriaLabel(date) {
    if (!date) {
      return '';
    }

    let ariaLabel = `${this._getDate(date)} ${this.i18n.monthNames[date.getMonth()]} ${date.getFullYear()}, ${
      this.i18n.weekdays[date.getDay()]
    }`;

    if (this._isToday(date)) {
      ariaLabel += `, ${this.i18n.today}`;
    }

    return ariaLabel;
  }
}

customElements.define(MonthCalendar.is, MonthCalendar);
