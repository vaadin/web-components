/* @web/test-runner snapshot v1 */
export const snapshots = {};

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
  <slot name="root">
  </slot>
  <div
    hidden=""
    part="overflow"
    role="listitem"
  >
    <button
      aria-expanded="false"
      aria-haspopup="true"
      aria-label="More items"
      part="overflow-button"
      type="button"
    >
    </button>
  </div>
  <slot>
  </slot>
</div>
<vaadin-breadcrumbs-overlay
  exportparts="overlay, content: overlay-content"
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumbs-overlay>
`;
/* end snapshot vaadin-breadcrumbs empty shadow default */

snapshots["vaadin-breadcrumbs items host all linked"] = 
`<vaadin-breadcrumbs role="navigation">
  <vaadin-breadcrumbs-item
    path="/"
    role="listitem"
    slot="root"
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
/* end snapshot vaadin-breadcrumbs items host all linked */

snapshots["vaadin-breadcrumbs items host with current"] = 
`<vaadin-breadcrumbs role="navigation">
  <vaadin-breadcrumbs-item
    path="/"
    role="listitem"
    slot="root"
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
    API
  </vaadin-breadcrumbs-item>
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs items host with current */

snapshots["vaadin-breadcrumbs empty shadow i18n"] = 
`<div
  part="list"
  role="list"
>
  <slot name="root">
  </slot>
  <div
    hidden=""
    part="overflow"
    role="listitem"
  >
    <button
      aria-expanded="false"
      aria-haspopup="true"
      aria-label="Show hidden items"
      part="overflow-button"
      type="button"
    >
    </button>
  </div>
  <slot>
  </slot>
</div>
<vaadin-breadcrumbs-overlay
  exportparts="overlay, content: overlay-content"
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumbs-overlay>
`;
/* end snapshot vaadin-breadcrumbs empty shadow i18n */

