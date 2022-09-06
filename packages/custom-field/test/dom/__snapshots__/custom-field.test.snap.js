/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-custom-field host default"] = 
`<vaadin-custom-field role="group">
  <label
    id="label-vaadin-custom-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-custom-field-2"
    slot="error-message"
  >
  </div>
</vaadin-custom-field>
`;
/* end snapshot vaadin-custom-field host default */

snapshots["vaadin-custom-field host label"] = 
`<vaadin-custom-field
  aria-labelledby="label-vaadin-custom-field-0"
  has-label=""
  role="group"
>
  <label
    id="label-vaadin-custom-field-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-custom-field-2"
    slot="error-message"
  >
  </div>
</vaadin-custom-field>
`;
/* end snapshot vaadin-custom-field host label */

snapshots["vaadin-custom-field host required"] = 
`<vaadin-custom-field
  aria-required="true"
  required=""
  role="group"
>
  <label
    id="label-vaadin-custom-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-custom-field-2"
    slot="error-message"
  >
  </div>
</vaadin-custom-field>
`;
/* end snapshot vaadin-custom-field host required */

snapshots["vaadin-custom-field host helper"] = 
`<vaadin-custom-field
  aria-labelledby="helper-vaadin-custom-field-1"
  has-helper=""
  role="group"
>
  <label
    id="label-vaadin-custom-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-custom-field-2"
    slot="error-message"
  >
  </div>
  <div
    id="helper-vaadin-custom-field-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-custom-field>
`;
/* end snapshot vaadin-custom-field host helper */

snapshots["vaadin-custom-field host error"] = 
`<vaadin-custom-field
  aria-labelledby="error-message-vaadin-custom-field-2"
  has-error-message=""
  invalid=""
  role="group"
>
  <label
    id="label-vaadin-custom-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-custom-field-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
</vaadin-custom-field>
`;
/* end snapshot vaadin-custom-field host error */

snapshots["vaadin-custom-field shadow default"] = 
`<div class="vaadin-custom-field-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div class="inputs-wrapper">
    <slot id="slot">
    </slot>
  </div>
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
/* end snapshot vaadin-custom-field shadow default */

