/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateAllowed, dateEquals, getISOWeekNumber } from './vaadin-date-picker-helper.js';

/**
 * @extends HTMLElement
 * @private
 */
class MonthCalendar extends ThemableMixin(GestureEventListeners(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        [part='weekdays'],
        #days {
          display: flex;
          flex-wrap: wrap;
          flex-grow: 1;
        }

        #days-container,
        #weekdays-container {
          display: flex;
        }

        [part='week-numbers'] {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-shrink: 0;
        }

        [part='week-numbers'][hidden],
        [part='weekday'][hidden] {
          display: none;
        }

        [part='weekday'],
        [part='date'] {
          /* Would use calc(100% / 7) but it doesn't work nice on IE */
          width: 14.285714286%;
        }

        [part='weekday']:empty,
        [part='week-numbers'] {
          width: 12.5%;
          flex-shrink: 0;
        }
      </style>

      <div part="month-header" role="heading">[[_getTitle(month, i18n.monthNames)]]</div>
      <div id="monthGrid" on-tap="_handleTap" on-touchend="_preventDefault" on-touchstart="_onMonthGridTouchStart">
        <div id="weekdays-container">
          <div hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n.firstDayOfWeek)]]" part="weekday"></div>
          <div part="weekdays">
            <template
              is="dom-repeat"
              items="[[_getWeekDayNames(i18n.weekdays, i18n.weekdaysShort, showWeekNumbers, i18n.firstDayOfWeek)]]"
            >
              <div part="weekday" role="heading" aria-label$="[[item.weekDay]]">[[item.weekDayShort]]</div>
            </template>
          </div>
        </div>
        <div id="days-container">
          <div part="week-numbers" hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n.firstDayOfWeek)]]">
            <template is="dom-repeat" items="[[_getWeekNumbers(_days)]]">
              <div part="week-number" role="heading" aria-label$="[[i18n.week]] [[item]]">[[item]]</div>
            </template>
          </div>
          <div id="days">
            <template is="dom-repeat" items="[[_days]]">
              <!-- prettier-ignore -->
              <div
                part="date"
                today$="[[_isToday(item)]]"
                selected$="[[_dateEquals(item, selectedDate)]]"
                focused$="[[_dateEquals(item, focusedDate)]]"
                date="[[item]]"
                disabled$="[[!_dateAllowed(item, minDate, maxDate)]]"
                role$="[[_getRole(item)]]"
                aria-label$="[[_getAriaLabel(item)]]"
                aria-disabled$="[[_getAriaDisabled(item, minDate, maxDate)]]">[[_getDate(item)]]</div>
            </template>
          </div>
        </div>
      </div>
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

      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        computed: '_isDisabled(month, minDate, maxDate)'
      }
    };
  }

  static get observers() {
    return ['_showWeekNumbersChanged(showWeekNumbers, i18n.firstDayOfWeek)'];
  }

  _dateEquals(date1, date2) {
    return dateEquals(date1, date2);
  }

  _dateAllowed(date, min, max) {
    return dateAllowed(date, min, max);
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

    return !this._dateAllowed(firstDate, minDate, maxDate) && !this._dateAllowed(lastDate, minDate, maxDate);
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

  _isToday(date) {
    return this._dateEquals(new Date(), date);
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

  _getWeekNumber(date, days) {
    if (date === undefined || days === undefined) {
      return;
    }

    if (!date) {
      // Get the first non-null date from the days array.
      date = days.reduce((acc, d) => {
        return !acc && d ? d : acc;
      });
    }

    return getISOWeekNumber(date);
  }

  _getWeekNumbers(dates) {
    return dates
      .map((date) => this._getWeekNumber(date, dates))
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

  _getRole(date) {
    return date ? 'button' : 'presentation';
  }

  _getAriaLabel(date) {
    if (!date) {
      return '';
    }

    var ariaLabel =
      this._getDate(date) +
      ' ' +
      this.i18n.monthNames[date.getMonth()] +
      ' ' +
      date.getFullYear() +
      ', ' +
      this.i18n.weekdays[date.getDay()];

    if (this._isToday(date)) {
      ariaLabel += ', ' + this.i18n.today;
    }

    return ariaLabel;
  }

  _getAriaDisabled(date, min, max) {
    if (date === undefined || min === undefined || max === undefined) {
      return;
    }
    return this._dateAllowed(date, min, max) ? 'false' : 'true';
  }
}

customElements.define(MonthCalendar.is, MonthCalendar);
