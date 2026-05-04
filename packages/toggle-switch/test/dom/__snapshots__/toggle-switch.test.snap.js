/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-toggle-switch host default"] = 
`<vaadin-toggle-switch has-value="">
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-toggle-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host default */

snapshots["vaadin-toggle-switch host name"] = 
`<vaadin-toggle-switch has-value="">
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-toggle-switch-3"
    name="Name"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host name */

snapshots["vaadin-toggle-switch host label"] = 
`<vaadin-toggle-switch
  has-label=""
  has-value=""
>
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    aria-labelledby="label-vaadin-toggle-switch-0"
    id="input-vaadin-toggle-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host label */

snapshots["vaadin-toggle-switch host disabled"] = 
`<vaadin-toggle-switch
  aria-disabled="true"
  disabled=""
  has-value=""
>
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    disabled=""
    id="input-vaadin-toggle-switch-3"
    role="switch"
    slot="input"
    tabindex="-1"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host disabled */

snapshots["vaadin-toggle-switch host readonly"] = 
`<vaadin-toggle-switch
  has-value=""
  readonly=""
>
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    aria-readonly="true"
    id="input-vaadin-toggle-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host readonly */

snapshots["vaadin-toggle-switch host helper"] = 
`<vaadin-toggle-switch
  has-helper=""
  has-value=""
>
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-toggle-switch-1"
    id="input-vaadin-toggle-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
  <div
    id="helper-vaadin-toggle-switch-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host helper */

snapshots["vaadin-toggle-switch host required"] = 
`<vaadin-toggle-switch
  has-value=""
  required=""
>
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-toggle-switch-3"
    required=""
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host required */

snapshots["vaadin-toggle-switch host error"] = 
`<vaadin-toggle-switch
  has-error-message=""
  has-value=""
  invalid=""
>
  <label
    for="input-vaadin-toggle-switch-3"
    id="label-vaadin-toggle-switch-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-toggle-switch-2"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-toggle-switch-2"
    aria-invalid="true"
    id="input-vaadin-toggle-switch-3"
    invalid=""
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-toggle-switch>
`;
/* end snapshot vaadin-toggle-switch host error */

snapshots["vaadin-toggle-switch shadow default"] = 
`<div class="vaadin-toggle-switch-container">
  <div
    aria-hidden="true"
    part="switch"
  >
    <div part="thumb">
    </div>
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
/* end snapshot vaadin-toggle-switch shadow default */

