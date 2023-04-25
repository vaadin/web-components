/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-side-nav host default"] = 
`<vaadin-side-nav
  aria-labelledby="side-nav-label-0"
  role="navigation"
>
  <span
    id="side-nav-label-0"
    slot="label"
  >
    Main menu
  </span>
  <vaadin-side-nav-item>
    Item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item>
    Item 2
  </vaadin-side-nav-item>
</vaadin-side-nav>
`;
/* end snapshot vaadin-side-nav host default */

snapshots["vaadin-side-nav host collapsible"] = 
`<vaadin-side-nav
  aria-labelledby="side-nav-label-1"
  collapsible=""
  role="navigation"
>
  <span
    id="side-nav-label-1"
    slot="label"
  >
    Main menu
  </span>
  <vaadin-side-nav-item>
    Item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item>
    Item 2
  </vaadin-side-nav-item>
</vaadin-side-nav>
`;
/* end snapshot vaadin-side-nav host collapsible */

snapshots["vaadin-side-nav host collapsed"] = 
`<vaadin-side-nav
  aria-labelledby="side-nav-label-2"
  collapsed=""
  collapsible=""
  role="navigation"
>
  <span
    id="side-nav-label-2"
    slot="label"
  >
    Main menu
  </span>
  <vaadin-side-nav-item>
    Item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item>
    Item 2
  </vaadin-side-nav-item>
</vaadin-side-nav>
`;
/* end snapshot vaadin-side-nav host collapsed */

snapshots["vaadin-side-nav shadow default"] = 
`<summary part="label">
  <slot name="label">
  </slot>
</summary>
<slot role="list">
</slot>
`;
/* end snapshot vaadin-side-nav shadow default */

snapshots["vaadin-side-nav shadow collapsible"] = 
`<details open="">
  <summary part="label">
    <slot name="label">
    </slot>
  </summary>
  <slot role="list">
  </slot>
</details>
`;
/* end snapshot vaadin-side-nav shadow collapsible */

snapshots["vaadin-side-nav shadow collapsed"] = 
`<details>
  <summary part="label">
    <slot name="label">
    </slot>
  </summary>
  <slot role="list">
  </slot>
</details>
`;
/* end snapshot vaadin-side-nav shadow collapsed */

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
/* end snapshot vaadin-side-nav-item item expanded */

snapshots["vaadin-side-nav-item item active"] = 
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
/* end snapshot vaadin-side-nav-item shadow expanded */

snapshots["vaadin-side-nav-item shadow active"] = 
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

