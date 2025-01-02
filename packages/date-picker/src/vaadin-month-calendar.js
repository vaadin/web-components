/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
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
            <th part="weekday" aria-hidden="true" hidden$="[[!__computeShowWeekSeparator(showWeekNumbers, i18n)]]"></th>
            <template is="dom-repeat" items="[[__computeWeekDayNames(i18n, showWeekNumbers)]]">
              <th role="columnheader" part="weekday" scope="col" abbr$="[[item.weekDay]]" aria-hidden="true">
                [[item.weekDayShort]]
              </th>
            </template>
          </tr>
        </thead>
        <tbody id="days-container">
          <template is="dom-repeat" items="[[_weeks]]" as="week">
            <tr role="row">
              <td
                part="week-number"
                aria-hidden="true"
                hidden$="[[!__computeShowWeekSeparator(showWeekNumbers, i18n)]]"
              >
                [[__computeWeekNumber(week)]]
              </td>
              <template is="dom-repeat" items="[[week]]">
                <td
                  role="gridcell"
                  part$="[[__computeDatePart(item, focusedDate, selectedDate, minDate, maxDate, isDateDisabled, enteredDate, __hasFocus)]]"
                  date="[[item]]"
                  tabindex$="[[__computeDayTabIndex(item, focusedDate)]]"
                  disabled$="[[__isDayDisabled(item, minDate, maxDate, isDateDisabled)]]"
                  aria-selected$="[[__computeDayAriaSelected(item, selectedDate)]]"
                  aria-disabled$="[[__computeDayAriaDisabled(item, minDate, maxDate, isDateDisabled)]]"
                  aria-label$="[[__computeDayAriaLabel(item)]]"
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
}

defineCustomElement(MonthCalendar);
