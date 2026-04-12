/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumb host default"] = 
`<vaadin-breadcrumb
  aria-label="Breadcrumb"
  role="navigation"
>
  <vaadin-breadcrumb-item
    first=""
    path="/home"
    role="listitem"
  >
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item
    path="/products"
    role="listitem"
  >
    Products
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item
    current=""
    role="listitem"
  >
    Current Page
  </vaadin-breadcrumb-item>
</vaadin-breadcrumb>
`;
/* end snapshot vaadin-breadcrumb host default */

snapshots["vaadin-breadcrumb shadow default"] = 
`<div
  id="list"
  part="list"
  role="list"
>
  <slot id="items">
  </slot>
  <div
    hidden=""
    id="overflow"
    role="listitem"
  >
    <span
      aria-hidden="true"
      class="separator"
    >
      ›
    </span>
    <button
      aria-expanded="false"
      aria-haspopup="true"
      aria-label="Show more"
      part="overflow-button"
      tabindex="0"
    >
      …
    </button>
  </div>
</div>
<div
  aria-hidden="true"
  hidden=""
>
  <slot
    id="separator-slot"
    name="separator"
  >
  </slot>
</div>
<vaadin-breadcrumb-overlay
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
>
</vaadin-breadcrumb-overlay>
`;
/* end snapshot vaadin-breadcrumb shadow default */

snapshots["vaadin-breadcrumb-item host default"] = 
`<vaadin-breadcrumb-item role="listitem">
  Item
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item host default */

snapshots["vaadin-breadcrumb-item host path"] = 
`<vaadin-breadcrumb-item role="listitem">
  Item
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item host path */

snapshots["vaadin-breadcrumb-item host current"] = 
`<vaadin-breadcrumb-item
  current=""
  role="listitem"
>
  Item
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item host current */

snapshots["vaadin-breadcrumb-item host disabled"] = 
`<vaadin-breadcrumb-item
  aria-disabled="true"
  disabled=""
  role="listitem"
>
  Item
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item host disabled */

snapshots["vaadin-breadcrumb-item shadow default"] = 
`<span
  aria-hidden="true"
  id="separator"
  part="separator"
>
  ›
</span>
<a
  id="link"
  part="link"
>
  <slot>
  </slot>
</a>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-breadcrumb-item shadow default */

snapshots["vaadin-breadcrumb-item shadow path"] = 
`<span
  aria-hidden="true"
  id="separator"
  part="separator"
>
  ›
</span>
<a
  href="/home"
  id="link"
  part="link"
  tabindex="0"
>
  <slot>
  </slot>
</a>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-breadcrumb-item shadow path */

snapshots["vaadin-breadcrumb-item shadow current"] = 
`<span
  aria-hidden="true"
  id="separator"
  part="separator"
>
  ›
</span>
<a
  aria-current="page"
  id="link"
  part="link"
>
  <slot>
  </slot>
</a>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-breadcrumb-item shadow current */

snapshots["vaadin-breadcrumb-item shadow disabled"] = 
`<span
  aria-hidden="true"
  id="separator"
  part="separator"
>
  ›
</span>
<a
  id="link"
  part="link"
  tabindex="-1"
>
  <slot>
  </slot>
</a>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-breadcrumb-item shadow disabled */

