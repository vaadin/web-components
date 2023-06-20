/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-side-nav-item item default"] = 
`<vaadin-side-nav-item
  has-children=""
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
/* end snapshot vaadin-side-nav-item item default */

snapshots["vaadin-side-nav-item item expanded"] = 
`<vaadin-side-nav-item
  expanded=""
  has-children=""
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
  has-children=""
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
/* end snapshot vaadin-side-nav-item item active */

snapshots["vaadin-side-nav-item item path"] = 
`<vaadin-side-nav-item
  has-children=""
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
/* end snapshot vaadin-side-nav-item item path */

snapshots["vaadin-side-nav-item shadow default"] = 
`<div part="content">
  <a
    aria-current="false"
    part="link"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <slot name="suffix">
    </slot>
  </a>
  <button
    aria-controls="children"
    aria-expanded="false"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</div>
<ul
  hidden=""
  part="children"
>
  <slot name="children">
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav-item shadow default */

snapshots["vaadin-side-nav-item shadow expanded"] = 
`<div part="content">
  <a
    aria-current="false"
    part="link"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <slot name="suffix">
    </slot>
  </a>
  <button
    aria-controls="children"
    aria-expanded="true"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</div>
<ul part="children">
  <slot name="children">
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav-item shadow expanded */

snapshots["vaadin-side-nav-item shadow active"] = 
`<div part="content">
  <a
    aria-current="page"
    href=""
    part="link"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <slot name="suffix">
    </slot>
  </a>
  <button
    aria-controls="children"
    aria-expanded="true"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</div>
<ul part="children">
  <slot name="children">
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav-item shadow active */

snapshots["vaadin-side-nav-item shadow path"] = 
`<div part="content">
  <a
    aria-current="false"
    href="path"
    part="link"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <slot name="suffix">
    </slot>
  </a>
  <button
    aria-controls="children"
    aria-expanded="false"
    aria-label="Toggle child items"
    part="toggle-button"
  >
  </button>
</div>
<ul
  hidden=""
  part="children"
>
  <slot name="children">
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav-item shadow path */

