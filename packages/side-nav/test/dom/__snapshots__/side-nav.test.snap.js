/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-side-nav host default"] = 
`<vaadin-side-nav
  aria-labelledby="side-nav-label-0"
  has-children=""
  role="navigation"
>
  <span
    id="side-nav-label-0"
    slot="label"
  >
    Main menu
  </span>
  <vaadin-side-nav-item role="listitem">
    <span>
      Item 1
    </span>
  </vaadin-side-nav-item>
  <vaadin-side-nav-item role="listitem">
    <span>
      Item 2
    </span>
  </vaadin-side-nav-item>
</vaadin-side-nav>
`;
/* end snapshot vaadin-side-nav host default */

snapshots["vaadin-side-nav host collapsible"] = 
`<vaadin-side-nav
  aria-labelledby="side-nav-label-1"
  collapsible=""
  has-children=""
  role="navigation"
>
  <span
    id="side-nav-label-1"
    slot="label"
  >
    Main menu
  </span>
  <vaadin-side-nav-item role="listitem">
    <span>
      Item 1
    </span>
  </vaadin-side-nav-item>
  <vaadin-side-nav-item role="listitem">
    <span>
      Item 2
    </span>
  </vaadin-side-nav-item>
</vaadin-side-nav>
`;
/* end snapshot vaadin-side-nav host collapsible */

snapshots["vaadin-side-nav host collapsed"] = 
`<vaadin-side-nav
  aria-labelledby="side-nav-label-2"
  collapsed=""
  collapsible=""
  has-children=""
  role="navigation"
>
  <span
    id="side-nav-label-2"
    slot="label"
  >
    Main menu
  </span>
  <vaadin-side-nav-item role="listitem">
    <span>
      Item 1
    </span>
  </vaadin-side-nav-item>
  <vaadin-side-nav-item role="listitem">
    <span>
      Item 2
    </span>
  </vaadin-side-nav-item>
</vaadin-side-nav>
`;
/* end snapshot vaadin-side-nav host collapsed */

snapshots["vaadin-side-nav shadow default"] = 
`<div part="label">
  <slot name="label">
  </slot>
</div>
<ul
  aria-hidden="false"
  id="children"
  part="children"
  role="list"
>
  <slot>
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav shadow default */

snapshots["vaadin-side-nav shadow collapsible"] = 
`<button
  aria-controls="children"
  aria-expanded="true"
  part="label"
>
  <slot name="label">
  </slot>
  <span
    aria-hidden="true"
    part="toggle-button"
  >
  </span>
</button>
<ul
  aria-hidden="false"
  id="children"
  part="children"
  role="list"
>
  <slot>
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav shadow collapsible */

snapshots["vaadin-side-nav shadow collapsed"] = 
`<button
  aria-controls="children"
  aria-expanded="false"
  part="label"
>
  <slot name="label">
  </slot>
  <span
    aria-hidden="true"
    part="toggle-button"
  >
  </span>
</button>
<ul
  aria-hidden="true"
  hidden=""
  id="children"
  part="children"
  role="list"
>
  <slot>
  </slot>
</ul>
`;
/* end snapshot vaadin-side-nav shadow collapsed */

