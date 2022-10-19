/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-month-calendar.js';
import './vaadin-infinite-scroller.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { addListener, setTouchAction } from '@vaadin/component-base/src/gestures.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateEquals, extractDateParts, getClosestDate } from './vaadin-date-picker-helper.js';

/**
 * @extends HTMLElement
 * @private
 */
class DatePickerOverlayContent extends ControllerMixin(ThemableMixin(DirMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          outline: none;
        }

        [part='overlay-header'] {
          display: flex;
          flex-shrink: 0;
          flex-wrap: nowrap;
          align-items: center;
        }

        :host(:not([fullscreen])) [part='overlay-header'] {
          display: none;
        }

        [part='label'] {
          flex-grow: 1;
        }

        [hidden] {
          display: none !important;
        }

        [part='years-toggle-button'] {
          display: flex;
        }

        #scrollers {
          display: flex;
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        [part='months'],
        [part='years'] {
          height: 100%;
        }

        [part='months'] {
          --vaadin-infinite-scroller-item-height: 270px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        #scrollers[desktop] [part='months'] {
          right: 50px;
          transform: none !important;
        }

        [part='years'] {
          --vaadin-infinite-scroller-item-height: 80px;
          width: 50px;
          position: absolute;
          right: 0;
          transform: translateX(100%);
          -webkit-tap-highlight-color: transparent;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          /* Center the year scroller position. */
          --vaadin-infinite-scroller-buffer-offset: 50%;
        }

        #scrollers[desktop] [part='years'] {
          position: absolute;
          transform: none !important;
        }

        [part='years']::before {
          content: '';
          display: block;
          background: transparent;
          width: 0;
          height: 0;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          border-width: 6px;
          border-style: solid;
          border-color: transparent;
          border-left-color: #000;
        }

        :host(.animate) [part='months'],
        :host(.animate) [part='years'] {
          transition: all 200ms;
        }

        [part='toolbar'] {
          display: flex;
          justify-content: space-between;
          z-index: 2;
          flex-shrink: 0;
        }
      </style>

      <div part="overlay-header" on-touchend="_preventDefault" desktop$="[[_desktopMode]]" aria-hidden="true">
        <div part="label">[[_formatDisplayed(selectedDate, i18n.formatDate, label)]]</div>
        <div part="clear-button" hidden$="[[!selectedDate]]"></div>
        <div part="toggle-button"></div>

        <div part="years-toggle-button" hidden$="[[_desktopMode]]" aria-hidden="true">
          [[_yearAfterXMonths(_visibleMonthIndex)]]
        </div>
      </div>

      <div id="scrollers" desktop$="[[_desktopMode]]">
        <vaadin-infinite-scroller
          id="monthScroller"
          on-custom-scroll="_onMonthScroll"
          on-touchstart="_onMonthScrollTouchStart"
          buffer-size="3"
          active="[[initialPosition]]"
          part="months"
        >
          <template>
            <vaadin-month-calendar
              i18n="[[i18n]]"
              month="[[_dateAfterXMonths(index)]]"
              selected-date="{{selectedDate}}"
              focused-date="[[focusedDate]]"
              ignore-taps="[[_ignoreTaps]]"
              show-week-numbers="[[showWeekNumbers]]"
              min-date="[[minDate]]"
              max-date="[[maxDate]]"
              part="month"
              theme$="[[_theme]]"
              on-keydown="__onMonthCalendarKeyDown"
            >
            </vaadin-month-calendar>
          </template>
        </vaadin-infinite-scroller>
        <vaadin-infinite-scroller
          id="yearScroller"
          on-custom-scroll="_onYearScroll"
          on-touchstart="_onYearScrollTouchStart"
          buffer-size="12"
          active="[[initialPosition]]"
          part="years"
          aria-hidden="true"
        >
          <template>
            <div
              part="year-number"
              current$="[[_isCurrentYear(index)]]"
              selected$="[[_isSelectedYear(index, selectedDate)]]"
            >
              [[_yearAfterXYears(index)]]
            </div>
            <div part="year-separator" aria-hidden="true"></div>
          </template>
        </vaadin-infinite-scroller>
      </div>

      <div on-touchend="_preventDefault" role="toolbar" part="toolbar">
        <vaadin-button
          id="todayButton"
          part="today-button"
          theme="tertiary"
          disabled="[[!_isTodayAllowed(minDate, maxDate)]]"
          on-keydown="__onTodayButtonKeyDown"
        >
          [[i18n.today]]
        </vaadin-button>
        <vaadin-button id="cancelButton" part="cancel-button" theme="tertiary" on-keydown="__onCancelButtonKeyDown">
          [[i18n.cancel]]
        </vaadin-button>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-date-picker-overlay-content';
  }

  static get properties() {
    return {
      scrollDuration: {
        type: Number,
        value: 300,
      },

      /**
       * The value for this element.
       */
      selectedDate: {
        type: Date,
        value: null,
      },

      /**
       * Date value which is focused using keyboard.
       */
      focusedDate: {
        type: Date,
        notify: true,
        observer: '_focusedDateChanged',
      },

      _focusedMonthDate: Number,

      /**
       * Date which should be visible when there is no value selected.
       */
      initialPosition: {
        type: Date,
        observer: '_initialPositionChanged',
      },

      _originDate: {
        value: new Date(),
      },

      _visibleMonthIndex: Number,

      _desktopMode: Boolean,

      _desktopMediaQuery: {
        type: String,
        value: '(min-width: 375px)',
      },

      _translateX: {
        observer: '_translateXChanged',
      },

      _yearScrollerWidth: {
        value: 50,
      },

      i18n: {
        type: Object,
      },

      showWeekNumbers: {
        type: Boolean,
      },

      _ignoreTaps: Boolean,

      _notTapping: Boolean,

      /**
       * The earliest date that can be selected. All earlier dates will be disabled.
       */
      minDate: Date,

      /**
       * The latest date that can be selected. All later dates will be disabled.
       */
      maxDate: Date,

      /**
       * Input label
       */
      label: String,
    };
  }

  get __isRTL() {
    return this.getAttribute('dir') === 'rtl';
  }

  /**
   * Whether to scroll to a sub-month position when scrolling to a date.
   * This is active if the month scroller is not large enough to fit a
   * full month. In that case we want to scroll to a position between
   * two months in order to have the focused date in the visible area.
   * @returns {boolean} whether to use sub-month scrolling
   * @private
   */
  get __useSubMonthScrolling() {
    return this.$.monthScroller.clientHeight < this.$.monthScroller.itemHeight + this.$.monthScroller.bufferOffset;
  }

  get calendars() {
    return [...this.shadowRoot.querySelectorAll('vaadin-month-calendar')];
  }

  get focusableDateElement() {
    return this.calendars.map((calendar) => calendar.focusableDateElement).find(Boolean);
  }

  ready() {
    super.ready();

    this.setAttribute('role', 'dialog');

    addListener(this.$.scrollers, 'track', this._track.bind(this));
    addListener(this.shadowRoot.querySelector('[part="clear-button"]'), 'tap', this._clear.bind(this));
    addListener(this.shadowRoot.querySelector('[part="today-button"]'), 'tap', this._onTodayTap.bind(this));
    addListener(this.shadowRoot.querySelector('[part="cancel-button"]'), 'tap', this._cancel.bind(this));
    addListener(this.shadowRoot.querySelector('[part="toggle-button"]'), 'tap', this._cancel.bind(this));
    addListener(this.shadowRoot.querySelector('[part="years"]'), 'tap', this._onYearTap.bind(this));
    addListener(
      this.shadowRoot.querySelector('[part="years-toggle-button"]'),
      'tap',
      this._toggleYearScroller.bind(this),
    );

    this.addController(
      new MediaQueryController(this._desktopMediaQuery, (matches) => {
        this._desktopMode = matches;
      }),
    );
  }

  /**
   * Fired when the scroller reaches the target scrolling position.
   * @event scroll-animation-finished
   * @param {Number} detail.position new position
   * @param {Number} detail.oldPosition old position
   */

  connectedCallback() {
    super.connectedCallback();
    this._closeYearScroller();
    this._toggleAnimateClass(true);
    setTouchAction(this.$.scrollers, 'pan-y');
  }

  /**
   * Focuses the cancel button
   */
  focusCancel() {
    this.$.cancelButton.focus();
  }

  /**
   * Scrolls the list to the given Date.
   */
  scrollToDate(date, animate) {
    const offset = this.__useSubMonthScrolling ? this._calculateWeekScrollOffset(date) : 0;
    this._scrollToPosition(this._differenceInMonths(date, this._originDate) + offset, animate);
    this.$.monthScroller.forceUpdate();
  }

  /**
   * Select a date and fire event indicating user interaction.
   * @protected
   */
  _selectDate(dateToSelect) {
    this.selectedDate = dateToSelect;
    this.dispatchEvent(
      new CustomEvent('date-selected', { detail: { date: dateToSelect }, bubbles: true, composed: true }),
    );
  }

  _focusedDateChanged(focusedDate) {
    this.revealDate(focusedDate);
  }

  _isCurrentYear(yearsFromNow) {
    return yearsFromNow === 0;
  }

  _isSelectedYear(yearsFromNow, selectedDate) {
    if (selectedDate) {
      return selectedDate.getFullYear() === this._originDate.getFullYear() + yearsFromNow;
    }
  }

  /**
   * Scrolls the month and year scrollers enough to reveal the given date.
   */
  revealDate(date, animate = true) {
    if (!date) {
      return;
    }
    const diff = this._differenceInMonths(date, this._originDate);
    // If scroll area does not fit the full month, then always scroll with an offset to
    // approximately display the week of the date
    if (this.__useSubMonthScrolling) {
      const offset = this._calculateWeekScrollOffset(date);
      this._scrollToPosition(diff + offset, animate);
      return;
    }

    // Otherwise determine if we need to scroll to make the month of the date visible
    const scrolledAboveViewport = this.$.monthScroller.position > diff;

    const visibleArea = Math.max(
      this.$.monthScroller.itemHeight,
      this.$.monthScroller.clientHeight - this.$.monthScroller.bufferOffset * 2,
    );
    const visibleItems = visibleArea / this.$.monthScroller.itemHeight;
    const scrolledBelowViewport = this.$.monthScroller.position + visibleItems - 1 < diff;

    if (scrolledAboveViewport) {
      this._scrollToPosition(diff, animate);
    } else if (scrolledBelowViewport) {
      this._scrollToPosition(diff - visibleItems + 1, animate);
    }
  }

  /**
   * Calculates an offset to be added to the month scroll position
   * when using sub-month scrolling, in order ensure that the week
   * that the date is in is visible even for small scroll areas.
   * As the month scroller uses a month as minimal scroll unit
   * (a value of `1` equals one month), we can not exactly identify
   * the position of a specific week. This is a best effort
   * implementation based on manual testing.
   * @param date the date for which to calculate the offset
   * @returns {number} the offset
   * @private
   */
  _calculateWeekScrollOffset(date) {
    // Get first day of month
    const temp = new Date(0, 0);
    temp.setFullYear(date.getFullYear());
    temp.setMonth(date.getMonth());
    temp.setDate(1);
    // Determine week (=row index) of date within the month
    let week = 0;
    while (temp.getDate() < date.getDate()) {
      temp.setDate(temp.getDate() + 1);
      if (temp.getDay() === this.i18n.firstDayOfWeek) {
        week += 1;
      }
    }
    // Calculate magic number that approximately keeps the week visible
    return week / 6;
  }

  _initialPositionChanged(initialPosition) {
    this.scrollToDate(initialPosition);
  }

  _repositionYearScroller() {
    this._visibleMonthIndex = Math.floor(this.$.monthScroller.position);
    this.$.yearScroller.position = (this.$.monthScroller.position + this._originDate.getMonth()) / 12;
  }

  _repositionMonthScroller() {
    this.$.monthScroller.position = this.$.yearScroller.position * 12 - this._originDate.getMonth();
    this._visibleMonthIndex = Math.floor(this.$.monthScroller.position);
  }

  _onMonthScroll() {
    this._repositionYearScroller();
    this._doIgnoreTaps();
  }

  _onYearScroll() {
    this._repositionMonthScroller();
    this._doIgnoreTaps();
  }

  _onYearScrollTouchStart() {
    this._notTapping = false;
    setTimeout(() => {
      this._notTapping = true;
    }, 300);

    this._repositionMonthScroller();
  }

  _onMonthScrollTouchStart() {
    this._repositionYearScroller();
  }

  _doIgnoreTaps() {
    this._ignoreTaps = true;
    this._debouncer = Debouncer.debounce(this._debouncer, timeOut.after(300), () => {
      this._ignoreTaps = false;
    });
  }

  _formatDisplayed(date, formatDate, label) {
    if (date) {
      return formatDate(extractDateParts(date));
    }
    return label;
  }

  _onTodayTap() {
    const today = new Date();

    if (Math.abs(this.$.monthScroller.position - this._differenceInMonths(today, this._originDate)) < 0.001) {
      // Select today only if the month scroller is positioned approximately
      // at the beginning of the current month
      this._selectDate(today);
      this._close();
    } else {
      this._scrollToCurrentMonth();
    }
  }

  _scrollToCurrentMonth() {
    if (this.focusedDate) {
      this.focusedDate = new Date();
    }

    this.scrollToDate(new Date(), true);
  }

  _onYearTap(e) {
    if (!this._ignoreTaps && !this._notTapping) {
      const scrollDelta =
        e.detail.y - (this.$.yearScroller.getBoundingClientRect().top + this.$.yearScroller.clientHeight / 2);
      const yearDelta = scrollDelta / this.$.yearScroller.itemHeight;
      this._scrollToPosition(this.$.monthScroller.position + yearDelta * 12, true);
    }
  }

  _scrollToPosition(targetPosition, animate) {
    if (this._targetPosition !== undefined) {
      this._targetPosition = targetPosition;
      return;
    }

    if (!animate) {
      this.$.monthScroller.position = targetPosition;
      this._targetPosition = undefined;
      this._repositionYearScroller();
      this.__tryFocusDate();
      return;
    }

    this._targetPosition = targetPosition;

    let revealResolve;
    this._revealPromise = new Promise((resolve) => {
      revealResolve = resolve;
    });

    // http://gizma.com/easing/
    const easingFunction = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) {
        return (c / 2) * t * t + b;
      }
      t -= 1;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    let start = 0;
    const initialPosition = this.$.monthScroller.position;

    const smoothScroll = (timestamp) => {
      start = start || timestamp;
      const currentTime = timestamp - start;

      if (currentTime < this.scrollDuration) {
        const currentPos = easingFunction(
          currentTime,
          initialPosition,
          this._targetPosition - initialPosition,
          this.scrollDuration,
        );
        this.$.monthScroller.position = currentPos;
        window.requestAnimationFrame(smoothScroll);
      } else {
        this.dispatchEvent(
          new CustomEvent('scroll-animation-finished', {
            bubbles: true,
            composed: true,
            detail: {
              position: this._targetPosition,
              oldPosition: initialPosition,
            },
          }),
        );

        this.$.monthScroller.position = this._targetPosition;
        this._targetPosition = undefined;

        revealResolve();
        this._revealPromise = undefined;
      }

      setTimeout(this._repositionYearScroller.bind(this), 1);
    };

    // Start the animation.
    window.requestAnimationFrame(smoothScroll);
  }

  _limit(value, range) {
    return Math.min(range.max, Math.max(range.min, value));
  }

  _handleTrack(e) {
    // Check if horizontal movement threshold (dx) not exceeded or
    // scrolling fast vertically (ddy).
    if (Math.abs(e.detail.dx) < 10 || Math.abs(e.detail.ddy) > 10) {
      return;
    }

    // If we're flinging quickly -> start animating already.
    if (Math.abs(e.detail.ddx) > this._yearScrollerWidth / 3) {
      this._toggleAnimateClass(true);
    }

    const newTranslateX = this._translateX + e.detail.ddx;
    this._translateX = this._limit(newTranslateX, {
      min: 0,
      max: this._yearScrollerWidth,
    });
  }

  _track(e) {
    if (this._desktopMode) {
      // No need to track for swipe gestures on desktop.
      return;
    }

    switch (e.detail.state) {
      case 'start':
        this._toggleAnimateClass(false);
        break;
      case 'track':
        this._handleTrack(e);
        break;
      case 'end':
        this._toggleAnimateClass(true);
        if (this._translateX >= this._yearScrollerWidth / 2) {
          this._closeYearScroller();
        } else {
          this._openYearScroller();
        }
        break;
      default:
        break;
    }
  }

  _toggleAnimateClass(enable) {
    if (enable) {
      this.classList.add('animate');
    } else {
      this.classList.remove('animate');
    }
  }

  _toggleYearScroller() {
    if (this._isYearScrollerVisible()) {
      this._closeYearScroller();
    } else {
      this._openYearScroller();
    }
  }

  _openYearScroller() {
    this._translateX = 0;
    this.setAttribute('years-visible', '');
  }

  _closeYearScroller() {
    this.removeAttribute('years-visible');
    this._translateX = this._yearScrollerWidth;
  }

  _isYearScrollerVisible() {
    return this._translateX < this._yearScrollerWidth / 2;
  }

  _translateXChanged(x) {
    if (!this._desktopMode) {
      this.$.monthScroller.style.transform = `translateX(${x - this._yearScrollerWidth}px)`;
      this.$.yearScroller.style.transform = `translateX(${x}px)`;
    }
  }

  _yearAfterXYears(index) {
    const result = new Date(this._originDate);
    result.setFullYear(parseInt(index) + this._originDate.getFullYear());
    return result.getFullYear();
  }

  _yearAfterXMonths(months) {
    return this._dateAfterXMonths(months).getFullYear();
  }

  _dateAfterXMonths(months) {
    const result = new Date(this._originDate);
    result.setDate(1);
    result.setMonth(parseInt(months) + this._originDate.getMonth());
    return result;
  }

  _differenceInMonths(date1, date2) {
    const months = (date1.getFullYear() - date2.getFullYear()) * 12;
    return months - date2.getMonth() + date1.getMonth();
  }

  _clear() {
    this._selectDate('');
  }

  _close() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  _cancel() {
    this.focusedDate = this.selectedDate;
    this._close();
  }

  _preventDefault(e) {
    e.preventDefault();
  }

  __toggleDate(date) {
    if (dateEquals(date, this.selectedDate)) {
      this._clear();
      this.focusedDate = date;
    } else {
      this._selectDate(date);
    }
  }

  __onMonthCalendarKeyDown(event) {
    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        this._moveFocusByDays(7);
        handled = true;
        break;
      case 'ArrowUp':
        this._moveFocusByDays(-7);
        handled = true;
        break;
      case 'ArrowRight':
        this._moveFocusByDays(this.__isRTL ? -1 : 1);
        handled = true;
        break;
      case 'ArrowLeft':
        this._moveFocusByDays(this.__isRTL ? 1 : -1);
        handled = true;
        break;
      case 'Enter':
        this._selectDate(this.focusedDate);
        this._close();
        handled = true;
        break;
      case ' ':
        this.__toggleDate(this.focusedDate);
        handled = true;
        break;
      case 'Home':
        this._moveFocusInsideMonth(this.focusedDate, 'minDate');
        handled = true;
        break;
      case 'End':
        this._moveFocusInsideMonth(this.focusedDate, 'maxDate');
        handled = true;
        break;
      case 'PageDown':
        this._moveFocusByMonths(event.shiftKey ? 12 : 1);
        handled = true;
        break;
      case 'PageUp':
        this._moveFocusByMonths(event.shiftKey ? -12 : -1);
        handled = true;
        break;
      case 'Tab':
        this._onTabKeyDown(event, 'calendar');
        break;
      default:
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  _onTabKeyDown(event, section) {
    // Stop propagation to avoid focus-trap
    // listener when used in a modal dialog.
    event.stopPropagation();

    switch (section) {
      case 'calendar':
        if (event.shiftKey) {
          event.preventDefault();

          if (this.hasAttribute('fullscreen')) {
            // Trap focus in the overlay
            this.$.cancelButton.focus();
          } else {
            this.__focusInput();
          }
        }
        break;
      case 'today':
        if (event.shiftKey) {
          event.preventDefault();
          this.focusDateElement();
        }
        break;
      case 'cancel':
        if (!event.shiftKey) {
          event.preventDefault();

          if (this.hasAttribute('fullscreen')) {
            // Trap focus in the overlay
            this.focusDateElement();
          } else {
            this.__focusInput();
          }
        }
        break;
      default:
        break;
    }
  }

  __onTodayButtonKeyDown(event) {
    if (event.key === 'Tab') {
      this._onTabKeyDown(event, 'today');
    }
  }

  __onCancelButtonKeyDown(event) {
    if (event.key === 'Tab') {
      this._onTabKeyDown(event, 'cancel');
    }
  }

  __focusInput() {
    this.dispatchEvent(new CustomEvent('focus-input', { bubbles: true, composed: true }));
  }

  __tryFocusDate() {
    const dateToFocus = this.__pendingDateFocus;
    if (dateToFocus) {
      // Check the date element with tabindex="0"
      const dateElement = this.focusableDateElement;

      if (dateElement && dateEquals(dateElement.date, this.__pendingDateFocus)) {
        delete this.__pendingDateFocus;
        dateElement.focus();
      }
    }
  }

  async focusDate(date, keepMonth) {
    const dateToFocus = date || this.selectedDate || this.initialPosition || new Date();
    this.focusedDate = dateToFocus;
    if (!keepMonth) {
      this._focusedMonthDate = dateToFocus.getDate();
    }
    await this.focusDateElement(false);
  }

  async focusDateElement(reveal = true) {
    this.__pendingDateFocus = this.focusedDate;

    // Wait for `vaadin-month-calendar` elements to be rendered
    if (!this.calendars.length) {
      await new Promise((resolve) => {
        setTimeout(resolve);
      });
    }

    // Reveal focused date unless it has been just set,
    // which triggers `revealDate()` in the observer.
    if (reveal) {
      this.revealDate(this.focusedDate);
    }

    if (this._revealPromise) {
      // Wait for focused date to be scrolled into view.
      await this._revealPromise;
    }

    this.__tryFocusDate();
  }

  _focusClosestDate(focus) {
    this.focusDate(getClosestDate(focus, [this.minDate, this.maxDate]));
  }

  _moveFocusByDays(days) {
    const focus = this.focusedDate;
    const dateToFocus = new Date(0, 0);
    dateToFocus.setFullYear(focus.getFullYear());
    dateToFocus.setMonth(focus.getMonth());
    dateToFocus.setDate(focus.getDate() + days);

    if (this._dateAllowed(dateToFocus, this.minDate, this.maxDate)) {
      this.focusDate(dateToFocus);
    } else if (this._dateAllowed(focus, this.minDate, this.maxDate)) {
      // Move to min or max date
      if (days > 0) {
        // Down or right
        this.focusDate(this.maxDate);
      } else {
        // Up or left
        this.focusDate(this.minDate);
      }
    } else {
      // Move to closest allowed date
      this._focusClosestDate(focus);
    }
  }

  _moveFocusByMonths(months) {
    const focus = this.focusedDate;
    const dateToFocus = new Date(0, 0);
    dateToFocus.setFullYear(focus.getFullYear());
    dateToFocus.setMonth(focus.getMonth() + months);

    const targetMonth = dateToFocus.getMonth();

    dateToFocus.setDate(this._focusedMonthDate || (this._focusedMonthDate = focus.getDate()));
    if (dateToFocus.getMonth() !== targetMonth) {
      dateToFocus.setDate(0);
    }

    if (this._dateAllowed(dateToFocus, this.minDate, this.maxDate)) {
      this.focusDate(dateToFocus, true);
    } else if (this._dateAllowed(focus, this.minDate, this.maxDate)) {
      // Move to min or max date
      if (months > 0) {
        // Pagedown
        this.focusDate(this.maxDate);
      } else {
        // Pageup
        this.focusDate(this.minDate);
      }
    } else {
      // Move to closest allowed date
      this._focusClosestDate(focus);
    }
  }

  _moveFocusInsideMonth(focusedDate, property) {
    const dateToFocus = new Date(0, 0);
    dateToFocus.setFullYear(focusedDate.getFullYear());

    if (property === 'minDate') {
      dateToFocus.setMonth(focusedDate.getMonth());
      dateToFocus.setDate(1);
    } else {
      dateToFocus.setMonth(focusedDate.getMonth() + 1);
      dateToFocus.setDate(0);
    }

    if (this._dateAllowed(dateToFocus, this.minDate, this.maxDate)) {
      this.focusDate(dateToFocus);
    } else if (this._dateAllowed(focusedDate, this.minDate, this.maxDate)) {
      // Move to minDate or maxDate
      this.focusDate(this[property]);
    } else {
      // Move to closest allowed date
      this._focusClosestDate(focusedDate);
    }
  }

  _dateAllowed(date, min, max) {
    return (!min || date >= min) && (!max || date <= max);
  }

  _isTodayAllowed(min, max) {
    const today = new Date();
    const todayMidnight = new Date(0, 0);
    todayMidnight.setFullYear(today.getFullYear());
    todayMidnight.setMonth(today.getMonth());
    todayMidnight.setDate(today.getDate());
    return this._dateAllowed(todayMidnight, min, max);
  }
}

customElements.define(DatePickerOverlayContent.is, DatePickerOverlayContent);
