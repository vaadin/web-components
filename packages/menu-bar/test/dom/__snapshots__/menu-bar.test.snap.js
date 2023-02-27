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
    <vaadin-menu-bar-item aria-selected="false">
      <strong>
        Help
      </strong>
    </vaadin-menu-bar-item>
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    role="menuitem"
    tabindex="0"
  >
    <vaadin-menu-bar-item aria-selected="false">
      <div>
        Share
      </div>
    </vaadin-menu-bar-item>
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
  id="overlay"
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

snapshots["menu-bar overflow"] = 
`<vaadin-menu-bar
  role="menubar"
  style="pointer-events: auto;"
>
  <vaadin-menu-bar-button
    role="menuitem"
    style="width: 39.1094px;"
    tabindex="0"
  >
    Home
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    role="menuitem"
    style="width: 49.7656px;"
    tabindex="0"
  >
    Reports
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-disabled="true"
    disabled=""
    role="menuitem"
    style="width: 69.3125px;"
    tabindex="-1"
  >
    Dashboard
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    role="menuitem"
    style="width: 32.875px;"
    tabindex="0"
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
    role="menuitem"
    style="width: 36.4375px;"
    tabindex="0"
  >
    <vaadin-menu-bar-item aria-selected="false">
      Share
    </vaadin-menu-bar-item>
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    active=""
    aria-expanded="true"
    aria-haspopup="true"
    aria-label="More options"
    expanded=""
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
/* end snapshot menu-bar overflow */

