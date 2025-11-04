/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-popover host"] = 
`<vaadin-popover
  id="vaadin-popover-0"
  modeless=""
  opened=""
  role="dialog"
  tabindex="0"
>
  content
</vaadin-popover>
`;
/* end snapshot vaadin-popover host */

snapshots["vaadin-popover shadow"] = 
`<vaadin-popover-overlay
  exportparts="backdrop, overlay, content, arrow"
  id="overlay"
  modeless=""
  no-vertical-overlap=""
  opened=""
  popover="manual"
  position="bottom"
>
  <slot>
  </slot>
</vaadin-popover-overlay>
`;
/* end snapshot vaadin-popover shadow */

snapshots["vaadin-popover modal host"] = 
`<vaadin-popover
  aria-modal="true"
  id="vaadin-popover-2"
  opened=""
  role="dialog"
  tabindex="0"
>
  content
</vaadin-popover>
`;
/* end snapshot vaadin-popover modal host */

snapshots["vaadin-popover modal shadow"] = 
`<vaadin-popover-overlay
  exportparts="backdrop, overlay, content, arrow"
  id="overlay"
  no-vertical-overlap=""
  opened=""
  popover="manual"
  position="bottom"
>
  <slot>
  </slot>
</vaadin-popover-overlay>
`;
/* end snapshot vaadin-popover modal shadow */

snapshots["vaadin-popover theme"] = 
`<vaadin-popover-overlay
  exportparts="backdrop, overlay, content, arrow"
  id="overlay"
  modeless=""
  no-vertical-overlap=""
  opened=""
  popover="manual"
  position="bottom"
  theme="arrow"
>
  <slot>
  </slot>
</vaadin-popover-overlay>
`;
/* end snapshot vaadin-popover theme */

snapshots["vaadin-popover overlay"] = 
`<div
  hidden=""
  id="backdrop"
  part="backdrop"
>
</div>
<div
  id="overlay"
  part="overlay"
>
  <div part="arrow">
  </div>
  <div
    id="content"
    part="content"
  >
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-popover overlay */

snapshots["vaadin-popover backdrop"] = 
`<div
  id="backdrop"
  part="backdrop"
>
</div>
<div
  id="overlay"
  part="overlay"
>
  <div part="arrow">
  </div>
  <div
    id="content"
    part="content"
  >
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-popover backdrop */

