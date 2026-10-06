/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-date-picker-overlay.js';
import './vaadin-date-picker-overlay-content.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { datePickerStyles } from './styles/vaadin-date-picker-base-styles.js';
import { dateRangePickerStyles } from './styles/vaadin-date-range-picker-base-styles.js';
import { DateRangePickerMixin } from './vaadin-date-range-picker-mixin.js';

/**
 * `<vaadin-date-range-picker>` is an input field that allows to enter a date range
 * by typing into a start and an end input, or by picking both dates from a single
 * calendar overlay. The focused input decides which date a pick in the calendar sets.
 *
 * ```html
 * <vaadin-date-range-picker label="Trip dates" start-value="2026-03-02" end-value="2026-03-08">
 * </vaadin-date-range-picker>
 * ```
 *
 * **Prototype.** This component is an experimental prototype for gathering design
 * feedback. Its API and behavior are not final.
 *
 * ### Styling
 *
 * In addition to the parts and state attributes of `<vaadin-date-picker>`:
 *
 * Part name             | Description
 * ----------------------|----------------------------------------------
 * `separator`           | The separator between the start and the end input
 * `start-clear-button`  | The clear button of the start input
 * `end-clear-button`    | The clear button of the end input
 *
 * Attribute         | Description
 * ------------------|----------------------------------------------
 * `active-part`     | The input that a pick in the calendar sets: `start` or `end`
 * `has-start-value` | Set when the start date is set
 * `has-end-value`   | Set when the end date is set
 *
 * The calendar marks the range with the `range-start`, `range-end` and `in-range`
 * parts of `vaadin-month-calendar`.
 *
 * @fires {Event} change - Fired when the user commits a range change.
 * @fires {CustomEvent} start-value-changed - Fired when the `startValue` property changes.
 * @fires {CustomEvent} end-value-changed - Fired when the `endValue` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement vaadin-date-range-picker
 * @extends HTMLElement
 * @mixes DateRangePickerMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DateRangePicker extends DateRangePickerMixin(
  ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-date-range-picker';
  }

  static get styles() {
    return [inputFieldShared, datePickerStyles, dateRangePickerStyles];
  }

  static get properties() {
    return {
      /** @private */
      _positionTarget: {
        type: Object,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-date-range-picker-container" @click="${this.__inputFieldClickCapture}">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          .readonly="${this.readonly}"
          .disabled="${this.disabled}"
          .invalid="${this.invalid}"
          theme="${ifDefined(this._theme)}"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <div
            part="field-button clear-button start-clear-button"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this.__onStartClearClick}"
          ></div>
          <span part="separator" aria-hidden="true">–</span>
          <slot name="end-input"></slot>
          <div
            part="field-button clear-button end-clear-button"
            slot="suffix"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this.__onEndClearClick}"
          ></div>
          <div
            part="field-button toggle-button"
            slot="suffix"
            aria-hidden="true"
            @mousedown="${this.__preventDefault}"
            @click="${this._onToggleClick}"
          ></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>

        <slot name="tooltip"></slot>
      </div>

      <vaadin-date-picker-overlay
        id="overlay"
        .owner="${this}"
        ?fullscreen="${this._fullscreen}"
        theme="${ifDefined(this._theme)}"
        .opened="${this.opened}"
        @opened-changed="${this._onOpenedChanged}"
        @vaadin-overlay-open="${this._onOverlayOpened}"
        @vaadin-overlay-close="${this._onVaadinOverlayClose}"
        @vaadin-overlay-closing="${this._onOverlayClosing}"
        no-vertical-overlap
        exportparts="backdrop, overlay, content"
        .positionTarget="${this._positionTarget}"
      >
        <slot name="overlay"></slot>
      </vaadin-date-picker-overlay>
    `;
  }

  constructor() {
    super();

    // Capture phase, to run before the input container's own click listener.
    this.__inputFieldClickCapture = { handleEvent: (event) => this.__onInputFieldClick(event), capture: true };
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new SlotController(this, 'input', 'input', {
        initializer: (input) => this.__initInput(input),
        useUniqueId: true,
      }),
    );

    this.addController(
      new SlotController(this, 'end-input', 'input', {
        initializer: (input) => this.__initInput(input),
        useUniqueId: true,
      }),
    );

    this._setFocusElement(this._startInput);

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
    this._tooltipController.setAriaTarget(this._startInput);
    this._tooltipController.setShouldShow((target) => !target.opened);

    this._positionTarget = this.shadowRoot.querySelector('[part="input-field"]');
  }

  /** @private */
  __initInput(input) {
    input.type = 'text';
    input.autocomplete = 'off';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-haspopup', 'dialog');
    input.addEventListener('input', (event) => this._onInputTextChange(event));
  }

  /** @private */
  __onStartClearClick(event) {
    this._onClearButtonClick(event, 'start');
  }

  /** @private */
  __onEndClearClick(event) {
    this._onClearButtonClick(event, 'end');
  }

  /**
   * Handles clicks on the field frame around the inputs. The input container would
   * otherwise focus each of its inputs in turn, which leaves the end input focused.
   * @private
   */
  __onInputFieldClick(event) {
    if (event.composedPath()[0] !== this._positionTarget) {
      return;
    }
    event.stopPropagation();

    // Focus the input on the side of the separator that was clicked.
    const separator = this.shadowRoot.querySelector('[part="separator"]').getBoundingClientRect();
    const input = event.clientX < separator.left + separator.width / 2 ? this._startInput : this._endInput;
    input.focus({ focusVisible: false });
    this.open();
  }

  /** @private */
  __preventDefault(event) {
    // Keep focus in the input when clicking the field buttons.
    event.preventDefault();
  }
}

defineCustomElement(DateRangePicker);

export { DateRangePicker };
