/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-radio-group host default"] = 
`<vaadin-radio-group role="radiogroup">
  <vaadin-radio-button
    has-label=""
    has-value=""
    label="Radio 1"
    value="1"
  >
    <label
      for="input-vaadin-radio-button-0"
      id="label-vaadin-radio-button-1"
      slot="label"
    >
      Radio 1
    </label>
    <input
      id="input-vaadin-radio-button-0"
      slot="input"
      type="radio"
      value="1"
    >
  </vaadin-radio-button>
  <vaadin-radio-button
    has-label=""
    has-value=""
    label="Radio 2"
    value="2"
  >
    <label
      for="input-vaadin-radio-button-1"
      id="label-vaadin-radio-button-2"
      slot="label"
    >
      Radio 2
    </label>
    <input
      id="input-vaadin-radio-button-1"
      slot="input"
      type="radio"
      value="2"
    >
  </vaadin-radio-button>
  <label
    id="label-vaadin-radio-group-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-radio-group-0"
    slot="error-message"
  >
  </div>
</vaadin-radio-group>
`;
/* end snapshot vaadin-radio-group host default */

snapshots["vaadin-radio-group host disabled"] = 
`<vaadin-radio-group
  aria-disabled="true"
  disabled=""
  role="radiogroup"
>
  <vaadin-radio-button
    aria-disabled="true"
    disabled=""
    has-label=""
    has-value=""
    label="Radio 1"
    value="1"
  >
    <label
      for="input-vaadin-radio-button-0"
      id="label-vaadin-radio-button-1"
      slot="label"
    >
      Radio 1
    </label>
    <input
      disabled=""
      id="input-vaadin-radio-button-0"
      slot="input"
      tabindex="-1"
      type="radio"
      value="1"
    >
  </vaadin-radio-button>
  <vaadin-radio-button
    aria-disabled="true"
    disabled=""
    has-label=""
    has-value=""
    label="Radio 2"
    value="2"
  >
    <label
      for="input-vaadin-radio-button-1"
      id="label-vaadin-radio-button-2"
      slot="label"
    >
      Radio 2
    </label>
    <input
      disabled=""
      id="input-vaadin-radio-button-1"
      slot="input"
      tabindex="-1"
      type="radio"
      value="2"
    >
  </vaadin-radio-button>
  <label
    id="label-vaadin-radio-group-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-radio-group-0"
    slot="error-message"
  >
  </div>
</vaadin-radio-group>
`;
/* end snapshot vaadin-radio-group host disabled */

snapshots["vaadin-radio-group shadow default"] = 
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
/* end snapshot vaadin-radio-group shadow default */

