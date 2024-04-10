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
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <input
    id="input-vaadin-checkbox-1"
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
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
    Label
  </label>
  <input
    id="input-vaadin-checkbox-1"
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

snapshots["vaadin-checkbox host readonly"] = 
`<vaadin-checkbox
  has-value=""
  readonly=""
>
  <label
    for="input-vaadin-checkbox-1"
    id="label-vaadin-checkbox-0"
    slot="label"
  >
  </label>
  <input
    aria-readonly="true"
    id="input-vaadin-checkbox-1"
    slot="input"
    tabindex="0"
    type="checkbox"
    value="on"
  >
</vaadin-checkbox>
`;
/* end snapshot vaadin-checkbox host readonly */

snapshots["vaadin-checkbox shadow default"] = 
`<div class="vaadin-checkbox-container">
  <div
    aria-hidden="true"
    part="checkbox"
  >
  </div>
  <slot name="input">
  </slot>
  <slot name="label">
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-checkbox shadow default */

