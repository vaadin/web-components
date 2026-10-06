/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer role="region">
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Sidebar"
    aria-pressed="false"
    disabled=""
    icon="sidebar"
    role="button"
    slot="toolbar-start"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    icon="previous-page"
    role="button"
    slot="toolbar-navigation"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page"
    aria-disabled="true"
    disabled=""
    max="1"
    min="1"
    slot="toolbar-navigation"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
    </span>
    <label
      for="input-vaadin-integer-field-9"
      id="label-vaadin-integer-field-0"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-2"
      slot="error-message"
    >
    </div>
    <input
      aria-label="Page"
      disabled=""
      id="input-vaadin-integer-field-9"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
    >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Next page"
    disabled=""
    icon="next-page"
    role="button"
    slot="toolbar-navigation"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom out"
    disabled=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    aria-disabled="true"
    disabled=""
    has-value=""
    slot="toolbar-zoom"
  >
    <div slot="overlay">
      <vaadin-select-list-box
        aria-orientation="vertical"
        role="listbox"
        selected="0"
      >
        <vaadin-select-item
          aria-selected="true"
          role="option"
          selected=""
          tabindex="0"
        >
          Page width
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          Page fit
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          25%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          50%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          75%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          100%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          125%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          150%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          200%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          300%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          400%
        </vaadin-select-item>
      </vaadin-select-list-box>
    </div>
    <label
      id="label-vaadin-select-3"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-5"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-disabled="true"
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-7 value-vaadin-select-6"
      disabled=""
      role="button"
      slot="value"
      tabindex="-1"
    >
      <vaadin-select-item
        id="value-vaadin-select-6"
        selected=""
      >
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-7"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom in"
    disabled=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Find in document"
    aria-pressed="false"
    disabled=""
    icon="find"
    role="button"
    slot="toolbar-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Download"
    disabled=""
    icon="download"
    role="button"
    slot="toolbar-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Print"
    disabled=""
    icon="print"
    role="button"
    slot="toolbar-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-tooltip
    modeless=""
    slot="toolbar-tooltip"
  >
    <div
      id="vaadin-tooltip-8"
      role="tooltip"
      slot="overlay"
    >
    </div>
  </vaadin-tooltip>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host default */

