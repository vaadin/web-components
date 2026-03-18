/* @web/test-runner snapshot v1 */
export const snapshots = {};
snapshots["vaadin-master-detail-layout host default"] = 
`<vaadin-master-detail-layout
  expand="both"
  orientation="horizontal"
  overlay-containment="layout"
>
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
</vaadin-master-detail-layout>
`;
/* end snapshot vaadin-master-detail-layout host masterSize and detailSize */

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
  id="detail"
  part="detail"
>
  <slot name="detail">
  </slot>
</div>
`;
/* end snapshot vaadin-master-detail-layout shadow default */

