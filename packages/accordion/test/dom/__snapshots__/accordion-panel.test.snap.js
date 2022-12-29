/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-accordion-panel host default"] = 
`<vaadin-accordion-panel>
  <vaadin-accordion-heading
    aria-controls="content-vaadin-accordion-panel-0"
    id="summary-vaadin-accordion-panel-1"
    role="heading"
    slot="summary"
  >
    Summary
  </vaadin-accordion-heading>
  <div
    aria-hidden="true"
    aria-labelledby="summary-vaadin-accordion-panel-1"
    id="content-vaadin-accordion-panel-0"
    role="region"
  >
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host default */

snapshots["vaadin-accordion-panel host opened"] = 
`<vaadin-accordion-panel opened="">
  <vaadin-accordion-heading
    aria-controls="content-vaadin-accordion-panel-0"
    id="summary-vaadin-accordion-panel-1"
    opened=""
    role="heading"
    slot="summary"
  >
    Summary
  </vaadin-accordion-heading>
  <div
    aria-hidden="false"
    aria-labelledby="summary-vaadin-accordion-panel-1"
    id="content-vaadin-accordion-panel-0"
    role="region"
  >
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host opened */

snapshots["vaadin-accordion-panel host disabled"] = 
`<vaadin-accordion-panel disabled="">
  <vaadin-accordion-heading
    aria-controls="content-vaadin-accordion-panel-0"
    aria-disabled="true"
    disabled=""
    id="summary-vaadin-accordion-panel-1"
    role="heading"
    slot="summary"
    tabindex="-1"
  >
    Summary
  </vaadin-accordion-heading>
  <div
    aria-hidden="true"
    aria-labelledby="summary-vaadin-accordion-panel-1"
    id="content-vaadin-accordion-panel-0"
    role="region"
  >
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host disabled */

snapshots["vaadin-accordion-panel host theme"] = 
`<vaadin-accordion-panel theme="filled">
  <vaadin-accordion-heading
    aria-controls="content-vaadin-accordion-panel-0"
    id="summary-vaadin-accordion-panel-1"
    role="heading"
    slot="summary"
    theme="filled"
  >
    Summary
  </vaadin-accordion-heading>
  <div
    aria-hidden="true"
    aria-labelledby="summary-vaadin-accordion-panel-1"
    id="content-vaadin-accordion-panel-0"
    role="region"
  >
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host theme */

snapshots["vaadin-accordion-panel shadow default"] = 
`<slot name="summary">
</slot>
<div part="content">
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-accordion-panel shadow default */

