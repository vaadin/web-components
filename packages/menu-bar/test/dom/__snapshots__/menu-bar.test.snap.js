/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["menu-bar basic"] = 
`<vaadin-menu-bar role="menubar">
  <vaadin-menu-bar-button
    class="home"
    first-visible=""
    role="menuitem"
    tabindex="0"
  >
    Home
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    role="menuitem"
    tabindex="-1"
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
    class="help"
    last-visible=""
    role="menuitem"
    tabindex="-1"
  >
    <vaadin-menu-bar-item aria-selected="false">
      <strong>
        Help
      </strong>
    </vaadin-menu-bar-item>
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    aria-label="More options"
    hidden=""
    role="menuitem"
    slot="overflow"
    tabindex="-1"
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
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-menu-bar-list-box
    aria-orientation="vertical"
    role="menu"
  >
    <vaadin-menu-bar-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="0"
    >
      View Reports
    </vaadin-menu-bar-item>
    <vaadin-menu-bar-item
      aria-haspopup="false"
      aria-selected="false"
      class="generate reports"
      role="menuitem"
      tabindex="-1"
    >
      Generate Report
    </vaadin-menu-bar-item>
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
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-menu-bar-list-box
    aria-orientation="vertical"
    role="menu"
  >
    <vaadin-menu-bar-item
      aria-haspopup="false"
      aria-selected="false"
      role="menuitem"
      tabindex="0"
    >
      View Reports
    </vaadin-menu-bar-item>
    <vaadin-menu-bar-item
      aria-haspopup="false"
      aria-selected="false"
      class="generate reports"
      role="menuitem"
      tabindex="-1"
    >
      Generate Report
    </vaadin-menu-bar-item>
  </vaadin-menu-bar-list-box>
  <vaadin-menu-bar-submenu hidden="">
  </vaadin-menu-bar-submenu>
</vaadin-menu-bar-overlay>
`;
/* end snapshot menu-bar overlay class */

