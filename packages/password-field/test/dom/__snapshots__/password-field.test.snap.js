/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-password-field host default"] = 
`<vaadin-password-field>
  <label
    for="input-vaadin-password-field-0"
    id="label-vaadin-password-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-password-field-0"
    slot="error-message"
  >
  </div>
  <input
    autocapitalize="off"
    id="input-vaadin-password-field-0"
    slot="input"
    type="password"
  >
  <vaadin-password-field-button
    aria-label="Show password"
    aria-pressed="false"
    role="button"
    slot="reveal"
    tabindex="0"
  >
  </vaadin-password-field-button>
</vaadin-password-field>
`;
/* end snapshot vaadin-password-field host default */

snapshots["vaadin-password-field host helper"] = 
`<vaadin-password-field has-helper="">
  <label
    for="input-vaadin-password-field-0"
    id="label-vaadin-password-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-password-field-0"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-password-field-0"
    autocapitalize="off"
    id="input-vaadin-password-field-0"
    slot="input"
    type="password"
  >
  <vaadin-password-field-button
    aria-label="Show password"
    aria-pressed="false"
    role="button"
    slot="reveal"
    tabindex="0"
  >
  </vaadin-password-field-button>
  <div
    id="helper-vaadin-password-field-0"
    slot="helper"
  >
    Helper
  </div>
</vaadin-password-field>
`;
/* end snapshot vaadin-password-field host helper */

snapshots["vaadin-password-field host error"] = 
`<vaadin-password-field
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-password-field-0"
    id="label-vaadin-password-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-password-field-0"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-password-field-0"
    aria-invalid="true"
    id="input-vaadin-password-field-0"
    invalid=""
    slot="input"
    type="password"
  >
  <vaadin-password-field-button
    aria-label="Show password"
    aria-pressed="false"
    role="button"
    slot="reveal"
    tabindex="0"
  >
  </vaadin-password-field-button>
</vaadin-password-field>
`;
/* end snapshot vaadin-password-field host error */

snapshots["vaadin-password-field shadow default"] = 
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow default */

snapshots["vaadin-password-field shadow disabled"] = 
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow disabled */

snapshots["vaadin-password-field shadow readonly"] = 
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow readonly */

snapshots["vaadin-password-field shadow invalid"] = 
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow invalid */

snapshots["vaadin-password-field shadow theme"] = 
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow theme */

