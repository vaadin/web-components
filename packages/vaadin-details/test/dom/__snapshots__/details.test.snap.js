/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-details default"] = 
`<div role="heading">
  <div
    aria-expanded="false"
    part="summary"
    role="button"
    tabindex="0"
  >
    <span part="toggle">
    </span>
    <span part="summary-content">
      <slot name="summary">
      </slot>
    </span>
  </div>
</div>
<section
  aria-hidden="true"
  part="content"
  style="max-height: 0px;"
>
  <slot>
  </slot>
</section>
`;
/* end snapshot vaadin-details default */

snapshots["vaadin-details opened"] = 
`<div role="heading">
  <div
    aria-expanded="true"
    part="summary"
    role="button"
    tabindex="0"
  >
    <span part="toggle">
    </span>
    <span part="summary-content">
      <slot name="summary">
      </slot>
    </span>
  </div>
</div>
<section
  aria-hidden="false"
  part="content"
  style=""
>
  <slot>
  </slot>
</section>
`;
/* end snapshot vaadin-details opened */

snapshots["vaadin-details disabled"] = 
`<div role="heading">
  <div
    aria-expanded="false"
    disabled=""
    part="summary"
    role="button"
    tabindex="-1"
  >
    <span part="toggle">
    </span>
    <span part="summary-content">
      <slot name="summary">
      </slot>
    </span>
  </div>
</div>
<section
  aria-hidden="true"
  part="content"
  style="max-height: 0px;"
>
  <slot>
  </slot>
</section>
`;
/* end snapshot vaadin-details disabled */

