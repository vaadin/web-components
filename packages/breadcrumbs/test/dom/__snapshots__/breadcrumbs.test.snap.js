/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-breadcrumbs empty host default"] = 
`<vaadin-breadcrumbs role="navigation">
</vaadin-breadcrumbs>
`;
/* end snapshot vaadin-breadcrumbs empty host default */

snapshots["vaadin-breadcrumbs empty shadow default"] = 
`<div
  id="list"
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
      id="overflow"
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
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
  restore-focus-on-close=""
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumbs-overlay>
`;
/* end snapshot vaadin-breadcrumbs empty shadow default */

snapshots["vaadin-breadcrumbs empty shadow i18n"] = 
`<div
  id="list"
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
      id="overflow"
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
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
  restore-focus-on-close=""
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumbs-overlay>
`;
/* end snapshot vaadin-breadcrumbs empty shadow i18n */

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

snapshots["vaadin-breadcrumbs overflow host"] = 
`<vaadin-breadcrumbs
  has-overflow=""
  role="navigation"
  style="max-width: 140px"
>
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
    slot="overlay"
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
/* end snapshot vaadin-breadcrumbs overflow host */

snapshots["vaadin-breadcrumbs overflow shadow"] = 
`<div
  id="list"
  part="list"
  role="list"
>
  <slot name="root">
  </slot>
  <div
    part="overflow"
    role="listitem"
  >
    <button
      aria-expanded="false"
      aria-haspopup="true"
      aria-label="More items"
      id="overflow"
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
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
  restore-focus-on-close=""
>
  <slot name="overlay">
  </slot>
</vaadin-breadcrumbs-overlay>
`;
/* end snapshot vaadin-breadcrumbs overflow shadow */

snapshots["vaadin-breadcrumbs overflow overlay shadow"] = 
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
/* end snapshot vaadin-breadcrumbs overflow overlay shadow */

snapshots["vaadin-breadcrumbs overflow opened"] = 
`<vaadin-breadcrumbs
  has-overflow=""
  role="navigation"
  start-aligned=""
  style="max-width: 140px"
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
    focused=""
    path="/docs"
    role="listitem"
    slot="overlay"
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
/* end snapshot vaadin-breadcrumbs overflow opened */

