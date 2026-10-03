/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dropdown-menu host default"] = 
`<vaadin-dropdown-menu label="Actions">
  <vaadin-dropdown-menu-button
    aria-expanded="false"
    aria-haspopup="menu"
    id="button-vaadin-dropdown-menu-0"
    role="button"
    slot="button"
    tabindex="0"
  >
    Actions
  </vaadin-dropdown-menu-button>
</vaadin-dropdown-menu>
`;
/* end snapshot vaadin-dropdown-menu host default */

snapshots["vaadin-dropdown-menu host disabled"] = 
`<vaadin-dropdown-menu
  disabled=""
  label="Actions"
>
  <vaadin-dropdown-menu-button
    aria-disabled="true"
    aria-expanded="false"
    aria-haspopup="menu"
    disabled=""
    id="button-vaadin-dropdown-menu-0"
    role="button"
    slot="button"
    tabindex="-1"
  >
    Actions
  </vaadin-dropdown-menu-button>
</vaadin-dropdown-menu>
`;
/* end snapshot vaadin-dropdown-menu host disabled */

snapshots["vaadin-dropdown-menu host opened with items"] = 
`<vaadin-dropdown-menu
  label="Actions"
  opened=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-dropdown-menu-button
    active=""
    aria-controls="vaadin-dropdown-menu-list-box-1"
    aria-expanded="true"
    aria-haspopup="menu"
    expanded=""
    id="button-vaadin-dropdown-menu-0"
    role="button"
    slot="button"
    tabindex="0"
  >
    Actions
  </vaadin-dropdown-menu-button>
  <div slot="overlay">
    <vaadin-context-menu-list-box
      aria-labelledby="button-vaadin-dropdown-menu-0"
      aria-orientation="vertical"
      id="vaadin-dropdown-menu-list-box-1"
      role="menu"
    >
      <vaadin-context-menu-item
        aria-haspopup="false"
        aria-selected="false"
        focused=""
        role="menuitem"
        tabindex="0"
      >
        Item 1
      </vaadin-context-menu-item>
      <hr role="separator">
      <vaadin-context-menu-item
        aria-disabled="true"
        aria-haspopup="false"
        aria-selected="false"
        disabled=""
        role="menuitem"
        tabindex="-1"
      >
        Item 2
      </vaadin-context-menu-item>
    </vaadin-context-menu-list-box>
  </div>
  <vaadin-dropdown-menu-submenu
    modeless=""
    slot="submenu"
  >
  </vaadin-dropdown-menu-submenu>
</vaadin-dropdown-menu>
`;
/* end snapshot vaadin-dropdown-menu host opened with items */

snapshots["vaadin-dropdown-menu shadow default"] = 
`<vaadin-dropdown-menu-overlay
  exportparts="backdrop, overlay, content"
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
  position="bottom-start"
>
  <slot name="overlay">
  </slot>
  <slot
    name="submenu"
    slot="submenu"
  >
  </slot>
</vaadin-dropdown-menu-overlay>
<slot name="button">
</slot>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-dropdown-menu shadow default */

snapshots["vaadin-dropdown-menu shadow disabled"] = 
`<vaadin-dropdown-menu-overlay
  exportparts="backdrop, overlay, content"
  id="overlay"
  no-vertical-overlap=""
  popover="manual"
  position="bottom-start"
>
  <slot name="overlay">
  </slot>
  <slot
    name="submenu"
    slot="submenu"
  >
  </slot>
</vaadin-dropdown-menu-overlay>
<slot name="button">
</slot>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-dropdown-menu shadow disabled */

snapshots["vaadin-dropdown-menu shadow opened"] = 
`<vaadin-dropdown-menu-overlay
  exportparts="backdrop, overlay, content"
  id="overlay"
  no-vertical-overlap=""
  opened=""
  popover="manual"
  position="bottom-start"
  start-aligned=""
  top-aligned=""
>
  <slot name="overlay">
  </slot>
  <slot
    name="submenu"
    slot="submenu"
  >
  </slot>
</vaadin-dropdown-menu-overlay>
<slot name="button">
</slot>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-dropdown-menu shadow opened */

snapshots["vaadin-dropdown-menu button default"] = 
`<div
  class="vaadin-button-container"
  role="presentation"
>
  <span
    aria-hidden="true"
    part="prefix"
  >
    <slot name="prefix">
    </slot>
  </span>
  <span part="label">
    <slot>
    </slot>
  </span>
  <span
    aria-hidden="true"
    part="suffix"
  >
    <slot name="suffix">
    </slot>
  </span>
  <span
    aria-hidden="true"
    part="indicator"
  >
  </span>
</div>
`;
/* end snapshot vaadin-dropdown-menu button default */

