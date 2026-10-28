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
    <span slot="suffix">
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-2"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-4"
      slot="error-message"
    >
    </div>
    <input
      disabled=""
      id="input-vaadin-integer-field-13"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
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
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-12"
    aria-disabled="true"
    disabled=""
    has-tooltip=""
    icon="download"
    role="button"
    slot="toolbar-default-actions"
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
    <span slot="suffix">
      / 6
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-2"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-4"
      slot="error-message"
    >
    </div>
    <input
      id="input-vaadin-integer-field-13"
      max="6"
      min="1"
      slot="input"
      step="any"
      tabindex="0"
      type="number"
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
  <vaadin-pdf-viewer-button
    aria-describedby="vaadin-tooltip-12"
    has-tooltip=""
    icon="download"
    role="button"
    slot="toolbar-default-actions"
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
  <button
    aria-controls="toolbar"
    aria-expanded="true"
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="PDF document"
    >
      PDF document
    </span>
    <span part="header-toggle">
    </span>
  </button>
  <div
    id="toolbar"
    part="toolbar"
  >
    <div part="toolbar-group">
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-actions">
      </slot>
      <slot name="toolbar-default-actions">
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
  <button
    aria-controls="toolbar"
    aria-expanded="true"
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="multi-page.pdf"
    >
      multi-page.pdf
    </span>
    <span part="header-toggle">
    </span>
  </button>
  <div
    id="toolbar"
    part="toolbar"
  >
    <div part="toolbar-group">
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-actions">
      </slot>
      <slot name="toolbar-default-actions">
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

snapshots["vaadin-pdf-viewer shadow header title"] = 
`<div class="top-area">
  <button
    aria-controls="toolbar"
    aria-expanded="true"
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="Annual report"
    >
      Annual report
    </span>
    <span part="header-toggle">
    </span>
  </button>
  <div
    id="toolbar"
    part="toolbar"
  >
    <div part="toolbar-group">
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-actions">
      </slot>
      <slot name="toolbar-default-actions">
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
/* end snapshot vaadin-pdf-viewer shadow header title */

snapshots["vaadin-pdf-viewer shadow header hidden"] = 
`<div class="top-area">
  <button
    aria-controls="toolbar"
    aria-expanded="true"
    hidden=""
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="multi-page.pdf"
    >
      multi-page.pdf
    </span>
    <span part="header-toggle">
    </span>
  </button>
  <div
    id="toolbar"
    part="toolbar"
  >
    <div part="toolbar-group">
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-actions">
      </slot>
      <slot name="toolbar-default-actions">
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
/* end snapshot vaadin-pdf-viewer shadow header hidden */

snapshots["vaadin-pdf-viewer shadow toolbar collapsed"] = 
`<div class="top-area">
  <button
    aria-controls="toolbar"
    aria-expanded="false"
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="multi-page.pdf"
    >
      multi-page.pdf
    </span>
    <span part="header-toggle">
    </span>
  </button>
  <div
    hidden=""
    id="toolbar"
    part="toolbar"
  >
    <div part="toolbar-group">
      <slot name="toolbar-navigation">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-zoom">
      </slot>
    </div>
    <div part="toolbar-group">
      <slot name="toolbar-actions">
      </slot>
      <slot name="toolbar-default-actions">
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
/* end snapshot vaadin-pdf-viewer shadow toolbar collapsed */

