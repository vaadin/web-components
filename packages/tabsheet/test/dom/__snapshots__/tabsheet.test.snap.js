/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-tabsheet host default"] = 
`<vaadin-tabsheet
  orientation="horizontal"
  selected="0"
>
  <div slot="prefix">
    Prefix
  </div>
  <div slot="suffix">
    Suffix
  </div>
  <vaadin-tabs
    aria-orientation="horizontal"
    orientation="horizontal"
    role="tablist"
    selected="0"
    slot="tabs"
  >
    <vaadin-tab
      aria-controls="tabsheet-panel-1"
      aria-selected="true"
      id="tab-1"
      orientation="horizontal"
      role="tab"
      selected=""
      tabindex="0"
    >
      Tab 1
    </vaadin-tab>
    <vaadin-tab
      aria-controls="tabsheet-panel-2"
      aria-selected="false"
      id="tab-2"
      orientation="horizontal"
      role="tab"
      tabindex="-1"
    >
      Tab 2
    </vaadin-tab>
    <vaadin-tab
      aria-controls="tabsheet-panel-3"
      aria-selected="false"
      id="tab-3"
      orientation="horizontal"
      role="tab"
      tabindex="-1"
    >
      Tab 3
    </vaadin-tab>
  </vaadin-tabs>
  <div
    aria-labelledby="tab-1"
    id="tabsheet-panel-1"
    role="tabpanel"
    tab="tab-1"
  >
  </div>
  <div
    aria-labelledby="tab-2"
    hidden=""
    id="tabsheet-panel-2"
    role="tabpanel"
    tab="tab-2"
  >
  </div>
  <div
    aria-labelledby="tab-3"
    hidden=""
    id="tabsheet-panel-3"
    role="tabpanel"
    tab="tab-3"
  >
  </div>
</vaadin-tabsheet>
`;
/* end snapshot vaadin-tabsheet host default */

snapshots["vaadin-tabsheet shadow default"] = 
`<div part="tabs-container">
  <slot name="prefix">
  </slot>
  <slot name="tabs">
  </slot>
  <slot name="suffix">
  </slot>
</div>
<div part="content">
  <slot id="panel-slot">
  </slot>
</div>
`;
/* end snapshot vaadin-tabsheet shadow default */

