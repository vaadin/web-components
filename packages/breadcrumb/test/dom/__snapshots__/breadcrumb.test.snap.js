/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumb shadow default"] = 
`<div
  part="list"
  role="list"
>
  <slot name="root">
  </slot>
  <div
    part="overflow"
    role="listitem"
  >
    <button
      aria-expanded="false"
      aria-haspopup="true"
      aria-label=""
      part="overflow-button"
    >
    </button>
  </div>
  <slot>
  </slot>
</div>
<vaadin-breadcrumb-overlay
  exportparts="overlay, content"
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumb-overlay>
`;
/* end snapshot vaadin-breadcrumb shadow default */

snapshots["vaadin-breadcrumb shadow has-overflow shadow"] = 
`<div
  part="list"
  role="list"
>
  <slot name="root">
  </slot>
  <div
    part="overflow"
    role="listitem"
  >
    <button
      aria-expanded="false"
      aria-haspopup="true"
      aria-label=""
      part="overflow-button"
    >
    </button>
  </div>
  <slot>
  </slot>
</div>
<vaadin-breadcrumb-overlay
  exportparts="overlay, content"
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumb-overlay>
`;
/* end snapshot vaadin-breadcrumb shadow has-overflow shadow */

