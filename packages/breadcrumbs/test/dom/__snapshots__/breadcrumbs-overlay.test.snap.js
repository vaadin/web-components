/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumbs-overlay shadow default"] = 
`<div
  id="overlay"
  part="overlay"
>
  <div
    id="content"
    part="content"
    role="list"
  >
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-breadcrumbs-overlay shadow default */

snapshots["vaadin-breadcrumbs-overlay opened host"] = 
`<vaadin-breadcrumbs
  has-overflow=""
  role="navigation"
  start-aligned=""
  top-aligned=""
>
  <vaadin-breadcrumbs-item
    path="/"
    role="listitem"
    slot="root"
  >
    Home
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    focus-ring=""
    focused=""
    path="/a"
    role="listitem"
    slot="overlay"
  >
    Alpha section
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    path="/a/b"
    role="listitem"
    slot="overlay"
  >
    Beta section
  </vaadin-breadcrumbs-item>
  <vaadin-breadcrumbs-item
    current=""
    role="listitem"
  >
    Current page
  </vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs-overlay opened host */

