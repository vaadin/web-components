/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-date-picker host default"] = 
`<vaadin-date-picker>
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host default */

snapshots["vaadin-date-picker host placeholder"] = 
`<vaadin-date-picker placeholder="Placeholder">
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    placeholder="Placeholder"
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host placeholder */

snapshots["vaadin-date-picker host label"] = 
`<vaadin-date-picker has-label="">
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-labelledby="label-vaadin-date-picker-0"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host label */

snapshots["vaadin-date-picker host helper"] = 
`<vaadin-date-picker has-helper="">
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-date-picker-1"
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    role="combobox"
    slot="input"
  >
  <div
    id="helper-vaadin-date-picker-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host helper */

snapshots["vaadin-date-picker host error"] = 
`<vaadin-date-picker
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-date-picker-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-date-picker-2"
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-invalid="true"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    invalid=""
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host error */

snapshots["vaadin-date-picker shadow default"] = 
`<div class="vaadin-date-picker-container">
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
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      part="toggle-button"
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
</div>
<vaadin-date-picker-overlay
  disable-upgrade=""
  id="overlay"
  restore-focus-on-close=""
>
  <template>
  </template>
</vaadin-date-picker-overlay>
`;
/* end snapshot vaadin-date-picker shadow default */

snapshots["vaadin-date-picker shadow disabled"] = 
`<div class="vaadin-date-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container
    disabled=""
    part="input-field"
  >
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <div
      aria-hidden="true"
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      part="toggle-button"
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
</div>
<vaadin-date-picker-overlay
  disable-upgrade=""
  id="overlay"
  restore-focus-on-close=""
>
  <template>
  </template>
</vaadin-date-picker-overlay>
`;
/* end snapshot vaadin-date-picker shadow disabled */

snapshots["vaadin-date-picker shadow readonly"] = 
`<div class="vaadin-date-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container
    part="input-field"
    readonly=""
  >
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <div
      aria-hidden="true"
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      part="toggle-button"
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
</div>
<vaadin-date-picker-overlay
  disable-upgrade=""
  id="overlay"
  restore-focus-on-close=""
>
  <template>
  </template>
</vaadin-date-picker-overlay>
`;
/* end snapshot vaadin-date-picker shadow readonly */

snapshots["vaadin-date-picker shadow invalid"] = 
`<div class="vaadin-date-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container
    invalid=""
    part="input-field"
  >
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <div
      aria-hidden="true"
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      part="toggle-button"
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
</div>
<vaadin-date-picker-overlay
  disable-upgrade=""
  id="overlay"
  restore-focus-on-close=""
>
  <template>
  </template>
</vaadin-date-picker-overlay>
`;
/* end snapshot vaadin-date-picker shadow invalid */

snapshots["vaadin-date-picker shadow theme"] = 
`<div class="vaadin-date-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container
    part="input-field"
    theme="align-right"
  >
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <div
      aria-hidden="true"
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      part="toggle-button"
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
</div>
<vaadin-date-picker-overlay
  disable-upgrade=""
  id="overlay"
  restore-focus-on-close=""
>
  <template>
  </template>
</vaadin-date-picker-overlay>
`;
/* end snapshot vaadin-date-picker shadow theme */

snapshots["vaadin-date-picker host readonly"] = 
`<vaadin-date-picker readonly="">
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    readonly=""
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host readonly */

snapshots["vaadin-date-picker host required"] = 
`<vaadin-date-picker required="">
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    required=""
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host required */

snapshots["vaadin-date-picker host name"] = 
`<vaadin-date-picker name="Field Name">
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    id="input-vaadin-date-picker-3"
    name="Field Name"
    role="combobox"
    slot="input"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host name */

snapshots["vaadin-date-picker host disabled"] = 
`<vaadin-date-picker
  aria-disabled="true"
  disabled=""
>
  <label
    for="input-vaadin-date-picker-3"
    id="label-vaadin-date-picker-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-date-picker-2"
    slot="error-message"
  >
  </div>
  <input
    aria-expanded="false"
    aria-haspopup="dialog"
    autocomplete="off"
    disabled=""
    id="input-vaadin-date-picker-3"
    role="combobox"
    slot="input"
    tabindex="-1"
  >
</vaadin-date-picker>
`;
/* end snapshot vaadin-date-picker host disabled */

