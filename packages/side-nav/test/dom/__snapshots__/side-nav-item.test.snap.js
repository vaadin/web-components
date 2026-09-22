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
  <span slot="suffix">
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
  <span slot="suffix">
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

snapshots["vaadin-side-nav-item item disabled"] = 
`<vaadin-side-nav-item
  aria-disabled="true"
  disabled=""
  has-children=""
  role="listitem"
>
  <vaadin-icon
    icon="vaadin:chart"
    slot="prefix"
  >
  </vaadin-icon>
  Item
  <span slot="suffix">
    2
  </span>
  <vaadin-side-nav-item
    aria-disabled="true"
    disabled=""
    role="listitem"
    slot="children"
  >
    Child item 1
  </vaadin-side-nav-item>
  <vaadin-side-nav-item
    aria-disabled="true"
    disabled=""
    role="listitem"
    slot="children"
  >
    Child item 2
  </vaadin-side-nav-item>
</vaadin-side-nav-item>
`;
/* end snapshot vaadin-side-nav-item item disabled */

snapshots["vaadin-side-nav-item item current"] = 
`<vaadin-side-nav-item
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
  <span slot="suffix">
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
  <span slot="suffix">
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
`<div
  id="content"
  part="content"
>
  <a
    aria-current="false"
    id="link"
    part="link"
    tabindex="-1"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
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
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  inline=""
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="true"
    hidden=""
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow default */

snapshots["vaadin-side-nav-item shadow expanded"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-current="false"
    id="link"
    part="link"
    tabindex="-1"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
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
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  inline=""
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="false"
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow expanded */

snapshots["vaadin-side-nav-item shadow current"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-current="page"
    href=""
    id="link"
    part="link"
    tabindex="0"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
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
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  inline=""
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="false"
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow current */

snapshots["vaadin-side-nav-item shadow path"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-current="false"
    href="path"
    id="link"
    part="link"
    tabindex="0"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
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
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  inline=""
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="true"
    hidden=""
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow path */

snapshots["vaadin-side-nav-item shadow null path"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-current="false"
    id="link"
    part="link"
    tabindex="-1"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
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
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  inline=""
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="true"
    hidden=""
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow null path */

snapshots["vaadin-side-nav-item shadow i18n"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-current="false"
    id="link"
    part="link"
    tabindex="-1"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
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
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  inline=""
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="true"
    hidden=""
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle children
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow i18n */

snapshots["vaadin-side-nav-item shadow overlay children"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-controls="children"
    aria-current="false"
    aria-expanded="false"
    aria-haspopup="true"
    id="link"
    part="link"
    role="button"
    tabindex="0"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
    <slot name="suffix">
    </slot>
  </a>
  <span
    aria-hidden="true"
    part="toggle-button"
  >
  </span>
</div>
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="false"
    id="children"
    part="children"
    role="list"
  >
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow overlay children */

/* end snapshot vaadin-side-nav-item shadow overlay children expanded */

snapshots["vaadin-side-nav-item shadow overlay children with path"] = 
`<div
  id="content"
  part="content"
>
  <a
    aria-controls="children"
    aria-current="false"
    aria-expanded="false"
    aria-haspopup="true"
    href="/path"
    id="link"
    part="link"
    tabindex="0"
  >
    <slot name="prefix">
    </slot>
    <slot>
    </slot>
    <div class="sr-only">
    </div>
    <slot name="suffix">
    </slot>
  </a>
  <span
    aria-hidden="true"
    part="toggle-button"
  >
  </span>
</div>
<vaadin-side-nav-overlay
  exportparts="overlay: flyout, content: flyout-content"
  horizontal-align="start"
  modeless=""
  no-horizontal-overlap=""
  popover="manual"
  vertical-align="top"
>
  <ul
    aria-hidden="false"
    id="children"
    part="children"
    role="list"
  >
    <li
      part="parent-link-item"
      role="listitem"
    >
      <a
        aria-current="false"
        href="/path"
        part="parent-link"
      >
        Item
      </a>
    </li>
    <slot name="children">
    </slot>
  </ul>
</vaadin-side-nav-overlay>
<div
  hidden=""
  id="i18n"
>
  Toggle child items
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-side-nav-item shadow overlay children with path */