snapshots["vaadin-pdf-viewer host error"] = 
`<vaadin-pdf-viewer
  has-error=""
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Sidebar"
    aria-pressed="false"
    disabled=""
    icon="sidebar"
    role="button"
    slot="toolbar-start"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    icon="previous-page"
    role="button"
    slot="toolbar-navigation"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page"
    aria-disabled="true"
    disabled=""
    max="1"
    min="1"
    slot="toolbar-navigation"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
    </span>
    <label
      for="input-vaadin-integer-field-9"
      id="label-vaadin-integer-field-0"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-2"
      slot="error-message"
    >
    </div>
    <input
      aria-label="Page"
      disabled=""
      id="input-vaadin-integer-field-9"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
    >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Next page"
    disabled=""
    icon="next-page"
    role="button"
    slot="toolbar-navigation"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom out"
    disabled=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    aria-disabled="true"
    disabled=""
    has-value=""
    slot="toolbar-zoom"
  >
    <div slot="overlay">
      <vaadin-select-list-box
        aria-orientation="vertical"
        role="listbox"
        selected="0"
      >
        <vaadin-select-item
          aria-selected="true"
          role="option"
          selected=""
          tabindex="0"
        >
          Page width
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          Page fit
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          25%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          50%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          75%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          100%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          125%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          150%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          200%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          300%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          400%
        </vaadin-select-item>
      </vaadin-select-list-box>
    </div>
    <label
      id="label-vaadin-select-3"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-5"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-disabled="true"
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-7 value-vaadin-select-6"
      disabled=""
      role="button"
      slot="value"
      tabindex="-1"
    >
      <vaadin-select-item
        id="value-vaadin-select-6"
        selected=""
      >
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-7"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom in"
    disabled=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Find in document"
    aria-pressed="false"
    disabled=""
    icon="find"
    role="button"
    slot="toolbar-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Download"
    disabled=""
    icon="download"
    role="button"
    slot="toolbar-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Print"
    disabled=""
    icon="print"
    role="button"
    slot="toolbar-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-tooltip
    modeless=""
    slot="toolbar-tooltip"
  >
    <div
      id="vaadin-tooltip-8"
      role="tooltip"
      slot="overlay"
    >
    </div>
  </vaadin-tooltip>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host error */

snapshots["vaadin-pdf-viewer find bar host"] = 
`<vaadin-pdf-viewer
  aria-label="Multi-page fixture"
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-label="Sidebar"
    aria-pressed="false"
    icon="sidebar"
    role="button"
    slot="toolbar-start"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    icon="previous-page"
    role="button"
    slot="toolbar-navigation"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page of 6"
    has-value=""
    max="6"
    min="1"
    slot="toolbar-navigation"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
      / 6
    </span>
    <label
      for="input-vaadin-integer-field-9"
      id="label-vaadin-integer-field-0"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-2"
      slot="error-message"
    >
    </div>
    <input
      aria-label="Page of 6"
      id="input-vaadin-integer-field-9"
      max="6"
      min="1"
      slot="input"
      step="any"
      tabindex="0"
      type="number"
    >
  </vaadin-integer-field>
  <vaadin-pdf-viewer-button
    aria-label="Next page"
    icon="next-page"
    role="button"
    slot="toolbar-navigation"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Zoom out"
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    has-value=""
    slot="toolbar-zoom"
  >
    <div slot="overlay">
      <vaadin-select-list-box
        aria-orientation="vertical"
        role="listbox"
        selected="0"
      >
        <vaadin-select-item
          aria-selected="true"
          role="option"
          selected=""
          tabindex="0"
        >
          Page width
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          Page fit
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          25%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          50%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          75%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          100%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          125%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          150%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          200%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          300%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
          tabindex="-1"
        >
          400%
        </vaadin-select-item>
      </vaadin-select-list-box>
    </div>
    <label
      id="label-vaadin-select-3"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-5"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-7 value-vaadin-select-6"
      role="button"
      slot="value"
      tabindex="0"
    >
      <vaadin-select-item
        id="value-vaadin-select-6"
        selected=""
      >
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-7"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-label="Zoom in"
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Find in document"
    aria-pressed="true"
    icon="find"
    role="button"
    slot="toolbar-actions"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Download"
    icon="download"
    role="button"
    slot="toolbar-actions"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Print"
    icon="print"
    role="button"
    slot="toolbar-actions"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-text-field
    accessible-name="Find in document"
    focused=""
    placeholder="Find in document"
    slot="find"
  >
    <label
      for="input-vaadin-text-field-13"
      id="label-vaadin-text-field-10"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-text-field-12"
      slot="error-message"
    >
    </div>
    <input
      aria-label="Find in document"
      id="input-vaadin-text-field-13"
      placeholder="Find in document"
      slot="input"
      type="text"
    >
  </vaadin-text-field>
  <span
    aria-hidden="true"
    dir="auto"
    hidden=""
    slot="find-actions"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous match"
    disabled=""
    icon="previous-match"
    role="button"
    slot="find-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Next match"
    disabled=""
    icon="next-match"
    role="button"
    slot="find-actions"
    tabindex="-1"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Close find"
    icon="close"
    role="button"
    slot="find-actions"
    tabindex="0"
    theme="tertiary icon"
  >
  </vaadin-pdf-viewer-button>
  <vaadin-tooltip
    modeless=""
    slot="toolbar-tooltip"
  >
    <div
      id="vaadin-tooltip-8"
      role="tooltip"
      slot="overlay"
    >
    </div>
  </vaadin-tooltip>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer find bar host */

snapshots["vaadin-pdf-viewer shadow default"] = 
`<div
  aria-label="PDF toolbar"
  part="toolbar"
  role="toolbar"
>
  <div part="toolbar-group">
    <slot name="toolbar-start">
    </slot>
  </div>
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
<div
  aria-label="Find in document"
  hidden=""
  part="find-bar"
  role="search"
>
  <slot name="find">
  </slot>
  <div class="find-actions">
    <slot name="find-actions">
    </slot>
  </div>
</div>
<slot name="toolbar-tooltip">
</slot>
<div part="loader">
</div>
<div class="main">
  <div
    hidden=""
    part="sidebar"
  >
    <div
      aria-label="Sidebar view"
      hidden=""
      part="sidebar-header"
      role="group"
    >
      <slot name="sidebar-header">
      </slot>
    </div>
    <div
      aria-label="Page thumbnails"
      id="thumbnails"
      part="thumbnails"
      role="listbox"
    >
    </div>
    <div
      aria-label="Outline"
      hidden=""
      id="outline"
      part="outline"
      role="tree"
    >
    </div>
  </div>
  <div class="content-area">
    <div
      aria-busy="false"
      aria-label="Pages"
      id="content"
      part="content"
      role="document"
      tabindex="-1"
    >
      <div id="pages">
      </div>
    </div>
    <div class="content-focus-ring">
    </div>
    <div
      hidden=""
      part="print-progress"
    >
      <span>
        Preparing to print…
      </span>
      <slot name="print-progress">
      </slot>
    </div>
  </div>
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow default */

snapshots["vaadin-pdf-viewer shadow document"] = 
`<div
  aria-label="PDF toolbar"
  part="toolbar"
  role="toolbar"
