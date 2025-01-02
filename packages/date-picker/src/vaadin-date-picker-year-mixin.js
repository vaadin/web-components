/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const DatePickerYearMixin = (superClass) =>
  class DatePickerYearMixin extends superClass {
    static get properties() {
      return {
        year: {
          type: String,
          sync: true,
        },

        selectedDate: {
          type: Object,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__updateSelected(year, selectedDate)'];
    }

    /** @private */
    __updateSelected(year, selectedDate) {
      this.toggleAttribute('selected', selectedDate && selectedDate.getFullYear() === year);
      this.toggleAttribute('current', year === new Date().getFullYear());
    }
  };
