/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-accordion-panel host default"] = 
`<vaadin-accordion-panel>
  <vaadin-accordion-heading
    role="heading"
    slot="summary"
  >
    Summary
  </vaadin-accordion-heading>
  <div>
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host default */

snapshots["vaadin-accordion-panel host opened"] = 
`<vaadin-accordion-panel opened="">
  <vaadin-accordion-heading
    opened=""
    role="heading"
    slot="summary"
  >
    Summary
  </vaadin-accordion-heading>
  <div>
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host opened */

snapshots["vaadin-accordion-panel host disabled"] = 
`<vaadin-accordion-panel disabled="">
  <vaadin-accordion-heading
    aria-disabled="true"
    disabled=""
    role="heading"
    slot="summary"
    tabindex="-1"
  >
    Summary
  </vaadin-accordion-heading>
  <div>
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host disabled */

snapshots["vaadin-accordion-panel host theme"] = 
`<vaadin-accordion-panel theme="filled">
  <vaadin-accordion-heading
    role="heading"
    slot="summary"
    theme="filled"
  >
    Summary
  </vaadin-accordion-heading>
  <div>
    Content
  </div>
</vaadin-accordion-panel>
`;
/* end snapshot vaadin-accordion-panel host theme */

snapshots["vaadin-accordion-panel shadow default"] = 
`<slot name="summary">
</slot>
<div
  aria-hidden="true"
  part="content"
>
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-accordion-panel shadow default */

snapshots["vaadin-accordion-panel shadow opened"] = 
`<slot name="summary">
</slot>
<div
  aria-hidden="false"
  part="content"
>
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-accordion-panel shadow opened */

snapshots["vaadin-accordion-panel shadow disabled"] = 
`<slot name="summary">
</slot>
<div
  aria-hidden="true"
  part="content"
>
  <slot>
  </slot>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-accordion-panel shadow disabled */