>
  <div part="toolbar-group">
    <slot name="toolbar-start">
    </slot>
  </div>
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
<div
  aria-label="Find in document"
  hidden=""
  part="find-bar"
  role="search"
>
  <slot name="find">
  </slot>
  <div class="find-actions">
    <slot name="find-actions">
    </slot>
  </div>
</div>
<slot name="toolbar-tooltip">
</slot>
<div part="loader">
</div>
<div class="main">
  <div
    hidden=""
    part="sidebar"
  >
    <div
      aria-label="Sidebar view"
      hidden=""
      part="sidebar-header"
      role="group"
    >
      <slot name="sidebar-header">
      </slot>
    </div>
    <div
      aria-label="Page thumbnails"
      id="thumbnails"
      part="thumbnails"
      role="listbox"
    >
    </div>
    <div
      aria-label="Outline"
      hidden=""
      id="outline"
      part="outline"
      role="tree"
    >
    </div>
  </div>
  <div class="content-area">
    <div
      aria-busy="false"
      aria-label="Pages"
      id="content"
      part="content"
      role="document"
      tabindex="0"
    >
      <div id="pages">
        <div
          aria-label="Page 1"
          part="page"
          role="group"
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
          <div class="link-layer">
          </div>
        </div>
        <div
          aria-label="Page 2"
          part="page"
          role="group"
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
          <div class="link-layer">
          </div>
        </div>
        <div
          aria-label="Page 3"
          part="page"
          role="group"
        >
        </div>
        <div
          aria-label="Page 4"
          part="page"
          role="group"
        >
        </div>
        <div
          aria-label="Page 5"
          part="page"
          role="group"
        >
        </div>
        <div
          aria-label="Page 6"
          part="page"
          role="group"
        >
        </div>
      </div>
    </div>
    <div class="content-focus-ring">
    </div>
    <div
      hidden=""
      part="print-progress"
    >
      <span>
        Preparing to print…
      </span>
      <slot name="print-progress">
      </slot>
    </div>
  </div>
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow document */

snapshots["vaadin-pdf-viewer shadow error"] = 
`<div
  aria-label="PDF toolbar"
  part="toolbar"
  role="toolbar"
>
  <div part="toolbar-group">
    <slot name="toolbar-start">
    </slot>
  </div>
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
<div
  aria-label="Find in document"
  hidden=""
  part="find-bar"
  role="search"
>
  <slot name="find">
  </slot>
  <div class="find-actions">
    <slot name="find-actions">
    </slot>
  </div>
</div>
<slot name="toolbar-tooltip">
</slot>
<div part="loader">
</div>
<div class="main">
  <div
    hidden=""
    part="sidebar"
  >
    <div
      aria-label="Sidebar view"
      hidden=""
      part="sidebar-header"
      role="group"
    >
      <slot name="sidebar-header">
      </slot>
    </div>
    <div
      aria-label="Page thumbnails"
      id="thumbnails"
      part="thumbnails"
      role="listbox"
    >
    </div>
    <div
      aria-label="Outline"
      hidden=""
      id="outline"
      part="outline"
      role="tree"
    >
    </div>
  </div>
  <div class="content-area">
    <div
      aria-busy="false"
      aria-label="Pages"
      id="content"
      part="content"
      role="document"
      tabindex="-1"
    >
      <div id="pages">
      </div>
    </div>
    <div class="content-focus-ring">
    </div>
    <div
      hidden=""
      part="print-progress"
    >
      <span>
        Preparing to print…
      </span>
      <slot name="print-progress">
      </slot>
    </div>
  </div>
</div>
<div part="error-message">
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow error */

