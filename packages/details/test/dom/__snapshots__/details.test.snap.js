/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-crud host default"] = 
`<vaadin-details>
  <vaadin-details-heading
    aria-expanded="false"
    slot="summary"
  >
    Summary
  </vaadin-details-heading>
  <div>
    <input>
  </div>
</vaadin-details>
`;
/* end snapshot vaadin-crud host default */

snapshots["vaadin-crud shadow default"] = 
`<slot name="summary">
</slot>
<div
  aria-hidden="true"
  part="content"
  style="max-height: 0px;"
>
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-crud shadow default */

snapshots["vaadin-crud shadow opened"] = 
`<slot name="summary">
</slot>
<div
  aria-hidden="false"
  part="content"
  style=""
>
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-crud shadow opened */

