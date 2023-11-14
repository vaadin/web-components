/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-radio-button host default"] = 
`<vaadin-radio-button
  has-label=""
  has-value=""
  label="Radio button"
>
  <label
    for="input-vaadin-radio-button-1"
    id="label-vaadin-radio-button-0"
    slot="label"
  >
    Radio button
  </label>
  <input
    id="input-vaadin-radio-button-1"
    slot="input"
    tabindex="0"
    type="radio"
    value="on"
  >
</vaadin-radio-button>
`;
/* end snapshot vaadin-radio-button host default */

snapshots["vaadin-radio-button host disabled"] = 
`<vaadin-radio-button
  aria-disabled="true"
  disabled=""
  has-label=""
  has-value=""
  label="Radio button"
>
  <label
    for="input-vaadin-radio-button-1"
    id="label-vaadin-radio-button-0"
    slot="label"
  >
    Radio button
  </label>
  <input
    disabled=""
    id="input-vaadin-radio-button-1"
    slot="input"
    tabindex="-1"
    type="radio"
    value="on"
  >
</vaadin-radio-button>
`;
/* end snapshot vaadin-radio-button host disabled */

snapshots["vaadin-radio-button shadow default"] = 
`<div class="vaadin-radio-button-container">
  <div
    aria-hidden="true"
    part="radio"
  >
  </div>
  <slot name="input">
  </slot>
  <slot name="label">
  </slot>
</div>
`;
/* end snapshot vaadin-radio-button shadow default */

