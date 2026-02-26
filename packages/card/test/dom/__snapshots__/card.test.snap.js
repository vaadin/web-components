/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-card host default"] = 
`<vaadin-card role="region">
</vaadin-card>
`;
/* end snapshot vaadin-card host default */

snapshots["vaadin-card host card-title"] = 
`<vaadin-card
  _t=""
  aria-labelledby="card-title-0"
  role="region"
>
  <div
    aria-level="2"
    card-string-title=""
    id="card-title-0"
    role="heading"
    slot="title"
  >
    Title
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host card-title */

snapshots["vaadin-card host media"] = 
`<vaadin-card
  _m=""
  role="region"
>
  <img slot="media">
</vaadin-card>
`;
/* end snapshot vaadin-card host media */

snapshots["vaadin-card host header"] = 
`<vaadin-card
  _h=""
  role="region"
>
  <div slot="header">
    Header
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host header */

snapshots["vaadin-card host title"] = 
`<vaadin-card
  _t=""
  role="region"
>
  <div slot="title">
    Title
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host title */

snapshots["vaadin-card host subtitle"] = 
`<vaadin-card
  _st=""
  role="region"
>
  <div slot="subtitle">
    Subtitle
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host subtitle */

snapshots["vaadin-card host title and header"] = 
`<vaadin-card
  _h=""
  role="region"
>
  <div slot="title">
    Title
  </div>
  <div slot="header">
    Header
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host title and header */

snapshots["vaadin-card host subtitle and header"] = 
`<vaadin-card
  _h=""
  role="region"
>
  <div slot="subtitle">
    Subtitle
  </div>
  <div slot="header">
    Header
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host subtitle and header */

snapshots["vaadin-card host header-prefix"] = 
`<vaadin-card
  _hp=""
  role="region"
>
  <div slot="header-prefix">
    Prefix
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host header-prefix */

snapshots["vaadin-card host header-suffix"] = 
`<vaadin-card
  _hs=""
  role="region"
>
  <div slot="header-suffix">
    Suffix
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host header-suffix */

snapshots["vaadin-card host content"] = 
`<vaadin-card
  _c=""
  role="region"
>
  <div>
    Content
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host content */

snapshots["vaadin-card host footer"] = 
`<vaadin-card
  _f=""
  role="region"
>
  <div slot="footer">
    Footer
  </div>
</vaadin-card>
`;
/* end snapshot vaadin-card host footer */

snapshots["vaadin-card shadow default"] = 
`<div part="media">
  <slot name="media">
  </slot>
</div>
<div part="header">
  <slot name="header-prefix">
  </slot>
  <slot name="header">
    <slot name="title">
    </slot>
    <slot name="subtitle">
    </slot>
  </slot>
  <slot name="header-suffix">
  </slot>
</div>
<div part="content">
  <slot>
  </slot>
</div>
<div part="footer">
  <slot name="footer">
  </slot>
</div>
`;
/* end snapshot vaadin-card shadow default */

