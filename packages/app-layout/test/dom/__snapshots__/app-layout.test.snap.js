/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-app-layout host default"] = 
`<vaadin-app-layout
  no-anim=""
  overlay=""
  primary-section="navbar"
  style="--_vaadin-app-layout-navbar-offset-size: 0px; --_vaadin-app-layout-navbar-offset-size-bottom: 0px; --_vaadin-app-layout-drawer-offset-size: 0px; --_vaadin-app-layout-drawer-width: 0;"
>
</vaadin-app-layout>
`;
/* end snapshot vaadin-app-layout host default */

snapshots["vaadin-app-layout host with drawer"] = 
`<vaadin-app-layout
  has-drawer=""
  overlay=""
  primary-section="navbar"
  style="--_vaadin-app-layout-navbar-offset-size: 0px; --_vaadin-app-layout-navbar-offset-size-bottom: 0px; --_vaadin-app-layout-drawer-offset-size: 320px;"
>
  <div slot="drawer">
    Drawer Content
  </div>
</vaadin-app-layout>
`;
/* end snapshot vaadin-app-layout host with drawer */

snapshots["vaadin-app-layout host with navbar"] = 
`<vaadin-app-layout
  has-navbar=""
  overlay=""
  primary-section="navbar"
  style="--_vaadin-app-layout-navbar-offset-size: 34px; --_vaadin-app-layout-navbar-offset-size-bottom: 0px; --_vaadin-app-layout-drawer-offset-size: 0px; --_vaadin-app-layout-drawer-width: 0;"
>
  <div slot="navbar">
    Navbar Content
  </div>
</vaadin-app-layout>
`;
/* end snapshot vaadin-app-layout host with navbar */

snapshots["vaadin-app-layout shadow desktop layout default"] = 
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
  id="drawer"
  part="drawer"
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
/* end snapshot vaadin-app-layout shadow desktop layout default */

snapshots["vaadin-app-layout shadow desktop layout drawer closed"] = 
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
  id="drawer"
  part="drawer"
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
/* end snapshot vaadin-app-layout shadow desktop layout drawer closed */

snapshots["vaadin-app-layout shadow mobile layout default"] = 
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
  aria-label="Drawer"
  aria-modal="true"
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
/* end snapshot vaadin-app-layout shadow mobile layout default */

snapshots["vaadin-app-layout shadow mobile layout drawer opened"] = 
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
  aria-label="Drawer"
  aria-modal="true"
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
/* end snapshot vaadin-app-layout shadow mobile layout drawer opened */

