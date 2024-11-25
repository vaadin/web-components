/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { dateAllowed, dateEquals, getISOWeekNumber } from './vaadin-date-picker-helper.js';

/**
 * @polymerMixin
 * @mixes FocusMixin
 */
export const MonthCalendarMixin = (superClass) =>
  class MonthCalendarMixinClass extends FocusMixin(superClass) {
    static get properties() {
      return {
        /**
         * A `Date` object defining the month to be displayed. Only year and
         * month properties are actually used.
         */
        month: {
          type: Object,
          value: new Date(),
          sync: true,
        },

        /**
         * A `Date` object for the currently selected date.
         */
        selectedDate: {
          type: Object,
          notify: true,
          sync: true,
        },

        /**
         * A `Date` object for the currently focused date.
         */
        focusedDate: {
          type: Object,
        },

        /**
         * Set true to display ISO-8601 week numbers in the calendar. Notice that
         * displaying week numbers is only supported when `i18n.firstDayOfWeek`
         * is 1 (Monday).
         */
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
        ignoreTaps: {
          type: Boolean,
        },

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         */
        minDate: {
          type: Date,
          value: null,
          sync: true,
        },

        /**
         * The latest date that can be selected. All later dates will be disabled.
         */
        maxDate: {
          type: Date,
          value: null,
          sync: true,
        },

        /**
         * A function to be used to determine whether the user can select a given date.
         * Receives a `DatePickerDate` object of the date to be selected and should return a
         * boolean.
         * @type {Function | undefined}
         */
        isDateDisabled: {
          type: Function,
          value: () => false,
        },

        enteredDate: {
          type: Date,
        },

        disabled: {
          type: Boolean,
          reflectToAttribute: true,
        },

        /** @protected */
        _days: {
          type: Array,
        },

        /** @protected */
        _weeks: {
          type: Array,
        },

        /** @private */
        _notTapping: {
          type: Boolean,
        },

        /** @private */
        __hasFocus: {
          type: Boolean,
        },
      };
    }

    static get observers() {
      return ['__focusedDateChanged(focusedDate, _days)'];
    }

    get focusableDateElement() {
      return [...this.shadowRoot.querySelectorAll('[part~=date]')].find((datePart) => {
        return dateEquals(datePart.date, this.focusedDate);
      });
    }

    /** @protected */
    ready() {
      super.ready();
      addListener(this.$.monthGrid, 'tap', this._handleTap.bind(this));
    }

    /** @override */
    _setFocused(focused) {
      super._setFocused(focused);
      this.__hasFocus = focused;
    }

    /**
     * Returns true if all the dates in the month are out of the allowed range
     * @protected
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

    /** @protected */
    _getTitle(month, i18n) {
      if (month === undefined || i18n === undefined) {
        return;
      }
      return i18n.formatTitle(i18n.monthNames[month.getMonth()], month.getFullYear());
    }

    /** @protected */
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

    /** @protected */
    _getWeekDayNames(i18n, showWeekNumbers) {
      if (i18n === undefined || showWeekNumbers === undefined) {
        return [];
      }
      const { weekdays, weekdaysShort, firstDayOfWeek } = i18n;

      const weekDayNamesShort = this._applyFirstDayOfWeek(weekdaysShort, firstDayOfWeek);
      const weekDayNames = this._applyFirstDayOfWeek(weekdays, firstDayOfWeek);

      return weekDayNames
        .map((day, index) => {
          return {
            weekDay: day,
            weekDayShort: weekDayNamesShort[index],
          };
        })
        .slice(0, 7);
    }

    /** @private */
    __focusedDateChanged(focusedDate, days) {
      if (Array.isArray(days) && days.some((date) => dateEquals(date, focusedDate))) {
        this.removeAttribute('aria-hidden');
      } else {
        this.setAttribute('aria-hidden', 'true');
      }
    }

    /** @protected */
    _getDate(date) {
      return date ? date.getDate() : '';
    }

    /** @protected */
    _showWeekSeparator(showWeekNumbers, i18n) {
      // Currently only supported for locales that start the week on Monday.
      return showWeekNumbers && i18n && i18n.firstDayOfWeek === 1;
    }

    /** @protected */
    _isToday(date) {
      return dateEquals(new Date(), date);
    }

    /** @protected */
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

    /** @protected */
    _getWeeks(days) {
      return days.reduce((acc, day, i) => {
        if (i % 7 === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(day);
        return acc;
      }, []);
    }

    /** @protected */
    _handleTap(e) {
      if (!this.ignoreTaps && !this._notTapping && e.target.date && !e.target.hasAttribute('disabled')) {
        this.selectedDate = e.target.date;
        this.dispatchEvent(
          new CustomEvent('date-tap', { detail: { date: e.target.date }, bubbles: true, composed: true }),
        );
      }
    }

    /** @protected */
    _preventDefault(e) {
      e.preventDefault();
    }

    /** @protected */
    __getWeekNumber(days) {
      const date = days.reduce((acc, d) => {
        return !acc && d ? d : acc;
      });

      return getISOWeekNumber(date);
    }

    /** @protected */
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
  };
