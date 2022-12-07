/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-details host default"] = 
`<vaadin-details>
  <vaadin-details-summary
    aria-expanded="false"
    role="button"
    slot="summary"
    tabindex="0"
  >
    Summary
  </vaadin-details-summary>
  <div>
    Content
  </div>
</vaadin-details>
`;
/* end snapshot vaadin-details host default */

snapshots["vaadin-details shadow default"] = 
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
/* end snapshot vaadin-details shadow default */

snapshots["vaadin-details shadow opened"] = 
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
/* end snapshot vaadin-details shadow opened */

