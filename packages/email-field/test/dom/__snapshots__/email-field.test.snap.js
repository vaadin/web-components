/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-email-field host default"] = 
`<vaadin-email-field>
  <label
    for="input-vaadin-email-field-3"
    id="label-vaadin-email-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-email-field-2"
    slot="error-message"
  >
  </div>
  <input
    autocapitalize="off"
    id="input-vaadin-email-field-3"
    slot="input"
    type="email"
  >
</vaadin-email-field>
`;
/* end snapshot vaadin-email-field host default */

snapshots["vaadin-email-field host helper"] = 
`<vaadin-email-field has-helper="">
  <label
    for="input-vaadin-email-field-3"
    id="label-vaadin-email-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-email-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-email-field-1"
    autocapitalize="off"
    id="input-vaadin-email-field-3"
    slot="input"
    type="email"
  >
  <div
    id="helper-vaadin-email-field-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-email-field>
`;
/* end snapshot vaadin-email-field host helper */

snapshots["vaadin-email-field shadow default"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-email-field shadow default */

snapshots["vaadin-email-field shadow disabled"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-email-field shadow disabled */

snapshots["vaadin-email-field shadow readonly"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-email-field shadow readonly */

snapshots["vaadin-email-field shadow invalid"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-email-field shadow invalid */

snapshots["vaadin-email-field shadow theme"] = 
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
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-email-field shadow theme */

snapshots["vaadin-email-field host error"] = 
`<vaadin-email-field
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-email-field-3"
    id="label-vaadin-email-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-email-field-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-email-field-2"
    aria-invalid="true"
    id="input-vaadin-email-field-3"
    invalid=""
    slot="input"
    type="email"
  >
</vaadin-email-field>
`;
/* end snapshot vaadin-email-field host error */

