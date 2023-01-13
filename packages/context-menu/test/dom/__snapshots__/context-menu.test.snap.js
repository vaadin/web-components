/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["context-menu items"] = 
`<vaadin-context-menu-overlay
  dir="ltr"
  id="overlay"
  opened=""
>
  <vaadin-context-menu-list-box
    aria-orientation="vertical"
    role="menu"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      focus-ring=""
      focused=""
      role="menuitem"
      tabindex="0"
    >
      Menu Item 1
    </vaadin-context-menu-item>
    <hr
      aria-haspopup="false"
      role="separator"
    >
    <vaadin-context-menu-item
      aria-expanded="false"
      aria-haspopup="true"
      aria-selected="false"
      role="menuitem"
      tabindex="-1"
    >
      Menu Item 2
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-disabled="true"
      aria-haspopup="false"
      aria-selected="false"
      disabled=""
      role="menuitem"
      tabindex="-1"
    >
      Menu Item 3
    </vaadin-context-menu-item>
  </vaadin-context-menu-list-box>
  <vaadin-context-menu hidden="">
  </vaadin-context-menu>
</vaadin-context-menu-overlay>
`;
/* end snapshot context-menu items */

snapshots["context-menu items nested"] = 
`<vaadin-context-menu-overlay
  dir="ltr"
  id="overlay"
  modeless=""
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-context-menu-list-box
    aria-orientation="vertical"
    role="menu"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="0"
    >
      Menu Item 2-1
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-expanded="true"
      aria-haspopup="true"
      aria-selected="false"
      expanded=""
      role="menuitem"
      tabindex="-1"
    >
      Menu Item 2-2
    </vaadin-context-menu-item>
  </vaadin-context-menu-list-box>
  <vaadin-context-menu hidden="">
  </vaadin-context-menu>
</vaadin-context-menu-overlay>
`;
/* end snapshot context-menu items nested */

snapshots["context-menu items overlay class"] = 
`<vaadin-context-menu-overlay
  class="context-menu-overlay custom"
  dir="ltr"
  id="overlay"
  opened=""
>
  <vaadin-context-menu-list-box
    aria-orientation="vertical"
    role="menu"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      focus-ring=""
      focused=""
      role="menuitem"
      tabindex="0"
    >
      Menu Item 1
    </vaadin-context-menu-item>
    <hr
      aria-haspopup="false"
      role="separator"
    >
    <vaadin-context-menu-item
      aria-expanded="false"
      aria-haspopup="true"
      aria-selected="false"
      role="menuitem"
      tabindex="-1"
    >
      Menu Item 2
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-disabled="true"
      aria-haspopup="false"
      aria-selected="false"
      disabled=""
      role="menuitem"
      tabindex="-1"
    >
      Menu Item 3
    </vaadin-context-menu-item>
  </vaadin-context-menu-list-box>
  <vaadin-context-menu hidden="">
  </vaadin-context-menu>
</vaadin-context-menu-overlay>
`;
/* end snapshot context-menu items overlay class */

snapshots["context-menu items overlay class nested"] = 
`<vaadin-context-menu-overlay
  class="context-menu-overlay custom"
  dir="ltr"
  id="overlay"
  modeless=""
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-context-menu-list-box
    aria-orientation="vertical"
    role="menu"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="0"
    >
      Menu Item 2-1
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-expanded="true"
      aria-haspopup="true"
      aria-selected="false"
      expanded=""
      role="menuitem"
      tabindex="-1"
    >
      Menu Item 2-2
    </vaadin-context-menu-item>
  </vaadin-context-menu-list-box>
  <vaadin-context-menu hidden="">
  </vaadin-context-menu>
</vaadin-context-menu-overlay>
`;
/* end snapshot context-menu items overlay class nested */

