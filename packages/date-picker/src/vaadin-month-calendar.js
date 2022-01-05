/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateAllowed, dateEquals, getISOWeekNumber } from './vaadin-date-picker-helper.js';

/**
 * @extends HTMLElement
 * @private
 */
class MonthCalendar extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        #monthGrid {
          display: block;
        }

        #monthGrid thead,
        #monthGrid tbody {
          display: block;
          width: 100%;
        }

        [part='weekdays'],
        #days {
          display: flex;
          flex-wrap: wrap;
          flex-grow: 1;
        }

        #days-container tr,
        #weekdays-container tr {
          display: flex;
        }

        [part='week-numbers'] {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-shrink: 0;
        }

        [part='week-number'][hidden],
        [part='week-numbers'][hidden],
        [part='weekday'][hidden] {
          display: none;
        }

        [part='weekday'],
        [part='date'] {
          display: block;
          /* Would use calc(100% / 7) but it doesn't work nice on IE */
          width: 14.285714286%;
        }

        [part='weekday']:empty,
        [part='week-numbers'] {
          width: 12.5%;
          flex-shrink: 0;
        }
      </style>

      <div part="month-header" id="month-header" aria-hidden="true">[[_getTitle(month, i18n.monthNames)]]</div>
      <table id="monthGrid" role="grid" aria-labelledby="month-header">
        <thead id="weekdays-container">
          <tr role="row">
            <th
              role="columnheader"
              part="weekday"
              aria-hidden="true"
              hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n.firstDayOfWeek)]]"
            ></th>
            <template
              is="dom-repeat"
              items="[[_getWeekDayNames(i18n.weekdays, i18n.weekdaysShort, showWeekNumbers, i18n.firstDayOfWeek)]]"
            >
              <th role="columnheader" part="weekday" scope="col" abbr$="[[item.weekDay]]">[[item.weekDayShort]]</th>
            </template>
          </tr>
        </thead>
        <tbody id="days-container">
          <template is="dom-repeat" items="[[_weeks]]">
            <tr role="row">
              <td
                role="gridcell"
                part="week-number"
                aria-hidden="true"
                hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n.firstDayOfWeek)]]"
              >
                [[__getWeekNumber(item)]]
              </td>

              <template is="dom-repeat" items="[[item]]">
                <td
                  role="gridcell"
                  part="date"
                  date="[[item]]"
                  today$="[[__isToday(item)]]"
                  focused$="[[__isDayFocused(item, focusedDate)]]"
                  selected$="[[__isDaySelected(item, selectedDate)]]"
                  disabled$="[[__isDayDisabled(item, minDate, maxDate)]]"
                  tabindex$="[[__getDayTabindex(item, focusedDate)]]"
                  aria-disabled$="[[__getDayAriaDisabled(item, minDate, maxDate)]]"
                >
                  [[_getDate(item)]]
                </td>
              </template>
            </tr>
          </template>
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
        type: Date,
        value: new Date()
      },

      /**
       * A `Date` object for the currently selected date.
       */
      selectedDate: {
        type: Date,
        notify: true
      },

      /**
       * A `Date` object for the currently focused date.
       */
      focusedDate: Date,

      showWeekNumbers: {
        type: Boolean,
        value: false
      },

      i18n: {
        type: Object
      },

      /**
       * Flag stating whether taps on the component should be ignored.
       */
      ignoreTaps: Boolean,

      _notTapping: Boolean,

      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       */
      minDate: {
        type: Date,
        value: null
      },

      /**
       * The latest date that can be selected. All later dates will be disabled.
       */
      maxDate: {
        type: Date,
        value: null
      },

      _days: {
        type: Array,
        computed: '_getDays(month, i18n.firstDayOfWeek, minDate, maxDate)'
      },

      _weeks: {
        type: Array,
        computed: '_getWeeks(_days)'
      },

      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        computed: '_isDisabled(month, minDate, maxDate)'
      }
    };
  }

  static get observers() {
    return [
      '_showWeekNumbersChanged(showWeekNumbers, i18n.firstDayOfWeek)',
      '__focusedDateChanged(focusedDate, month)'
    ];
  }

  /** @protected */
  ready() {
    super.ready();
    addListener(this.$.monthGrid, 'tap', this._handleTap.bind(this));

    this.addEventListener('focusin', () => {
      this.setAttribute('focused', '');
    });

    this.addEventListener('focusout', () => {
      this.removeAttribute('focused');
    });
  }

  get focusableDateElement() {
    return [...this.shadowRoot.querySelectorAll('[part=date]')].find((datePart) => {
      return dateEquals(datePart.date, this.focusedDate);
    });
  }

  /* Returns true if all the dates in the month are out of the allowed range */
  _isDisabled(month, minDate, maxDate) {
    // First day of the month
    var firstDate = new Date(0, 0);
    firstDate.setFullYear(month.getFullYear());
    firstDate.setMonth(month.getMonth());
    firstDate.setDate(1);

    // Last day of the month
    var lastDate = new Date(0, 0);
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

  _getTitle(month, monthNames) {
    if (month === undefined || monthNames === undefined) {
      return;
    }
    return this.i18n.formatTitle(monthNames[month.getMonth()], month.getFullYear());
  }

  _onMonthGridTouchStart() {
    this._notTapping = false;
    setTimeout(() => (this._notTapping = true), 300);
  }

  _dateAdd(date, delta) {
    date.setDate(date.getDate() + delta);
  }

  _applyFirstDayOfWeek(weekDayNames, firstDayOfWeek) {
    if (weekDayNames === undefined || firstDayOfWeek === undefined) {
      return;
    }

    return weekDayNames.slice(firstDayOfWeek).concat(weekDayNames.slice(0, firstDayOfWeek));
  }

  _getWeekDayNames(weekDayNames, weekDayNamesShort, showWeekNumbers, firstDayOfWeek) {
    if (
      weekDayNames === undefined ||
      weekDayNamesShort === undefined ||
      showWeekNumbers === undefined ||
      firstDayOfWeek === undefined
    ) {
      return;
    }
    weekDayNames = this._applyFirstDayOfWeek(weekDayNames, firstDayOfWeek);
    weekDayNamesShort = this._applyFirstDayOfWeek(weekDayNamesShort, firstDayOfWeek);
    weekDayNames = weekDayNames.map((day, index) => {
      return {
        weekDay: day,
        weekDayShort: weekDayNamesShort[index]
      };
    });

    return weekDayNames;
  }

  __focusedDateChanged(focusedDate, _month) {
    if (this._days.some((date) => dateEquals(date, focusedDate))) {
      this.removeAttribute('aria-hidden');
    } else {
      this.setAttribute('aria-hidden', 'true');
    }
  }

  _getDate(date) {
    return date ? date.getDate() : '';
  }

  _showWeekNumbersChanged(showWeekNumbers, firstDayOfWeek) {
    if (showWeekNumbers && firstDayOfWeek === 1) {
      this.setAttribute('week-numbers', '');
    } else {
      this.removeAttribute('week-numbers');
    }
  }

  _showWeekSeparator(showWeekNumbers, firstDayOfWeek) {
    // Currently only supported for locales that start the week on Monday.
    return showWeekNumbers && firstDayOfWeek === 1;
  }

  __isToday(date) {
    return dateEquals(new Date(), date);
  }

  _getDays(month, firstDayOfWeek) {
    if (month === undefined || firstDayOfWeek === undefined) {
      return;
    }
    // First day of the month (at midnight).
    var date = new Date(0, 0);
    date.setFullYear(month.getFullYear());
    date.setMonth(month.getMonth());
    date.setDate(1);

    // Rewind to first day of the week.
    while (date.getDay() !== firstDayOfWeek) {
      this._dateAdd(date, -1);
    }

    var days = [];
    var startMonth = date.getMonth();
    var targetMonth = month.getMonth();
    while (date.getMonth() === targetMonth || date.getMonth() === startMonth) {
      days.push(date.getMonth() === targetMonth ? new Date(date.getTime()) : null);

      // Advance to next day.
      this._dateAdd(date, 1);
    }
    return days;
  }

  _getWeeks(days) {
    return days.reduce((accum, day, i) => {
      if (i % 7 === 0) {
        accum.push([]);
      }
      accum[accum.length - 1].push(day);
      return accum;
    }, []);
  }

  __getWeekNumber(days) {
    const date = days.reduce((acc, d) => {
      return !acc && d ? d : acc;
    });

    return getISOWeekNumber(date);
  }

  // __getWeekNumber(date, days) {
  //   if (date === undefined || days === undefined) {
  //     return;
  //   }

  //   if (!date) {
  //     // Get the first non-null date from the days array.
  //     date = days.reduce((acc, d) => {
  //       return !acc && d ? d : acc;
  //     });
  //   }

  //   return getISOWeekNumber(date);
  // }

  __isDayFocused(date, focusedDate) {
    return dateEquals(date, focusedDate);
  }

  __isDaySelected(date, selectedDate) {
    return dateEquals(date, selectedDate);
  }

  __isDayDisabled(date, minDate, maxDate) {
    return !dateAllowed(date, minDate, maxDate);
  }

  __getDayAriaDisabled(date, min, max) {
    if (date === undefined || min === undefined || max === undefined) {
      return;
    }

    return this.__isDayDisabled(date, min, max) ? 'true' : 'false';
  }

  __getDayTabindex(date, focusedDate) {
    if (this.__isDayFocused(date, focusedDate)) {
      return '0';
    }

    return '-1';
  }

  __getWeekNumbers(dates) {
    return dates
      .map((date) => this.__getWeekNumber(date, dates))
      .filter((week, index, arr) => arr.indexOf(week) === index);
  }

  _handleTap(e) {
    if (!this.ignoreTaps && !this._notTapping && e.target.date && !e.target.hasAttribute('disabled')) {
      this.selectedDate = e.target.date;
      this.dispatchEvent(new CustomEvent('date-tap', { bubbles: true, composed: true }));
    }
  }

  _preventDefault(e) {
    e.preventDefault();
  }
}

customElements.define(MonthCalendar.is, MonthCalendar);
