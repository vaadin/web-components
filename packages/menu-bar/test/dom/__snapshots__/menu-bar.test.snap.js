/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["menu-bar basic"] = 
`<vaadin-menu-bar role="menubar">
  <vaadin-menu-bar-button
    role="menuitem"
    tabindex="0"
  >
    Home
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    role="menuitem"
    tabindex="0"
  >
    Reports
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-disabled="true"
    disabled=""
    role="menuitem"
    tabindex="-1"
  >
    Dashboard
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    role="menuitem"
    tabindex="0"
  >
    <vaadin-context-menu-item
      aria-selected="false"
      theme="menu-bar-item"
    >
      <strong>
        Help
      </strong>
    </vaadin-context-menu-item>
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    aria-label="More options"
    hidden=""
    role="menuitem"
    slot="overflow"
    tabindex="0"
  >
    <div aria-hidden="true">
      ···
    </div>
  </vaadin-menu-bar-button>
</vaadin-menu-bar>
`;
/* end snapshot menu-bar basic */

snapshots["menu-bar overlay"] = 
`<vaadin-menu-bar-overlay
  dir="ltr"
  id="overlay"
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-menu-bar-list-box
    aria-orientation="vertical"
    role="list"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="0"
    >
      View Reports
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="-1"
    >
      Generate Report
    </vaadin-context-menu-item>
  </vaadin-menu-bar-list-box>
  <vaadin-menu-bar-submenu hidden="">
  </vaadin-menu-bar-submenu>
</vaadin-menu-bar-overlay>
`;
/* end snapshot menu-bar overlay */

snapshots["menu-bar overlay class"] = 
`<vaadin-menu-bar-overlay
  class="custom menu-bar-overlay"
  dir="ltr"
  id="overlay"
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-menu-bar-list-box
    aria-orientation="vertical"
    role="list"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="0"
    >
      View Reports
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="-1"
    >
      Generate Report
    </vaadin-context-menu-item>
  </vaadin-menu-bar-list-box>
  <vaadin-menu-bar-submenu hidden="">
  </vaadin-menu-bar-submenu>
</vaadin-menu-bar-overlay>
`;
/* end snapshot menu-bar overlay class */

