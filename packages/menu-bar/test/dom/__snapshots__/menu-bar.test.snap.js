/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["menu-bar host"] = 
`<vaadin-menu-bar role="menubar">
</vaadin-menu-bar>
`;
/* end snapshot menu-bar host */

snapshots["menu-bar shadow"] = 
`<div part="container">
  <vaadin-menu-bar-button
    part="menu-bar-button"
    role="menuitem"
    tabindex="0"
  >
    Home
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-expanded="false"
    aria-haspopup="true"
    part="menu-bar-button"
    role="menuitem"
    tabindex="0"
  >
    Reports
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    aria-disabled="true"
    disabled=""
    part="menu-bar-button"
    role="menuitem"
    tabindex="-1"
  >
    Dashboard
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    part="menu-bar-button"
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
    part="overflow-button"
    role="menuitem"
    tabindex="0"
  >
    <div class="dots">
    </div>
  </vaadin-menu-bar-button>
</div>
<vaadin-menu-bar-submenu is-root="">
</vaadin-menu-bar-submenu>
<slot name="tooltip">
</slot>
`;
/* end snapshot menu-bar shadow */

snapshots["menu-bar overlay"] = 
`<vaadin-context-menu-overlay
  dir="ltr"
  id="overlay"
  opened=""
  right-aligned=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-context-menu-list-box
    aria-orientation="vertical"
    class="vaadin-menu-list-box"
    role="list"
  >
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      class="vaadin-menu-item"
      role="menuitem"
      tabindex="0"
    >
      View Reports
    </vaadin-context-menu-item>
    <vaadin-context-menu-item
      aria-haspopup="false"
      aria-selected="false"
      class="vaadin-menu-item"
      role="menuitem"
      tabindex="-1"
    >
      Generate Report
    </vaadin-context-menu-item>
  </vaadin-context-menu-list-box>
  <vaadin-menu-bar-submenu hidden="">
  </vaadin-menu-bar-submenu>
</vaadin-context-menu-overlay>
`;
/* end snapshot menu-bar overlay */

