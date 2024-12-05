/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateAllowed, dateEquals, normalizeDate } from './vaadin-date-picker-helper.js';
import { MonthCalendarMixin } from './vaadin-month-calendar-mixin.js';
import { monthCalendarStyles } from './vaadin-month-calendar-styles.js';

/**
 * @extends HTMLElement
 * @private
 */
class MonthCalendar extends MonthCalendarMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-month-calendar';
  }

  static get styles() {
    return monthCalendarStyles;
  }

  /** @protected */
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
                  const isFocused =
                    dateEquals(date, this.focusedDate) && (this.__hasFocus || dateEquals(date, this.enteredDate));
                  const tabIndex = dateEquals(date, this.focusedDate) ? '0' : '-1';
                  const isSelected = dateEquals(date, this.selectedDate);
                  const isDisabled = !dateAllowed(date, this.minDate, this.maxDate, this.isDateDisabled);
                  const greaterThanToday = date > normalizeDate(new Date());
                  const lessThanToday = date < normalizeDate(new Date());

                  const parts = [
                    'date',
                    isDisabled && 'disabled',
                    isFocused && 'focused',
                    isSelected && 'selected',
                    this._isToday(date) && 'today',
                    greaterThanToday && 'future',
                    lessThanToday && 'past',
                  ].filter(Boolean);

                  return html`
                    <td
                      role="gridcell"
                      part="${parts.join(' ')}"
                      .date="${date}"
                      ?disabled="${isDisabled}"
                      tabindex="${tabIndex}"
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

  /** @protected */
  willUpdate(props) {
    // Calculate these properties in `willUpdate()` instead of marking
    // them as `computed` to avoid extra update because of `sync: true`
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
}

defineCustomElement(MonthCalendar);
