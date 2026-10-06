/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-date-range-picker host default"] = 
`<vaadin-date-range-picker
  active-part="start"
  role="group"
>
  <label
    id="label-vaadin-date-range-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-range-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="Start date"
    autocomplete="off"
    placeholder=""
    role="combobox"
    slot="input"
    type="text"
  >
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="End date"
    autocomplete="off"
    placeholder=""
    role="combobox"
    slot="end-input"
    type="text"
  >
</vaadin-date-range-picker>
`;
/* end snapshot vaadin-date-range-picker host default */

snapshots["vaadin-date-range-picker host label, helper and placeholders"] = 
`<vaadin-date-range-picker
  active-part="start"
  aria-describedby="helper-vaadin-date-range-picker-1"
  aria-labelledby="label-vaadin-date-range-picker-0"
  has-helper=""
  has-label=""
  role="group"
>
  <label
    id="label-vaadin-date-range-picker-0"
    slot="label"
  >
    Trip dates
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-range-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="Trip dates Start date"
    autocomplete="off"
    placeholder="Departure"
    role="combobox"
    slot="input"
    type="text"
  >
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="Trip dates End date"
    autocomplete="off"
    placeholder="Return"
    role="combobox"
    slot="end-input"
    type="text"
  >
  <div
    id="helper-vaadin-date-range-picker-1"
    slot="helper"
  >
    Pick both dates
  </div>
</vaadin-date-range-picker>
`;
/* end snapshot vaadin-date-range-picker host label, helper and placeholders */

snapshots["vaadin-date-range-picker host values"] = 
`<vaadin-date-range-picker
  active-part="start"
  has-end-value=""
  has-start-value=""
  has-value=""
  role="group"
>
  <label
    id="label-vaadin-date-range-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-range-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="Start date"
    autocomplete="off"
    placeholder=""
    role="combobox"
    slot="input"
    type="text"
  >
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="End date"
    autocomplete="off"
    placeholder=""
    role="combobox"
    slot="end-input"
    type="text"
  >
</vaadin-date-range-picker>
`;
/* end snapshot vaadin-date-range-picker host values */

snapshots["vaadin-date-range-picker host disabled"] = 
`<vaadin-date-range-picker
  active-part="start"
  aria-disabled="true"
  disabled=""
  role="group"
>
  <label
    id="label-vaadin-date-range-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-range-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="Start date"
    autocomplete="off"
    disabled=""
    placeholder=""
    role="combobox"
    slot="input"
    tabindex="-1"
    type="text"
  >
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="End date"
    autocomplete="off"
    disabled=""
    placeholder=""
    role="combobox"
    slot="end-input"
    type="text"
  >
</vaadin-date-range-picker>
`;
/* end snapshot vaadin-date-range-picker host disabled */

snapshots["vaadin-date-range-picker shadow default"] = 
`<div class="vaadin-date-range-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container part="input-field">
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <div
      aria-hidden="true"
      part="field-button clear-button start-clear-button"
    >
    </div>
    <span
      aria-hidden="true"
      part="separator"
    >
      –
    </span>
    <slot name="end-input">
    </slot>
    <div
      aria-hidden="true"
      part="field-button clear-button end-clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      part="field-button toggle-button"
      slot="suffix"
    >
    </div>
  </vaadin-input-container>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
  <slot name="tooltip">
  </slot>
</div>
<vaadin-date-picker-overlay
  exportparts="backdrop, overlay, content"
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-date-picker-overlay>
`;
/* end snapshot vaadin-date-range-picker shadow default */

