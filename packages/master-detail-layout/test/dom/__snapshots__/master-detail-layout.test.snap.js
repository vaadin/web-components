/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-master-detail-layout host default"] = 
`<vaadin-master-detail-layout
  expand="both"
  orientation="horizontal"
  overlay-containment="layout"
>
  <div>
    Master content
  </div>
  <div slot="detail">
    Detail content
  </div>
  <div slot="detail-placeholder">
    Detail placeholder
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host default */

snapshots["vaadin-master-detail-layout host masterSize"] = 
`<vaadin-master-detail-layout
  expand="both"
  orientation="horizontal"
  overlay-containment="layout"
  style="--_master-size: 300px;"
>
  <div>
    Master content
  </div>
  <div slot="detail">
    Detail content
  </div>
  <div slot="detail-placeholder">
    Detail placeholder
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host masterSize */

snapshots["vaadin-master-detail-layout host detailSize"] = 
`<vaadin-master-detail-layout
  expand="both"
  orientation="horizontal"
  overlay-containment="layout"
  style="--_detail-size: 400px;"
>
  <div>
    Master content
  </div>
  <div slot="detail">
    Detail content
  </div>
  <div slot="detail-placeholder">
    Detail placeholder
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host detailSize */

snapshots["vaadin-master-detail-layout host masterSize and detailSize"] = 
`<vaadin-master-detail-layout
  expand="both"
  orientation="horizontal"
  overlay-containment="layout"
  style="--_master-size: 300px; --_detail-size: 400px;"
>
  <div>
    Master content
  </div>
  <div slot="detail">
    Detail content
  </div>
  <div slot="detail-placeholder">
    Detail placeholder
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host masterSize and detailSize */

snapshots["vaadin-master-detail-layout host no detail"] = 
`<vaadin-master-detail-layout
  expand="both"
  has-detail-placeholder=""
  orientation="horizontal"
  overlay-containment="layout"
>
  <div>
    Master content
  </div>
  <div slot="detail-placeholder">
    Detail placeholder
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host no detail */

snapshots["vaadin-master-detail-layout host no detail placeholder"] = 
`<vaadin-master-detail-layout
  expand="both"
  has-detail=""
  orientation="horizontal"
  overlay-containment="layout"
>
  <div>
    Master content
  </div>
  <div slot="detail">
    Detail content
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host no detail placeholder */

snapshots["vaadin-master-detail-layout shadow default"] = 
`<div part="backdrop">
</div>
<div
  id="master"
  part="master"
>
  <slot>
  </slot>
</div>
<div
  hidden=""
  id="outgoing"
  inert=""
>
  <slot name="detail-outgoing">
  </slot>
</div>
<div
  id="detail"
  part="detail"
>
  <slot name="detail">
  </slot>
</div>
<div
  id="detail-placeholder"
  part="detail-placeholder"
>
  <slot name="detail-placeholder">
  </slot>
</div>
`;
/* end snapshot vaadin-master-detail-layout shadow default */

snapshots["vaadin-master-detail-layout overflow default"] = 
`<vaadin-master-detail-layout
  detail-size="300px"
  expand="both"
  master-size="300px"
  orientation="horizontal"
  overlay-containment="layout"
  style="width: 400px; --_master-size: 300px; --_detail-size: 300px;"
>
  <div>
    Master content
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout overflow default */

snapshots["vaadin-master-detail-layout overflow with detail"] = 
`<vaadin-master-detail-layout
  detail-size="300px"
  expand="both"
  has-detail=""
  keep-detail-column-offscreen=""
  master-size="300px"
  orientation="horizontal"
  overflow=""
  overlay-containment="layout"
  style="width: 400px; --_master-size: 300px; --_detail-size: 300px;"
>
  <div>
    Master content
  </div>
  <div slot="detail">
    Detail content
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout overflow with detail */

snapshots["vaadin-master-detail-layout overflow with detail placeholder"] = 
`<vaadin-master-detail-layout
  detail-size="300px"
  expand="both"
  has-detail-placeholder=""
  master-size="300px"
  orientation="horizontal"
  overflow=""
  overlay-containment="layout"
  style="width: 400px; --_master-size: 300px; --_detail-size: 300px;"
>
  <div>
    Master content
  </div>
  <div slot="detail-placeholder">
    Detail placeholder
  </div>
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout overflow with detail placeholder */

