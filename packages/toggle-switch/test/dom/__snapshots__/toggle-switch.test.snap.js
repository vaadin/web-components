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

