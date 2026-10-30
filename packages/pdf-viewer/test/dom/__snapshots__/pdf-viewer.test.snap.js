/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-labelledby="vaadin-tooltip-0"
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
    aria-disabled="true"
    aria-labelledby="vaadin-tooltip-1"
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
      for="input-vaadin-integer-field-5"
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
      aria-label="Page"
      disabled=""
      id="input-vaadin-integer-field-5"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
    >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-labelledby="vaadin-tooltip-6"
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
    aria-disabled="true"
    aria-labelledby="vaadin-tooltip-10"
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
    aria-disabled="true"
    aria-labelledby="vaadin-tooltip-12"
    disabled=""
    has-tooltip=""
    icon="download"
    role="button"
    slot="toolbar-download"
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
    aria-disabled="true"
    aria-labelledby="vaadin-tooltip-0"
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
    aria-labelledby="vaadin-tooltip-1"
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
      for="input-vaadin-integer-field-5"
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
      aria-label="Page"
      id="input-vaadin-integer-field-5"
      max="6"
      min="1"
      slot="input"
      step="any"
      tabindex="0"
      type="number"
    >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-labelledby="vaadin-tooltip-6"
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
    aria-labelledby="vaadin-tooltip-10"
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
    aria-labelledby="vaadin-tooltip-12"
    has-tooltip=""
    icon="download"
    role="button"
    slot="toolbar-download"
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
      id="title"
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
      <slot name="toolbar-download">
      </slot>
    </div>
  </div>
</div>
<div
  aria-label="Loading"
  part="loader"
  role="progressbar"
>
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-labelledby="title"
    id="content"
    part="content"
    role="region"
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
      id="title"
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
      <slot name="toolbar-download">
      </slot>
    </div>
  </div>
</div>
<div
  aria-label="Loading"
  part="loader"
  role="progressbar"
>
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-labelledby="title"
    id="content"
    part="content"
    role="region"
    tabindex="0"
  >
    <div id="pages">
      <div
        aria-label="Page 1"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 2"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 3"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 4"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 5"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 6"
        part="page"
        role="region"
      >
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
      id="title"
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
      <slot name="toolbar-download">
      </slot>
    </div>
  </div>
</div>
<div
  aria-label="Loading"
  part="loader"
  role="progressbar"
>
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-labelledby="title"
    id="content"
    part="content"
    role="region"
    tabindex="0"
  >
    <div id="pages">
      <div
        aria-label="Page 1"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 2"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 3"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 4"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 5"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 6"
        part="page"
        role="region"
      >
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
      id="title"
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
      <slot name="toolbar-download">
      </slot>
    </div>
  </div>
</div>
<div
  aria-label="Loading"
  part="loader"
  role="progressbar"
>
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-labelledby="title"
    id="content"
    part="content"
    role="region"
    tabindex="0"
  >
    <div id="pages">
      <div
        aria-label="Page 1"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 2"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 3"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 4"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 5"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 6"
        part="page"
        role="region"
      >
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
      id="title"
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
      <slot name="toolbar-download">
      </slot>
    </div>
  </div>
</div>
<div
  aria-label="Loading"
  part="loader"
  role="progressbar"
>
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-labelledby="title"
    id="content"
    part="content"
    role="region"
    tabindex="0"
  >
    <div id="pages">
      <div
        aria-label="Page 1"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 2"
        part="page"
        role="region"
      >
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
      <div
        aria-label="Page 3"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 4"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 5"
        part="page"
        role="region"
      >
      </div>
      <div
        aria-label="Page 6"
        part="page"
        role="region"
      >
      </div>
    </div>
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow toolbar collapsed */

