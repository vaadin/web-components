/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-integer-field host default"] = 
`<vaadin-integer-field>
  <label
    for="input-vaadin-integer-field-3"
    id="label-vaadin-integer-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-integer-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-integer-field-3"
    max="undefined"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
</vaadin-integer-field>
`;
/* end snapshot vaadin-integer-field host default */

snapshots["vaadin-integer-field host helper"] = 
`<vaadin-integer-field has-helper="">
  <label
    for="input-vaadin-integer-field-3"
    id="label-vaadin-integer-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-integer-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-integer-field-1"
    id="input-vaadin-integer-field-3"
    max="undefined"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
  <div
    id="helper-vaadin-integer-field-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-integer-field>
`;
/* end snapshot vaadin-integer-field host helper */

snapshots["vaadin-integer-field host error"] = 
`<vaadin-integer-field
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-integer-field-3"
    id="label-vaadin-integer-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-integer-field-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-integer-field-2"
    aria-invalid="true"
    id="input-vaadin-integer-field-3"
    invalid=""
    max="undefined"
    min="undefined"
    slot="input"
    step="any"
    type="number"
  >
</vaadin-integer-field>
`;
/* end snapshot vaadin-integer-field host error */

snapshots["vaadin-integer-field shadow default"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow default */

snapshots["vaadin-integer-field shadow controls"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow controls */

snapshots["vaadin-integer-field shadow disabled"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow disabled */

snapshots["vaadin-integer-field shadow readonly"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow readonly */

snapshots["vaadin-integer-field shadow invalid"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow invalid */

snapshots["vaadin-integer-field shadow theme"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow theme */

snapshots["vaadin-integer-field shadow step-buttons-visible"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-integer-field shadow step-buttons-visible */

