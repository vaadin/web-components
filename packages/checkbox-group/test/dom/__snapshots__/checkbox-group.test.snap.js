/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox-group host default"] = 
`<vaadin-checkbox-group role="group">
  <vaadin-checkbox
    has-label=""
    has-value=""
    label="Checkbox 1"
    value="1"
  >
    <label
      for="input-vaadin-checkbox-0"
      id="label-vaadin-checkbox-1"
      slot="label"
    >
      Checkbox 1
    </label>
    <input
      id="input-vaadin-checkbox-0"
      slot="input"
      type="checkbox"
      value="1"
    >
  </vaadin-checkbox>
  <vaadin-checkbox
    has-label=""
    has-value=""
    label="Checkbox 2"
    value="2"
  >
    <label
      for="input-vaadin-checkbox-1"
      id="label-vaadin-checkbox-2"
      slot="label"
    >
      Checkbox 2
    </label>
    <input
      id="input-vaadin-checkbox-1"
      slot="input"
      type="checkbox"
      value="2"
    >
  </vaadin-checkbox>
  <label
    id="label-vaadin-checkbox-group-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-group-0"
    slot="error-message"
  >
  </div>
</vaadin-checkbox-group>
`;
/* end snapshot vaadin-checkbox-group host default */

snapshots["vaadin-checkbox-group host disabled"] = 
`<vaadin-checkbox-group
  aria-disabled="true"
  disabled=""
  role="group"
>
  <vaadin-checkbox
    aria-disabled="true"
    disabled=""
    has-label=""
    has-value=""
    label="Checkbox 1"
    value="1"
  >
    <label
      for="input-vaadin-checkbox-0"
      id="label-vaadin-checkbox-1"
      slot="label"
    >
      Checkbox 1
    </label>
    <input
      disabled=""
      id="input-vaadin-checkbox-0"
      slot="input"
      tabindex="-1"
      type="checkbox"
      value="1"
    >
  </vaadin-checkbox>
  <vaadin-checkbox
    aria-disabled="true"
    disabled=""
    has-label=""
    has-value=""
    label="Checkbox 2"
    value="2"
  >
    <label
      for="input-vaadin-checkbox-1"
      id="label-vaadin-checkbox-2"
      slot="label"
    >
      Checkbox 2
    </label>
    <input
      disabled=""
      id="input-vaadin-checkbox-1"
      slot="input"
      tabindex="-1"
      type="checkbox"
      value="2"
    >
  </vaadin-checkbox>
  <label
    id="label-vaadin-checkbox-group-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-checkbox-group-0"
    slot="error-message"
  >
  </div>
</vaadin-checkbox-group>
`;
/* end snapshot vaadin-checkbox-group host disabled */

snapshots["vaadin-checkbox-group shadow default"] = 
`<div class="vaadin-group-field-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div part="group-field">
    <slot>
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
`;
/* end snapshot vaadin-checkbox-group shadow default */

