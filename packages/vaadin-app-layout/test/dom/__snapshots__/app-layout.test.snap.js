/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-app-layout default"] = 
`<div
  hidden=""
  id="navbarTop"
  part="navbar"
>
  <slot name="navbar">
  </slot>
</div>
<div part="backdrop">
</div>
<div
  aria-label="drawer"
  aria-modal="true"
  hidden=""
  id="drawer"
  part="drawer"
  role="dialog"
>
  <slot
    id="drawerSlot"
    name="drawer"
  >
  </slot>
</div>
<div content="">
  <slot>
  </slot>
</div>
<div
  bottom=""
  hidden=""
  id="navbarBottom"
  part="navbar"
>
  <slot name="navbar-bottom">
  </slot>
</div>
<div hidden="">
  <slot
    id="touchSlot"
    name="navbar touch-optimized"
  >
  </slot>
</div>
`;
/* end snapshot vaadin-app-layout default */

snapshots["vaadin-app-layout navbar"] = 
`<div
  id="navbarTop"
  part="navbar"
>
  <slot name="navbar">
  </slot>
</div>
<div part="backdrop">
</div>
<div
  aria-label="drawer"
  aria-modal="true"
  hidden=""
  id="drawer"
  part="drawer"
  role="dialog"
>
  <slot
    id="drawerSlot"
    name="drawer"
  >
  </slot>
</div>
<div content="">
  <slot>
  </slot>
</div>
<div
  bottom=""
  hidden=""
  id="navbarBottom"
  part="navbar"
>
  <slot name="navbar-bottom">
  </slot>
</div>
<div hidden="">
  <slot
    id="touchSlot"
    name="navbar touch-optimized"
  >
  </slot>
</div>
`;
/* end snapshot vaadin-app-layout navbar */

snapshots["vaadin-app-layout drawer"] = 
`<div
  hidden=""
  id="navbarTop"
  part="navbar"
>
  <slot name="navbar">
  </slot>
</div>
<div part="backdrop">
</div>
<div
  aria-label="drawer"
  aria-modal="true"
  id="drawer"
  part="drawer"
  role="dialog"
  tabindex="0"
>
  <slot
    id="drawerSlot"
    name="drawer"
  >
  </slot>
</div>
<div content="">
  <slot>
  </slot>
</div>
<div
  bottom=""
  hidden=""
  id="navbarBottom"
  part="navbar"
>
  <slot name="navbar-bottom">
  </slot>
</div>
<div hidden="">
  <slot
    id="touchSlot"
    name="navbar touch-optimized"
  >
  </slot>
</div>
`;
/* end snapshot vaadin-app-layout drawer */

