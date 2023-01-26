/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-item host default"] = 
`<vaadin-item
  aria-selected="false"
  role="option"
>
</vaadin-item>
`;
/* end snapshot vaadin-item host default */

snapshots["vaadin-item host selected"] = 
`<vaadin-item
  aria-selected="true"
  role="option"
  selected=""
>
</vaadin-item>
`;
/* end snapshot vaadin-item host selected */

snapshots["vaadin-item host disabled"] = 
`<vaadin-item
  aria-disabled="true"
  aria-selected="false"
  disabled=""
  role="option"
>
</vaadin-item>
`;
/* end snapshot vaadin-item host disabled */

snapshots["vaadin-item shadow default"] = 
`<span
  aria-hidden="true"
  part="checkmark"
>
</span>
<div part="content">
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-item shadow default */

