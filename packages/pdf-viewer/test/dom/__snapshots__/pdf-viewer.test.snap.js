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
      for="input-vaadin-integer-field-12"
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
      id="input-vaadin-integer-field-12"
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
      for="input-vaadin-integer-field-12"
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
      id="input-vaadin-integer-field-12"
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
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 1
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker1.
          </span>
          <div class="end-of-content">
          </div>
        </div>
      </div>
      <div part="page">
        <canvas aria-hidden="true">
        </canvas>
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 2
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker2.
          </span>
          <div class="end-of-content">
          </div>
        </div>
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
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 1
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker1.
          </span>
          <div class="end-of-content">
          </div>
        </div>
      </div>
      <div part="page">
        <canvas aria-hidden="true">
        </canvas>
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 2
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker2.
          </span>
          <div class="end-of-content">
          </div>
        </div>
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
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 1
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker1.
          </span>
          <div class="end-of-content">
          </div>
        </div>
      </div>
      <div part="page">
        <canvas aria-hidden="true">
        </canvas>
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 2
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker2.
          </span>
          <div class="end-of-content">
          </div>
        </div>
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
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 1
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker1.
          </span>
          <div class="end-of-content">
          </div>
        </div>
      </div>
      <div part="page">
        <canvas aria-hidden="true">
        </canvas>
        <div
          class="text-layer"
          data-main-rotation="0"
        >
          <span
            dir="ltr"
            role="presentation"
          >
            Page 2
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz,
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            judge my vow.
          </span>
          <br role="presentation">
          <span
            dir="ltr"
            role="presentation"
          >
            Unique word on this page: marker2.
          </span>
          <div class="end-of-content">
          </div>
        </div>
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

snapshots["vaadin-pdf-viewer page tagged"] = 
`<div part="page">
  <canvas aria-hidden="true">
  </canvas>
  <div
    class="text-layer"
    data-main-rotation="0"
  >
    <span
      class="markedContent"
      id="p2R_mc0"
    >
    </span>
    <span
      class="markedContent"
      id="p2R_mc1"
    >
      <span
        dir="ltr"
        role="presentation"
      >
        Tagged document
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc2"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        Visit the
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc3"
    >
      <span
        dir="ltr"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        role="presentation"
      >
        Vaadin website
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc4"
    >
      <span
        dir="ltr"
        role="presentation"
      >
        .
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc5"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        Hej världen
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc6"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        A list
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc7"
    >
    </span>
    <span
      class="markedContent"
      id="p2R_mc8"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        First item
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc9"
    >
    </span>
    <span
      class="markedContent"
      id="p2R_mc10"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        Second item
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc11"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        A table
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc12"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        Name
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc13"
    >
      <span
        dir="ltr"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        role="presentation"
      >
        Value
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc14"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        Alpha
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc15"
    >
      <span
        dir="ltr"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        role="presentation"
      >
        1
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc16"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        Beta
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc17"
    >
      <span
        dir="ltr"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        role="presentation"
      >
        2
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc18"
    >
      <br role="presentation">
      <span
        dir="ltr"
        role="presentation"
      >
        A figure
      </span>
    </span>
    <span
      class="markedContent"
      id="p2R_mc19"
    >
    </span>
    <div class="end-of-content">
    </div>
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer page tagged */

