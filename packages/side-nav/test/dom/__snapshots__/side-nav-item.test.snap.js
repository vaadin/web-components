/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-side-nav-item item default"] = 
`<vaadin-side-nav-item role="listitem">
  <vaadin-icon
    icon="vaadin:chart"
    slot="prefix"
  >
  </vaadin-icon>
  Item
  <span
    slot="suffix"
    theme="badge primary"
  >
    2
  </span>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 2
  </vaadin-side-nav-item>
</vaadin-side-nav-item>
`;
/* end snapshot vaadin-side-nav-item item default */

snapshots["vaadin-side-nav-item item expanded"] = 
`<vaadin-side-nav-item
  expanded=""
  role="listitem"
>
  <vaadin-icon
    icon="vaadin:chart"
    slot="prefix"
  >
  </vaadin-icon>
  Item
  <span
    slot="suffix"
    theme="badge primary"
  >
    2
  </span>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 2
  </vaadin-side-nav-item>
</vaadin-side-nav-item>
`;
/* end snapshot vaadin-side-nav-item item expanded */

snapshots["vaadin-side-nav-item item active"] = 
`<vaadin-side-nav-item
  active=""
  child-active=""
  expanded=""
  path=""
  role="listitem"
>
</vaadin-side-nav-item>
`;
/* end snapshot vaadin-side-nav-item item active */

snapshots["vaadin-side-nav-item item passive"] = 
`<vaadin-side-nav-item role="listitem">
  <vaadin-icon
    icon="vaadin:chart"
    slot="prefix"
  >
  </vaadin-icon>
  Item
  <span
    slot="suffix"
    theme="badge primary"
  >
    2
  </span>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 2
  </vaadin-side-nav-item>
</vaadin-side-nav-item>
`;
/* end snapshot vaadin-side-nav-item item passive */

snapshots["vaadin-side-nav-item item with path"] = 
`<vaadin-side-nav-item role="listitem">
  <vaadin-icon
    icon="vaadin:chart"
    slot="prefix"
  >
  </vaadin-icon>
  Item
  <span
    slot="suffix"
    theme="badge primary"
  >
    2
  </span>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item
    role="listitem"
    slot="children"
  >
    Child item 2
  </vaadin-side-nav-item>
</vaadin-side-nav-item>
`;
/* end snapshot vaadin-side-nav-item item with path */

snapshots["vaadin-side-nav-item shadow default"] = 
`<a
  aria-current="false"
  part="item"
>
  <slot name="prefix">
  </slot>
  <slot>
  </slot>
  <slot name="suffix">
  </slot>
  <button
    aria-controls="children"
    aria-expanded="false"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</a>
<slot
  hidden=""
  id="children"
  name="children"
  part="children"
  role="list"
>
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow default */

snapshots["vaadin-side-nav-item shadow expanded"] = 
`<a
  aria-current="false"
  part="item"
>
  <slot name="prefix">
  </slot>
  <slot>
  </slot>
  <slot name="suffix">
  </slot>
  <button
    aria-controls="children"
    aria-expanded="true"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</a>
<slot
  id="children"
  name="children"
  part="children"
  role="list"
>
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow expanded */

snapshots["vaadin-side-nav-item shadow active"] = 
`<a
  aria-current="page"
  href=""
  part="item"
>
  <slot name="prefix">
  </slot>
  <slot>
  </slot>
  <slot name="suffix">
  </slot>
  <button
    aria-controls="children"
    aria-expanded="true"
    aria-label="Toggle child items"
    hidden=""
    part="toggle-button"
  >
  </button>
</a>
<slot
  id="children"
  name="children"
  part="children"
  role="list"
>
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow active */

snapshots["vaadin-side-nav-item shadow passive"] = 
`<a
  aria-current="false"
  part="item"
>
  <slot name="prefix">
  </slot>
  <slot>
  </slot>
  <slot name="suffix">
  </slot>
  <button
    aria-controls="children"
    aria-expanded="false"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</a>
<slot
  hidden=""
  id="children"
  name="children"
  part="children"
  role="list"
>
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow passive */

snapshots["vaadin-side-nav-item shadow with path"] = 
`<a
  aria-current="false"
  href="path"
  part="item"
>
  <slot name="prefix">
  </slot>
  <slot>
  </slot>
  <slot name="suffix">
  </slot>
  <button
    aria-controls="children"
    aria-expanded="false"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</a>
<slot
  hidden=""
  id="children"
  name="children"
  part="children"
  role="list"
>
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow with path */

snapshots["vaadin-side-nav-item shadow path"] = 
`<a
  aria-current="false"
  href="path"
  part="item"
>
  <slot name="prefix">
  </slot>
  <slot>
  </slot>
  <slot name="suffix">
  </slot>
  <button
    aria-controls="children"
    aria-expanded="false"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</a>
<slot
  hidden=""
  id="children"
  name="children"
  part="children"
  role="list"
>
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow path */

