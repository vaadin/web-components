/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-slider host"] = 
`<vaadin-slider>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host */

snapshots["vaadin-slider shadow default"] = 
`<div part="track">
  <div
    part="track-fill"
    style="inset-inline-start:0;inset-inline-end:100%;"
  >
  </div>
</div>
<div
  aria-valuemax="100"
  aria-valuemin="0"
  aria-valuenow="0"
  part="thumb"
  role="slider"
  style="inset-inline-start:0%;"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-slider shadow default */

snapshots["vaadin-slider shadow value"] = 
`<div part="track">
  <div
    part="track-fill"
    style="inset-inline: 0px 50%;"
  >
  </div>
</div>
<div
  aria-valuemax="100"
  aria-valuemin="0"
  aria-valuenow="50"
  part="thumb"
  role="slider"
  style="inset-inline-start: 50%;"
  tabindex="0"
>
</div>
`;
/* end snapshot vaadin-slider shadow value */

