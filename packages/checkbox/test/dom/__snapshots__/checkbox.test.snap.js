/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox host default"] = 
`<vaadin-checkbox
  has-label=""
  has-value=""
  label="I accept terms and conditions"
>
  <label
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
    I accept terms and conditions
  </label>
  <input
    id="input-vaadin-checkbox-1"
    slot="input"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host default */

snapshots["vaadin-checkbox host disabled"] = 
`<vaadin-checkbox
  aria-disabled="true"
  disabled=""
  has-label=""
  has-value=""
  label="I accept terms and conditions"
>
  <label
    for="input-vaadin-checkbox-3"
    id="label-vaadin-checkbox-2"
    slot="label"
  >
    I accept terms and conditions
  </label>
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

snapshots["vaadin-checkbox shadow default"] = 
`<div class="vaadin-checkbox-container">
  <div class="vaadin-checkbox-wrapper">
    <div part="checkbox">
    </div>
    <slot name="input">
    </slot>
  </div>
  <slot name="label">
  </slot>
  <div style="display: none !important">
    <slot id="noop">
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-checkbox shadow default */