snapshots["vaadin-pdf-viewer page tagged"] = 
`<div
  aria-label="Page 1"
  part="page"
  role="region"
>
  <canvas aria-hidden="true">
  </canvas>
  <span class="struct-tree">
    <span lang="en">
      <span
        aria-level="1"
        role="heading"
      >
        <span role="none">
          <span aria-owns="p2R_mc1_0">
          </span>
        </span>
      </span>
      <span role="paragraph">
        <span role="none">
          <span aria-owns="p2R_mc2_0">
          </span>
        </span>
        <span>
          <span
            id="pdfjs_internal_struct_1_link_1"
            role="none"
          >
            <span aria-owns="p2R_mc3_0 p2R_mc3_1">
            </span>
          </span>
          <span aria-owns="pdfjs_internal_id_11R">
          </span>
        </span>
        <span role="none">
          <span aria-owns="p2R_mc4_0">
          </span>
        </span>
      </span>
      <span
        lang="sv"
        role="paragraph"
      >
        <span role="none">
          <span aria-owns="p2R_mc5_0">
          </span>
        </span>
      </span>
      <span
        aria-level="2"
        role="heading"
      >
        <span role="none">
          <span aria-owns="p2R_mc6_0">
          </span>
        </span>
      </span>
      <span role="list">
        <span role="listitem">
          <span>
          </span>
          <span role="none">
            <span aria-owns="p2R_mc8_0">
            </span>
          </span>
        </span>
        <span role="listitem">
          <span>
          </span>
          <span role="none">
            <span aria-owns="p2R_mc10_0">
            </span>
          </span>
        </span>
      </span>
      <span
        aria-level="2"
        role="heading"
      >
        <span role="none">
          <span aria-owns="p2R_mc11_0">
          </span>
        </span>
      </span>
      <span role="table">
        <span role="row">
          <span role="columnheader">
            <span role="none">
              <span aria-owns="p2R_mc12_0">
              </span>
            </span>
          </span>
          <span role="columnheader">
            <span role="none">
              <span aria-owns="p2R_mc13_0 p2R_mc13_1">
              </span>
            </span>
          </span>
        </span>
        <span role="row">
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc14_0">
              </span>
            </span>
          </span>
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc15_0 p2R_mc15_1">
              </span>
            </span>
          </span>
        </span>
        <span role="row">
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc16_0">
              </span>
            </span>
          </span>
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc17_0 p2R_mc17_1">
              </span>
            </span>
          </span>
        </span>
      </span>
      <span
        aria-level="2"
        role="heading"
      >
        <span role="none">
          <span aria-owns="p2R_mc18_0">
          </span>
        </span>
      </span>
      <span role="figure">
        <span
          aria-label="A blue square"
          role="img"
        >
        </span>
      </span>
    </span>
  </span>
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
        id="p2R_mc1_0"
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
        id="p2R_mc2_0"
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
        id="p2R_mc3_0"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        id="p2R_mc3_1"
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
        id="p2R_mc4_0"
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
        id="p2R_mc5_0"
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
        id="p2R_mc6_0"
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
        id="p2R_mc8_0"
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
        id="p2R_mc10_0"
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
        id="p2R_mc11_0"
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
        id="p2R_mc12_0"
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
        id="p2R_mc13_0"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        id="p2R_mc13_1"
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
        id="p2R_mc14_0"
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
        id="p2R_mc15_0"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        id="p2R_mc15_1"
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
        id="p2R_mc16_0"
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
        id="p2R_mc17_0"
        role="presentation"
      >
      </span>
      <span
        dir="ltr"
        id="p2R_mc17_1"
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
        id="p2R_mc18_0"
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
  <div
    class="link-layer"
    data-main-rotation="0"
  >
    <a
      aria-label="Vaadin website (opens in a new tab)"
      aria-owns="pdfjs_internal_struct_1_link_1"
      class="link"
      href="https://vaadin.com/"
      id="pdfjs_internal_id_11R"
      rel="noopener noreferrer"
      tabindex="0"
      target="_blank"
    >
    </a>
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer page tagged */

snapshots["vaadin-pdf-viewer page links"] = 
`<div
  aria-label="Page 1"
  part="page"
  role="region"
>
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
      Links
    </span>
    <br role="presentation">
    <span
      aria-owns="pdfjs_internal_id_7R"
      dir="ltr"
      role="presentation"
    >
      Internal link to page 2
    </span>
    <br role="presentation">
    <span
      aria-owns="pdfjs_internal_id_8R"
      dir="ltr"
      role="presentation"
    >
      External link to vaadin.com
    </span>
    <div class="end-of-content">
    </div>
  </div>
  <div
    class="link-layer"
    data-main-rotation="0"
  >
    <a
      aria-label="Internal link to page 2"
      class="link"
      href="#"
      id="pdfjs_internal_id_7R"
      tabindex="0"
    >
    </a>
    <a
      aria-label="External link to vaadin.com (opens in a new tab)"
      class="link"
      href="https://vaadin.com/"
      id="pdfjs_internal_id_8R"
      rel="noopener noreferrer"
      tabindex="0"
      target="_blank"
    >
    </a>
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer page links */

