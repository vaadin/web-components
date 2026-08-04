/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import {
  dateAllowed,
  dateEquals,
  dateSelectable,
  firstOfMonth,
  getISOWeekNumber,
  lastOfMonth,
  normalizeDate,
} from './vaadin-date-picker-helper.js';

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

        /**
         * The date-picker's controller resolving the metadata returned by its
         * `dateMetadataProvider`. Assigned by the overlay content, which also subscribes this
         * calendar to it.
         * @protected
         */
        _dateMetadataController: {
          type: Object,
          attribute: false,
          sync: true,
        },

        enteredDate: {
          type: Date,
        },

        disabled: {
          type: Boolean,
          reflectToAttribute: true,
          computed: '__computeDisabled(month, minDate, maxDate)',
        },

        /** @protected */
        _days: {
          type: Array,
          computed: '__computeDays(month, i18n, minDate, maxDate, isDateDisabled)',
        },

        /** @protected */
        _weeks: {
          type: Array,
          computed: '__computeWeeks(_days)',
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
      return ['__focusedDateChanged(focusedDate, _days)', '_showWeekNumbersChanged(showWeekNumbers, i18n)'];
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
    __computeDisabled(month, minDate, maxDate) {
      const firstDate = firstOfMonth(month);
      const lastDate = lastOfMonth(month);

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
    __computeWeekDayNames(i18n, showWeekNumbers) {
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
      const hasFocusedDate = Array.isArray(days) && days.some((date) => dateEquals(date, focusedDate));
      setOrRemoveAttribute(this, 'aria-hidden', !hasFocusedDate);
    }

    /** @protected */
    _getDate(date) {
      return date ? date.getDate() : '';
    }

    /** @protected */
    __computeShowWeekSeparator(showWeekNumbers, i18n) {
      // Currently only supported for locales that start the week on Monday.
      return showWeekNumbers && i18n?.firstDayOfWeek === 1;
    }

    /** @protected */
    _isToday(date) {
      return dateEquals(new Date(), date);
    }

    /** @protected */
    __computeDays(month, i18n) {
      if (month === undefined || i18n === undefined) {
        return [];
      }
      const date = firstOfMonth(month);

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
    __computeWeeks(days) {
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
    __computeWeekNumber(days) {
      const date = days.reduce((acc, d) => {
        return !acc && d ? d : acc;
      });

      return getISOWeekNumber(date);
    }

    /** @protected */
    __computeDayAriaLabel(date) {
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

    /** @private */
    _showWeekNumbersChanged(showWeekNumbers, i18n) {
      this.toggleAttribute('week-numbers', this.__computeShowWeekSeparator(showWeekNumbers, i18n));
    }

    // eslint-disable-next-line @typescript-eslint/max-params
    __computeDatePart(date, focusedDate, selectedDate, minDate, maxDate, isDateDisabled, enteredDate, hasFocus) {
      const result = ['date'];

      if (this.__isDayDisabled(date, minDate, maxDate, isDateDisabled)) {
        result.push('disabled');
      }

      if (date && this.__isMonthPending()) {
        result.push('loading');
      }

      if (dateEquals(date, focusedDate) && (hasFocus || dateEquals(date, enteredDate))) {
        result.push('focused');
      }

      if (this.__isDaySelected(date, selectedDate)) {
        result.push('selected');
      }

      if (this._isToday(date)) {
        result.push('today');
      }

      if (date < normalizeDate(new Date())) {
        result.push('past');
      }

      if (date > normalizeDate(new Date())) {
        result.push('future');
      }

      result.push(...this.__customDateParts(date));

      return result.join(' ');
    }

    /**
     * The part names the provider supplied for the date, so a theme can style specific dates with
     * `::part()`. Appearance only: what is disabled and what can be selected are decided from the
     * metadata's `disabled` flag, not from these, so a date cannot be made selectable through them.
     * @private
     */
    __customDateParts(date) {
      const part = date && this._dateMetadataController?.getMetadata(date)?.part;
      if (!part) {
        return [];
      }
      if (typeof part !== 'string') {
        issueWarning('Expected the `part` of a date metadata entry to be a string.');
        return [];
      }
      return part.split(' ').filter(Boolean);
    }

    /** @private */
    __isDaySelected(date, selectedDate) {
      return dateEquals(date, selectedDate);
    }

    /** @private */
    __computeDayAriaSelected(date, selectedDate) {
      return String(this.__isDaySelected(date, selectedDate));
    }

    /**
     * Whether the displayed month is currently being fetched, which is the same state the overlay
     * reports with its spinner. A month that has not been asked about yet is not pending: nothing is
     * loading, so there is nothing to report.
     * @private
     */
    __isMonthPending() {
      return !!this._dateMetadataController?.isMonthPending(this.month);
    }

    /** @private */
    __isDayDisabled(date, minDate, maxDate, isDateDisabled) {
      return !dateSelectable(date, minDate, maxDate, isDateDisabled, this._dateMetadataController);
    }

    /** @private */
    __computeDayAriaDisabled(date, min, max, isDateDisabled) {
      if (date === undefined) {
        return 'false';
      }

      const hasProvider = !!this._dateMetadataController?.provider;
      if (!hasProvider && min === undefined && max === undefined && isDateDisabled === undefined) {
        return 'false';
      }

      return String(this.__isDayDisabled(date, min, max, isDateDisabled));
    }

    /** @private */
    __computeDayTabIndex(date, focusedDate) {
      return dateEquals(date, focusedDate) ? '0' : '-1';
    }
  };
