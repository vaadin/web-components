/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumbs host default"] = 
`<vaadin-breadcrumbs>
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs host default */

snapshots["vaadin-breadcrumbs empty host default"] = 
`<vaadin-breadcrumbs role="navigation">
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs empty host default */

snapshots["vaadin-breadcrumbs empty shadow default"] = 
`<div
  part="list"
  role="list"
>
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-breadcrumbs empty shadow default */

snapshots["vaadin-breadcrumbs trail host trail"] = 
`<vaadin-breadcrumbs role="navigation">
  <vaadin-breadcrumbs-item
    path="/"
    role="listitem"
  >
    Home
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    path="/docs"
    role="listitem"
  >
    Docs
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    current=""
    role="listitem"
  >
    Current
  </vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs trail host trail */

snapshots["vaadin-breadcrumbs trail shadow trail"] = 
`<div
  part="list"
  role="list"
>
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-breadcrumbs trail shadow trail */

snapshots["vaadin-breadcrumbs trail all-linked host trail all-linked"] = 
`<vaadin-breadcrumbs role="navigation">
  <vaadin-breadcrumbs-item
    path="/"
    role="listitem"
  >
    Home
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    path="/docs"
    role="listitem"
  >
    Docs
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    path="/docs/api"
    role="listitem"
  >
    API
  </vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs trail all-linked host trail all-linked */

