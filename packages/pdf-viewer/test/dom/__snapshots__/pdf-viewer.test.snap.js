/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-0"
    aria-disabled="true"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-navigation"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-1"
    aria-disabled="true"
    disabled=""
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-navigation"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    aria-disabled="true"
    disabled=""
    max="1"
    min="1"
    slot="toolbar-navigation"
    style="--_page-digits:1;"
    theme="align-right"
  >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-5"
    aria-disabled="true"
    disabled=""
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-select
    aria-disabled="true"
    disabled=""
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
  >
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-11"
    aria-disabled="true"
    disabled=""
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host default */

snapshots["vaadin-pdf-viewer host document"] = 
`<vaadin-pdf-viewer>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-0"
    aria-disabled="true"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-navigation"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-1"
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-navigation"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    has-value=""
    max="6"
    min="1"
    slot="toolbar-navigation"
    style="--_page-digits:1;"
    theme="align-right"
  >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-5"
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-select
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
  >
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-11"
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    style="--_vaadin-button-disabled-pointer-events: auto;"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host document */

snapshots["vaadin-pdf-viewer shadow default"] = 
`<div class="top-area">
  <div part="toolbar">
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div
      class="actions"
      part="toolbar-group"
    >
      <slot name="toolbar-actions">
      </slot>
    </div>
  </div>
</div>
<div part="loader">
</div>
<div class="content-area">
  <div
    id="content"
    part="content"
    tabindex="-1"
  >
    <div id="pages">
    </div>
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow default */

snapshots["vaadin-pdf-viewer shadow document"] = 
`<div class="top-area">
  <div part="toolbar">
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div
      class="actions"
      part="toolbar-group"
    >
      <slot name="toolbar-actions">
      </slot>
    </div>
  </div>
</div>
<div part="loader">
</div>
<div class="content-area">
  <div
    id="content"
    part="content"
    tabindex="0"
  >
    <div id="pages">
      <div part="page">
        <canvas aria-hidden="true">
        </canvas>
      </div>
      <div part="page">
        <canvas aria-hidden="true">
        </canvas>
      </div>
      <div part="page">
      </div>
      <div part="page">
      </div>
      <div part="page">
      </div>
      <div part="page">
      </div>
    </div>
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow document */

