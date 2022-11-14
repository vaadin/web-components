/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-checkbox host default"] = 
`<vaadin-checkbox has-value="">
  <label
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
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
  has-value=""
>
  <label
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <input
    disabled=""
    id="input-vaadin-checkbox-1"
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
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-checkbox shadow default */

snapshots["vaadin-checkbox host name"] = 
`<vaadin-checkbox has-value="">
  <label
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <input
    id="input-vaadin-checkbox-1"
    name="Name"
    slot="input"
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
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
    Label
  </label>
  <input
    id="input-vaadin-checkbox-1"
    slot="input"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host label */

