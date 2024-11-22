/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateAllowed, dateEquals, normalizeDate } from './vaadin-date-picker-helper.js';
import { MonthCalendarMixin } from './vaadin-month-calendar-mixin.js';
import { monthCalendarStyles } from './vaadin-month-calendar-styles.js';

registerStyles('vaadin-month-calendar', monthCalendarStyles, {
  moduleId: 'vaadin-month-calendar-styles',
});

/**
 * @customElement
 * @extends HTMLElement
 * @private
 */
class MonthCalendar extends MonthCalendarMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <div part="month-header" id="month-header" aria-hidden="true">[[_getTitle(month, i18n)]]</div>
      <table
        id="monthGrid"
        role="grid"
        aria-labelledby="month-header"
        on-touchend="_preventDefault"
        on-touchstart="_onMonthGridTouchStart"
      >
        <thead id="weekdays-container">
          <tr role="row" part="weekdays">
            <th part="weekday" aria-hidden="true" hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n)]]"></th>
            <template is="dom-repeat" items="[[_getWeekDayNames(i18n, showWeekNumbers)]]">
              <th role="columnheader" part="weekday" scope="col" abbr$="[[item.weekDay]]" aria-hidden="true">
                [[item.weekDayShort]]
              </th>
            </template>
          </tr>
        </thead>
        <tbody id="days-container">
          <template is="dom-repeat" items="[[_weeks]]" as="week">
            <tr role="row">
              <td part="week-number" aria-hidden="true" hidden$="[[!_showWeekSeparator(showWeekNumbers, i18n)]]">
                [[__getWeekNumber(week)]]
              </td>
              <template is="dom-repeat" items="[[week]]">
                <td
                  role="gridcell"
                  part$="[[__getDatePart(item, focusedDate, selectedDate, minDate, maxDate, isDateDisabled, enteredDate, __hasFocus)]]"
                  date="[[item]]"
                  tabindex$="[[__getDayTabindex(item, focusedDate)]]"
                  disabled$="[[__isDayDisabled(item, minDate, maxDate, isDateDisabled)]]"
                  aria-selected$="[[__getDayAriaSelected(item, selectedDate)]]"
                  aria-disabled$="[[__getDayAriaDisabled(item, minDate, maxDate, isDateDisabled)]]"
                  aria-label$="[[__getDayAriaLabel(item)]]"
                  >[[_getDate(item)]]</td
                >
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
      /** @protected */
      _days: {
        type: Array,
        computed: '_getDays(month, i18n, minDate, maxDate, isDateDisabled)',
      },

      /** @protected */
      _weeks: {
        type: Array,
        computed: '_getWeeks(_days)',
      },

      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        computed: '_isDisabled(month, minDate, maxDate)',
      },
    };
  }

  static get observers() {
    return ['_showWeekNumbersChanged(showWeekNumbers, i18n)'];
  }

  /** @private */
  _showWeekNumbersChanged(showWeekNumbers, i18n) {
    if (showWeekNumbers && i18n && i18n.firstDayOfWeek === 1) {
      this.setAttribute('week-numbers', '');
    } else {
      this.removeAttribute('week-numbers');
    }
  }

  /** @private */
  // eslint-disable-next-line @typescript-eslint/max-params
  __getDatePart(date, focusedDate, selectedDate, minDate, maxDate, isDateDisabled, enteredDate, hasFocus) {
    const result = ['date'];
    const greaterThanToday = date > normalizeDate(new Date());
    const lessThanToday = date < normalizeDate(new Date());

    if (this.__isDayDisabled(date, minDate, maxDate, isDateDisabled)) {
      result.push('disabled');
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

    if (lessThanToday) {
      result.push('past');
    }

    if (greaterThanToday) {
      result.push('future');
    }

    return result.join(' ');
  }

  /** @private */
  __isDaySelected(date, selectedDate) {
    return dateEquals(date, selectedDate);
  }

  /** @private */
  __getDayAriaSelected(date, selectedDate) {
    if (this.__isDaySelected(date, selectedDate)) {
      return 'true';
    }
  }

  /** @private */
  __isDayDisabled(date, minDate, maxDate, isDateDisabled) {
    return !dateAllowed(date, minDate, maxDate, isDateDisabled);
  }

  /** @private */
  __getDayAriaDisabled(date, min, max, isDateDisabled) {
    if (date === undefined || (min === undefined && max === undefined && isDateDisabled === undefined)) {
      return;
    }

    if (this.__isDayDisabled(date, min, max, isDateDisabled)) {
      return 'true';
    }
  }

  /** @private */
  __getDayTabindex(date, focusedDate) {
    return dateEquals(date, focusedDate) ? '0' : '-1';
  }
}

defineCustomElement(MonthCalendar);
