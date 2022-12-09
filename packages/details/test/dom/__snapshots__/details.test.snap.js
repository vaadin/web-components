/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-details host default"] = 
`<vaadin-details>
  <vaadin-details-summary
    aria-controls="content-vaadin-details-1"
    aria-expanded="false"
    role="button"
    slot="summary"
    tabindex="0"
  >
    Summary
  </vaadin-details-summary>
  <div
    aria-hidden="true"
    id="content-vaadin-details-1"
  >
    Content
  </div>
</vaadin-details>
`;
/* end snapshot vaadin-details host default */

snapshots["vaadin-details host opened"] = 
`<vaadin-details opened="">
  <vaadin-details-summary
    aria-controls="content-vaadin-details-1"
    aria-expanded="true"
    opened=""
    role="button"
    slot="summary"
    tabindex="0"
  >
    Summary
  </vaadin-details-summary>
  <div
    aria-hidden="false"
    id="content-vaadin-details-1"
  >
    Content
  </div>
</vaadin-details>
`;
/* end snapshot vaadin-details host opened */

snapshots["vaadin-details host disabled"] = 
`<vaadin-details disabled="">
  <vaadin-details-summary
    aria-controls="content-vaadin-details-1"
    aria-disabled="true"
    aria-expanded="false"
    disabled=""
    role="button"
    slot="summary"
    tabindex="-1"
  >
    Summary
  </vaadin-details-summary>
  <div
    aria-hidden="true"
    id="content-vaadin-details-1"
  >
    Content
  </div>
</vaadin-details>
`;
/* end snapshot vaadin-details host disabled */

snapshots["vaadin-details host theme"] = 
`<vaadin-details theme="filled">
  <vaadin-details-summary
    aria-controls="content-vaadin-details-1"
    aria-expanded="false"
    role="button"
    slot="summary"
    tabindex="0"
    theme="filled"
  >
    Summary
  </vaadin-details-summary>
  <div
    aria-hidden="true"
    id="content-vaadin-details-1"
  >
    Content
  </div>
</vaadin-details>
`;
/* end snapshot vaadin-details host theme */

snapshots["vaadin-details shadow default"] = 
`<slot name="summary">
</slot>
<div part="content">
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
<div part="content">
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-details shadow opened */

