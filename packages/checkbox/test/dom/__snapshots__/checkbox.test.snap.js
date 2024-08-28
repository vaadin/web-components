/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox host default"] = 
`<vaadin-checkbox has-value="">
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-checkbox-3"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host default */

snapshots["vaadin-checkbox host name"] = 
`<vaadin-checkbox has-value="">
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-checkbox-3"
    name="Name"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host name */

snapshots["vaadin-checkbox host label"] = 
`<vaadin-checkbox
  has-label=""
  has-value=""
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    aria-labelledby="label-vaadin-checkbox-0"
    id="input-vaadin-checkbox-3"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host label */

snapshots["vaadin-checkbox host disabled"] = 
`<vaadin-checkbox
  aria-disabled="true"
  disabled=""
  has-value=""
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    disabled=""
    id="input-vaadin-checkbox-3"
    slot="input"
    tabindex="-1"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host disabled */

snapshots["vaadin-checkbox host readonly"] = 
`<vaadin-checkbox
  has-value=""
  readonly=""
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    aria-readonly="true"
    id="input-vaadin-checkbox-3"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host readonly */

snapshots["vaadin-checkbox host helper"] = 
`<vaadin-checkbox
  has-helper=""
  has-value=""
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-checkbox-1"
    id="input-vaadin-checkbox-3"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
  <div
    id="helper-vaadin-checkbox-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host helper */

snapshots["vaadin-checkbox host required"] = 
`<vaadin-checkbox
  has-value=""
  required=""
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-checkbox-3"
    required=""
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host required */

snapshots["vaadin-checkbox host error"] = 
`<vaadin-checkbox
  has-error-message=""
  has-value=""
  invalid=""
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-checkbox-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-checkbox-2"
    aria-invalid="true"
    id="input-vaadin-checkbox-3"
    invalid=""
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host error */

snapshots["vaadin-checkbox shadow default"] = 
`<div class="vaadin-checkbox-container">
  <div
    aria-hidden="true"
    part="checkbox"
  >
  </div>
  <slot name="input">
  </slot>
  <div part="label">
    <slot name="label">
    </slot>
    <div part="required-indicator">
    </div>
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
/* end snapshot vaadin-checkbox shadow default */

