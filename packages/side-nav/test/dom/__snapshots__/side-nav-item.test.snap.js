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

snapshots["vaadin-side-nav-item item current"] = 
`<vaadin-side-nav-item
  child-current=""
  current=""
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
/* end snapshot vaadin-side-nav-item item current */

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
    id="link"
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
    aria-labelledby="link i18n"
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
<div
  class="sr-only"
  id="i18n"
>
  Toggle child items
</div>
`;
/* end snapshot vaadin-side-nav-item shadow default */

snapshots["vaadin-side-nav-item shadow expanded"] = 
`<div part="content">
  <a
    aria-current="false"
    id="link"
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
    aria-labelledby="link i18n"
    part="toggle-button"
  >
  </button>
</div>
<ul part="children">
  <slot name="children">
  </slot>
</ul>
<div
  class="sr-only"
  id="i18n"
>
  Toggle child items
</div>
`;
/* end snapshot vaadin-side-nav-item shadow expanded */

snapshots["vaadin-side-nav-item shadow current"] = 
`<div part="content">
  <a
    aria-current="page"
    href=""
    id="link"
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
    aria-labelledby="link i18n"
    part="toggle-button"
  >
  </button>
</div>
<ul part="children">
  <slot name="children">
  </slot>
</ul>
<div
  class="sr-only"
  id="i18n"
>
  Toggle child items
</div>
`;
/* end snapshot vaadin-side-nav-item shadow current */

snapshots["vaadin-side-nav-item shadow path"] = 
`<div part="content">
  <a
    aria-current="false"
    href="path"
    id="link"
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
    aria-labelledby="link i18n"
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
<div
  class="sr-only"
  id="i18n"
>
  Toggle child items
</div>
`;
/* end snapshot vaadin-side-nav-item shadow path */

snapshots["vaadin-side-nav-item shadow i18n"] = 
`<div part="content">
  <a
    aria-current="false"
    id="link"
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
    aria-labelledby="link i18n"
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
<div
  class="sr-only"
  id="i18n"
>
  Toggle children
</div>
`;
/* end snapshot vaadin-side-nav-item shadow i18n */

