/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumb host default"] = 
`<vaadin-breadcrumb role="navigation">
  <vaadin-breadcrumb-item
    has-path=""
    path="/"
    role="listitem"
  >
    Home
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item
    has-path=""
    path="/products"
    role="listitem"
  >
    Products
  </vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item
    aria-current="page"
    role="listitem"
  >
    Current Page
  </vaadin-breadcrumb-item>
</vaadin-breadcrumb>
`;
/* end snapshot vaadin-breadcrumb host default */

snapshots["vaadin-breadcrumb shadow default"] = 
`<ol part="list">
  <slot>
  </slot>
</ol>
`;
/* end snapshot vaadin-breadcrumb shadow default */

snapshots["vaadin-breadcrumb-item with path host default"] = 
`<vaadin-breadcrumb-item
  has-path=""
  path="/products"
  role="listitem"
>
  Products
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item with path host default */

snapshots["vaadin-breadcrumb-item with path host disabled"] = 
`<vaadin-breadcrumb-item
  aria-disabled="true"
  disabled=""
  has-path=""
  path="/products"
  role="listitem"
>
  Products
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item with path host disabled */

snapshots["vaadin-breadcrumb-item without path host default"] = 
`<vaadin-breadcrumb-item role="listitem">
  Current Page
</vaadin-breadcrumb-item>
`;
/* end snapshot vaadin-breadcrumb-item without path host default */

snapshots["vaadin-breadcrumb-item with path shadow default"] = 
`<slot name="prefix">
</slot>
<a
  aria-disabled="false"
  href="/products"
  part="link"
>
  <slot>
  </slot>
</a>
`;
/* end snapshot vaadin-breadcrumb-item with path shadow default */

snapshots["vaadin-breadcrumb-item without path shadow default"] = 
`<slot name="prefix">
</slot>
<span part="link">
  <slot>
  </slot>
</span>
`;
/* end snapshot vaadin-breadcrumb-item without path shadow default */

