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
`<div part="icon">
  <slot name="icon">
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
`<div part="icon">
  <slot name="icon">
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

snapshots["vaadin-badge shadow dot"] = 
`<div
  class="sr-only"
  part="icon"
>
  <slot name="icon">
  </slot>
</div>
<div
  class="sr-only"
  part="number"
>
</div>
<div
  class="sr-only"
  part="content"
>
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-badge shadow dot */

snapshots["vaadin-badge shadow icon-only"] = 
`<div part="icon">
  <slot name="icon">
  </slot>
</div>
<div
  class="sr-only"
  part="number"
>
</div>
<div
  class="sr-only"
  part="content"
>
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-badge shadow icon-only */

snapshots["vaadin-badge shadow number-only"] = 
`<div
  class="sr-only"
  part="icon"
>
  <slot name="icon">
  </slot>
</div>
<div part="number">
</div>
<div
  class="sr-only"
  part="content"
>
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-badge shadow number-only */

