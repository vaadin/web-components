/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-split-layout default"] = 
`<slot
  id="primary"
  name="primary"
>
</slot>
<div
  id="splitter"
  part="splitter"
  style="touch-action: none;"
>
  <div part="handle">
  </div>
</div>
<slot
  id="secondary"
  name="secondary"
>
</slot>
`;
/* end snapshot vaadin-split-layout default */

snapshots["vaadin-split-layout slots"] = 
`<div slot="primary">
  Block one
</div>
<div slot="secondary">
  Block two
</div>
`;
/* end snapshot vaadin-split-layout slots */

