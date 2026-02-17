/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-badge host default"] = 
`<vaadin-badge>
</vaadin-badge>
`;
/* end snapshot vaadin-badge host default */

snapshots["vaadin-badge host content"] = 
`<vaadin-badge has-content="">
  Content
</vaadin-badge>
`;
/* end snapshot vaadin-badge host content */

snapshots["vaadin-badge host number"] = 
`<vaadin-badge has-number="">
</vaadin-badge>
`;
/* end snapshot vaadin-badge host number */

snapshots["vaadin-badge shadow default"] = 
`<div part="prefix">
  <slot name="prefix">
  </slot>
</div>
<div part="number">
</div>
<div part="content">
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-badge shadow default */

snapshots["vaadin-badge shadow number"] = 
`<div part="prefix">
  <slot name="prefix">
  </slot>
</div>
<div part="number">
  5
</div>
<div part="content">
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-badge shadow number */

