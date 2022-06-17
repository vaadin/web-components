/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-text-field host default"] = 
`<vaadin-text-field>
  <label
    for="input-vaadin-text-field-3"
    id="label-vaadin-text-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-text-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-text-field-3"
    slot="input"
    type="text"
  >
</vaadin-text-field>
`;
/* end snapshot vaadin-text-field host default */

snapshots["vaadin-text-field host helper"] = 
`<vaadin-text-field has-helper="">
  <label
    for="input-vaadin-text-field-3"
    id="label-vaadin-text-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-text-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-text-field-1"
    id="input-vaadin-text-field-3"
    slot="input"
    type="text"
  >
  <div
    id="helper-vaadin-text-field-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-text-field>
`;
/* end snapshot vaadin-text-field host helper */

snapshots["vaadin-text-field host error"] = 
`<vaadin-text-field
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-text-field-3"
    id="label-vaadin-text-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-text-field-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-text-field-2"
    aria-invalid="true"
    id="input-vaadin-text-field-3"
    invalid=""
    slot="input"
    type="text"
  >
</vaadin-text-field>
`;
/* end snapshot vaadin-text-field host error */

snapshots["vaadin-text-field shadow default"] = 
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
/* end snapshot vaadin-text-field shadow default */

snapshots["vaadin-text-field shadow disabled"] = 
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
/* end snapshot vaadin-text-field shadow disabled */

snapshots["vaadin-text-field shadow readonly"] = 
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
/* end snapshot vaadin-text-field shadow readonly */

snapshots["vaadin-text-field shadow invalid"] = 
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
/* end snapshot vaadin-text-field shadow invalid */

snapshots["vaadin-text-field shadow theme"] = 
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
/* end snapshot vaadin-text-field shadow theme */

snapshots["vaadin-text-field host label"] = 
`<vaadin-text-field has-label="">
  <label
    for="input-vaadin-text-field-3"
    id="label-vaadin-text-field-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-text-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-labelledby="label-vaadin-text-field-0"
    id="input-vaadin-text-field-3"
    slot="input"
    type="text"
  >
</vaadin-text-field>
`;
/* end snapshot vaadin-text-field host label */

