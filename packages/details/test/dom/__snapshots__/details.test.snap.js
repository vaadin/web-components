/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-crud host default"] = 
`<vaadin-details tabindex="0">
  <div slot="summary">
    Summary
  </div>
  <input>
</vaadin-details>
`;
/* end snapshot vaadin-crud host default */

snapshots["vaadin-crud shadow default"] = 
`<div role="heading">
  <div
    aria-controls="vaadin-details-content-1"
    aria-expanded="false"
    part="summary"
    role="button"
    tabindex="0"
  >
    <span
      aria-hidden="true"
      part="toggle"
    >
    </span>
    <span part="summary-content">
      <slot name="summary">
      </slot>
    </span>
  </div>
  <slot name="tooltip">
  </slot>
</div>
<section
  aria-hidden="true"
  id="vaadin-details-content-1"
  part="content"
  style="max-height: 0px;"
>
  <slot>
  </slot>
</section>
`;
/* end snapshot vaadin-crud shadow default */

snapshots["vaadin-crud shadow opened"] = 
`<div role="heading">
  <div
    aria-controls="vaadin-details-content-2"
    aria-expanded="true"
    part="summary"
    role="button"
    tabindex="0"
  >
    <span
      aria-hidden="true"
      part="toggle"
    >
    </span>
    <span part="summary-content">
      <slot name="summary">
      </slot>
    </span>
  </div>
  <slot name="tooltip">
  </slot>
</div>
<section
  aria-hidden="false"
  id="vaadin-details-content-2"
  part="content"
  style=""
>
  <slot>
  </slot>
</section>
`;
/* end snapshot vaadin-crud shadow opened */

