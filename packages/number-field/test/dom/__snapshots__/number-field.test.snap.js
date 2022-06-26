/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-number-field host default"] = 
`<vaadin-number-field>
  <label
    for="input-vaadin-number-field-3"
    id="label-vaadin-number-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-number-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-number-field-3"
    max="undefined"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
</vaadin-number-field>
`;
/* end snapshot vaadin-number-field host default */

snapshots["vaadin-number-field host helper"] = 
`<vaadin-number-field has-helper="">
  <label
    for="input-vaadin-number-field-3"
    id="label-vaadin-number-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-number-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-number-field-1"
    id="input-vaadin-number-field-3"
    max="undefined"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
  <div
    id="helper-vaadin-number-field-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-number-field>
`;
/* end snapshot vaadin-number-field host helper */

snapshots["vaadin-number-field host error"] = 
`<vaadin-number-field
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-number-field-3"
    id="label-vaadin-number-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-number-field-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-number-field-2"
    aria-invalid="true"
    id="input-vaadin-number-field-3"
    invalid=""
    max="undefined"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
</vaadin-number-field>
`;
/* end snapshot vaadin-number-field host error */

snapshots["vaadin-number-field shadow default"] = 
`<div class="vaadin-field-container">
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
    <div
      aria-hidden="true"
      hidden=""
      part="decrease-button"
      slot="prefix"
    >
    </div>
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
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
      hidden=""
      part="increase-button"
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
`;
/* end snapshot vaadin-number-field shadow default */

snapshots["vaadin-number-field shadow controls"] = 
`<div class="vaadin-field-container">
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
    <div
      aria-hidden="true"
      part="decrease-button"
      slot="prefix"
    >
    </div>
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
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
      part="increase-button"
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
`;
/* end snapshot vaadin-number-field shadow controls */

snapshots["vaadin-number-field shadow disabled"] = 
`<div class="vaadin-field-container">
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
    <div
      aria-hidden="true"
      hidden=""
      part="decrease-button"
      slot="prefix"
    >
    </div>
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
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
      hidden=""
      part="increase-button"
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
`;
/* end snapshot vaadin-number-field shadow disabled */

snapshots["vaadin-number-field shadow readonly"] = 
`<div class="vaadin-field-container">
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
    <div
      aria-hidden="true"
      hidden=""
      part="decrease-button"
      slot="prefix"
    >
    </div>
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
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
      hidden=""
      part="increase-button"
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
`;
/* end snapshot vaadin-number-field shadow readonly */

snapshots["vaadin-number-field shadow invalid"] = 
`<div class="vaadin-field-container">
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
    <div
      aria-hidden="true"
      hidden=""
      part="decrease-button"
      slot="prefix"
    >
    </div>
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
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
      hidden=""
      part="increase-button"
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
`;
/* end snapshot vaadin-number-field shadow invalid */

snapshots["vaadin-number-field shadow theme"] = 
`<div class="vaadin-field-container">
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
    <div
      aria-hidden="true"
      hidden=""
      part="decrease-button"
      slot="prefix"
    >
    </div>
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
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
      hidden=""
      part="increase-button"
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
`;
/* end snapshot vaadin-number-field shadow theme */

snapshots["vaadin-number-field host min"] = 
`<vaadin-number-field step="1">
  <label
    for="input-vaadin-number-field-3"
    id="label-vaadin-number-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-number-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-number-field-3"
    max="undefined"
    min="2"
    slot="input"
    step="any"
    type="number"
  >
</vaadin-number-field>
`;
/* end snapshot vaadin-number-field host min */

snapshots["vaadin-number-field host max"] = 
`<vaadin-number-field step="1">
  <label
    for="input-vaadin-number-field-3"
    id="label-vaadin-number-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-number-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-number-field-3"
    max="2"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
</vaadin-number-field>
`;
/* end snapshot vaadin-number-field host max */

snapshots["vaadin-number-field host step"] = 
`<vaadin-number-field step="2">
  <label
    for="input-vaadin-number-field-3"
    id="label-vaadin-number-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-number-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-number-field-3"
    max="undefined"
    min="undefined"
    slot="input"
    step="2"
    type="number"
  >
</vaadin-number-field>
`;
/* end snapshot vaadin-number-field host step */

