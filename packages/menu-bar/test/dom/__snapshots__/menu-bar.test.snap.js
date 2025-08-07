/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["menu-bar basic"] = 
`<vaadin-menu-bar role="menubar">
  <vaadin-menu-bar-submenu
    is-root=""
    slot="submenu"
  >
    <div
      slot="overlay"
      style="display: contents;"
    >
    </div>
  </vaadin-menu-bar-submenu>
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
    class="help"
    last-visible=""
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

snapshots["menu-bar opened"] = 
`<vaadin-menu-bar
  role="menubar"
  style="pointer-events: auto;"
>
  <vaadin-menu-bar-submenu
    is-root=""
    opened=""
    slot="submenu"
    start-aligned=""
    top-aligned=""
  >
    <div
      slot="overlay"
      style="display: contents;"
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
    </div>
    <vaadin-menu-bar-submenu
      modeless=""
      slot="submenu"
    >
    </vaadin-menu-bar-submenu>
  </vaadin-menu-bar-submenu>
  <vaadin-menu-bar-button
    class="home"
    first-visible=""
    role="menuitem"
    tabindex="0"
  >
    Home
  </vaadin-menu-bar-button>
  <vaadin-menu-bar-button
    active=""
    aria-expanded="true"
    aria-haspopup="true"
    expanded=""
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
    class="help"
    last-visible=""
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
/* end snapshot menu-bar opened */

snapshots["menu-bar overlay"] = 
`<vaadin-menu-bar-overlay
  exportparts="backdrop, overlay, content"
  id="overlay"
  opened=""
  popover="manual"
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
</vaadin-menu-bar-overlay>
`;
/* end snapshot menu-bar overlay */

