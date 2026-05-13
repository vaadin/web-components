/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumbs-item host default"] = 
`<vaadin-breadcrumbs-item role="listitem">
</vaadin-breadcrumbs-item>
`;
/* end snapshot vaadin-breadcrumbs-item host default */

snapshots["vaadin-breadcrumbs-item host prefix"] = 
`<vaadin-breadcrumbs-item
  has-prefix=""
  role="listitem"
>
  <span slot="prefix">
    icon
  </span>
</vaadin-breadcrumbs-item>
`;
/* end snapshot vaadin-breadcrumbs-item host prefix */

snapshots["vaadin-breadcrumbs-item host prefix path"] = 
`<vaadin-breadcrumbs-item
  has-prefix=""
  role="listitem"
>
  <span slot="prefix">
    icon
  </span>
</vaadin-breadcrumbs-item>
`;
/* end snapshot vaadin-breadcrumbs-item host prefix path */

snapshots["vaadin-breadcrumbs-item shadow default"] = 
`<span part="nolink">
  <slot name="prefix">
  </slot>
  <span part="label">
    <slot>
    </slot>
  </span>
</span>
`;
/* end snapshot vaadin-breadcrumbs-item shadow default */

snapshots["vaadin-breadcrumbs-item shadow path"] = 
`<a
  href="/foo"
  part="link"
>
  <slot name="prefix">
  </slot>
  <span part="label">
    <slot>
    </slot>
  </span>
</a>
`;
/* end snapshot vaadin-breadcrumbs-item shadow path */

snapshots["vaadin-breadcrumbs-item shadow current"] = 
`<span
  aria-current="page"
  part="nolink"
>
  <slot name="prefix">
  </slot>
  <span part="label">
    <slot>
    </slot>
  </span>
</span>
`;
/* end snapshot vaadin-breadcrumbs-item shadow current */

snapshots["vaadin-breadcrumbs-item shadow current path"] = 
`<a
  href="/foo"
  part="link"
>
  <slot name="prefix">
  </slot>
  <span part="label">
    <slot>
    </slot>
  </span>
</a>
`;
/* end snapshot vaadin-breadcrumbs-item shadow current path */

snapshots["vaadin-breadcrumbs-item host disabled"] = 
`<vaadin-breadcrumbs-item
  aria-disabled="true"
  disabled=""
  role="listitem"
>
</vaadin-breadcrumbs-item>
`;
/* end snapshot vaadin-breadcrumbs-item host disabled */

