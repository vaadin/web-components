/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-switch host default"] = 
`<vaadin-switch has-value="">
  <label
    for="input-vaadin-switch-3"
    id="label-vaadin-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-switch-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-switch>
`;
/* end snapshot vaadin-switch host default */

snapshots["vaadin-switch host checked"] = 
`<vaadin-switch
  checked=""
  has-value=""
>
  <label
    for="input-vaadin-switch-3"
    id="label-vaadin-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-switch-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-switch>
`;
/* end snapshot vaadin-switch host checked */

snapshots["vaadin-switch host disabled"] = 
`<vaadin-switch
  aria-disabled="true"
  disabled=""
  has-value=""
>
  <label
    for="input-vaadin-switch-3"
    id="label-vaadin-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-switch-2"
    slot="error-message"
  >
  </div>
  <input
    disabled=""
    id="input-vaadin-switch-3"
    role="switch"
    slot="input"
    tabindex="-1"
    type="checkbox"
    value="on"
  >
</vaadin-switch>
`;
/* end snapshot vaadin-switch host disabled */

snapshots["vaadin-switch host readonly"] = 
`<vaadin-switch
  has-value=""
  readonly=""
>
  <label
    for="input-vaadin-switch-3"
    id="label-vaadin-switch-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-switch-2"
    slot="error-message"
  >
  </div>
  <input
    aria-readonly="true"
    id="input-vaadin-switch-3"
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-switch>
`;
/* end snapshot vaadin-switch host readonly */

snapshots["vaadin-switch host invalid"] = 
`<vaadin-switch
  has-error-message=""
  has-value=""
  invalid=""
>
  <label
    for="input-vaadin-switch-3"
    id="label-vaadin-switch-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-switch-2"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-switch-2"
    aria-invalid="true"
    id="input-vaadin-switch-3"
    invalid=""
    role="switch"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-switch>
`;
/* end snapshot vaadin-switch host invalid */

snapshots["vaadin-switch shadow default"] = 
`<div class="vaadin-switch-container">
  <div
    aria-hidden="true"
    part="switch"
  >
    <div part="marker">
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
/* end snapshot vaadin-switch shadow default */

