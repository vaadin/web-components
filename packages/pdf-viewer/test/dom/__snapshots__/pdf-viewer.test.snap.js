/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer role="region">
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-9"
        role="tooltip"
        slot="overlay"
      >
        Previous page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Next page"
    disabled=""
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-10"
        role="tooltip"
        slot="overlay"
      >
        Next page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page"
    aria-disabled="true"
    disabled=""
    manual-validation=""
    max="1"
    min="1"
    slot="page-field"
    style="--_page-digits: 2"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-1"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-3"
      slot="error-message"
    >
    </div>
    <input
      aria-describedby="pdf-viewer-page-error-0"
      aria-label="Page"
      disabled=""
      id="input-vaadin-integer-field-13"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
    >
  </vaadin-integer-field>
  <span
    aria-live="assertive"
    id="pdf-viewer-page-error-0"
    slot="page-error"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom out"
    disabled=""
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-11"
        role="tooltip"
        slot="overlay"
      >
        Zoom out
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    aria-disabled="true"
    disabled=""
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
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
      id="label-vaadin-select-4"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-6"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-disabled="true"
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-8 value-vaadin-select-7"
      disabled=""
      role="button"
      slot="value"
      tabindex="-1"
    >
      <vaadin-select-item id="value-vaadin-select-7">
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-8"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom in"
    disabled=""
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-12"
        role="tooltip"
        slot="overlay"
      >
        Zoom in
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host default */

snapshots["vaadin-pdf-viewer host loading"] = 
`<vaadin-pdf-viewer
  loading=""
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-9"
        role="tooltip"
        slot="overlay"
      >
        Previous page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Next page"
    disabled=""
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-10"
        role="tooltip"
        slot="overlay"
      >
        Next page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page"
    aria-disabled="true"
    disabled=""
    manual-validation=""
    max="1"
    min="1"
    slot="page-field"
    style="--_page-digits: 2"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-1"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-3"
      slot="error-message"
    >
    </div>
    <input
      aria-describedby="pdf-viewer-page-error-0"
      aria-label="Page"
      disabled=""
      id="input-vaadin-integer-field-13"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
    >
  </vaadin-integer-field>
  <span
    aria-live="assertive"
    id="pdf-viewer-page-error-0"
    slot="page-error"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom out"
    disabled=""
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-11"
        role="tooltip"
        slot="overlay"
      >
        Zoom out
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    aria-disabled="true"
    disabled=""
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
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
      id="label-vaadin-select-4"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-6"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-disabled="true"
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-8 value-vaadin-select-7"
      disabled=""
      role="button"
      slot="value"
      tabindex="-1"
    >
      <vaadin-select-item id="value-vaadin-select-7">
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-8"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom in"
    disabled=""
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-12"
        role="tooltip"
        slot="overlay"
      >
        Zoom in
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host loading */

snapshots["vaadin-pdf-viewer host error"] = 
`<vaadin-pdf-viewer
  has-error=""
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-9"
        role="tooltip"
        slot="overlay"
      >
        Previous page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Next page"
    disabled=""
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-10"
        role="tooltip"
        slot="overlay"
      >
        Next page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page"
    aria-disabled="true"
    disabled=""
    manual-validation=""
    max="1"
    min="1"
    slot="page-field"
    style="--_page-digits: 2"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-1"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-3"
      slot="error-message"
    >
    </div>
    <input
      aria-describedby="pdf-viewer-page-error-0"
      aria-label="Page"
      disabled=""
      id="input-vaadin-integer-field-13"
      max="1"
      min="1"
      slot="input"
      step="any"
      type="number"
    >
  </vaadin-integer-field>
  <span
    aria-live="assertive"
    id="pdf-viewer-page-error-0"
    slot="page-error"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom out"
    disabled=""
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-11"
        role="tooltip"
        slot="overlay"
      >
        Zoom out
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    aria-disabled="true"
    disabled=""
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
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
      id="label-vaadin-select-4"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-6"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-disabled="true"
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-8 value-vaadin-select-7"
      disabled=""
      role="button"
      slot="value"
      tabindex="-1"
    >
      <vaadin-select-item id="value-vaadin-select-7">
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-8"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Zoom in"
    disabled=""
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-12"
        role="tooltip"
        slot="overlay"
      >
        Zoom in
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host error */

snapshots["vaadin-pdf-viewer shadow default"] = 
`<div class="top-area">
  <div
    hidden=""
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="PDF document"
    >
      PDF document
    </span>
    <slot name="toolbar-toggle">
    </slot>
  </div>
  <div
    aria-label="PDF toolbar"
    part="toolbar"
    role="toolbar"
  >
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-page">
      </slot>
      <slot name="page-field">
      </slot>
      <slot name="page-error">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <div part="zoom-controls disabled">
        <slot name="toolbar-zoom">
        </slot>
      </div>
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
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow default */

snapshots["vaadin-pdf-viewer shadow error"] = 
`<div class="top-area">
  <div
    hidden=""
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="invalid.pdf"
    >
      invalid.pdf
    </span>
    <slot name="toolbar-toggle">
    </slot>
  </div>
  <div
    aria-label="PDF toolbar"
    part="toolbar"
    role="toolbar"
  >
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-page">
      </slot>
      <slot name="page-field">
      </slot>
      <slot name="page-error">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <div part="zoom-controls disabled">
        <slot name="toolbar-zoom">
        </slot>
      </div>
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
</div>
<div part="error-message">
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow error */

snapshots["vaadin-pdf-viewer shadow password error"] = 
`<div class="top-area">
  <div
    hidden=""
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="encrypted.pdf"
    >
      encrypted.pdf
    </span>
    <slot name="toolbar-toggle">
    </slot>
  </div>
  <div
    aria-label="PDF toolbar"
    part="toolbar"
    role="toolbar"
  >
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-page">
      </slot>
      <slot name="page-field">
      </slot>
      <slot name="page-error">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <div part="zoom-controls disabled">
        <slot name="toolbar-zoom">
        </slot>
      </div>
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
</div>
<div part="error-message">
  Password-protected documents are not supported.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow password error */

snapshots["vaadin-pdf-viewer host document"] = 
`<vaadin-pdf-viewer
  aria-label="Multi-page fixture"
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-9"
        role="tooltip"
        slot="overlay"
      >
        Previous page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Next page"
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-page"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-10"
        role="tooltip"
        slot="overlay"
      >
        Next page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page of 6"
    has-value=""
    manual-validation=""
    max="6"
    min="1"
    slot="page-field"
    style="--_page-digits: 2"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
      / 6
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-1"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-3"
      slot="error-message"
    >
    </div>
    <input
      aria-describedby="pdf-viewer-page-error-0"
      aria-label="Page of 6"
      id="input-vaadin-integer-field-13"
      max="6"
      min="1"
      slot="input"
      step="any"
      tabindex="0"
      type="number"
    >
  </vaadin-integer-field>
  <span
    aria-live="assertive"
    id="pdf-viewer-page-error-0"
    slot="page-error"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-label="Zoom out"
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-11"
        role="tooltip"
        slot="overlay"
      >
        Zoom out
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
  >
    <div slot="overlay">
      <vaadin-select-list-box
        aria-orientation="vertical"
        role="listbox"
        selected="0"
      >
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          Page width
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          Page fit
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          25%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          50%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          75%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          100%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          125%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          150%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          200%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          300%
        </vaadin-select-item>
        <vaadin-select-item
          aria-selected="false"
          role="option"
        >
          400%
        </vaadin-select-item>
      </vaadin-select-list-box>
    </div>
    <label
      id="label-vaadin-select-4"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-6"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-8 value-vaadin-select-7"
      role="button"
      slot="value"
      tabindex="0"
    >
      <vaadin-select-item id="value-vaadin-select-7">
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-8"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-label="Zoom in"
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-12"
        role="tooltip"
        slot="overlay"
      >
        Zoom in
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host document */

snapshots["vaadin-pdf-viewer shadow document"] = 
`<div class="top-area">
  <div
    hidden=""
    part="header"
  >
    <span
      dir="auto"
      part="title"
      title="Multi-page fixture"
    >
      Multi-page fixture
    </span>
    <slot name="toolbar-toggle">
    </slot>
  </div>
  <div
    aria-label="PDF toolbar"
    part="toolbar"
    role="toolbar"
  >
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-page">
      </slot>
      <slot name="page-field">
      </slot>
      <slot name="page-error">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <div part="zoom-controls">
        <slot name="toolbar-zoom">
        </slot>
      </div>
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
        <div
          class="link-layer"
          data-main-rotation="0"
        >
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
        <div
          class="link-layer"
          data-main-rotation="0"
        >
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
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow document */

snapshots["vaadin-pdf-viewer host header"] = 
`<vaadin-pdf-viewer
  aria-label="Multi-page fixture"
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-expanded="true"
    aria-label="Toolbar"
    has-tooltip=""
    icon="collapse-toolbar"
    role="button"
    slot="toolbar-toggle"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-14"
        role="tooltip"
        slot="overlay"
      >
        Toolbar
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-9"
        role="tooltip"
        slot="overlay"
      >
        Previous page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Next page"
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-page"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-10"
        role="tooltip"
        slot="overlay"
      >
        Next page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page of 6"
    has-value=""
    manual-validation=""
    max="6"
    min="1"
    slot="page-field"
    style="--_page-digits: 2"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
      / 6
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-1"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-3"
      slot="error-message"
    >
    </div>
    <input
      aria-describedby="pdf-viewer-page-error-0"
      aria-label="Page of 6"
      id="input-vaadin-integer-field-13"
      max="6"
      min="1"
      slot="input"
      step="any"
      tabindex="0"
      type="number"
    >
  </vaadin-integer-field>
  <span
    aria-live="assertive"
    id="pdf-viewer-page-error-0"
    slot="page-error"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-label="Zoom out"
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-11"
        role="tooltip"
        slot="overlay"
      >
        Zoom out
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
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
      id="label-vaadin-select-4"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-6"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-8 value-vaadin-select-7"
      role="button"
      slot="value"
      tabindex="0"
    >
      <vaadin-select-item id="value-vaadin-select-7">
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-8"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-label="Zoom in"
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-12"
        role="tooltip"
        slot="overlay"
      >
        Zoom in
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host header */

snapshots["vaadin-pdf-viewer host toolbar collapsed"] = 
`<vaadin-pdf-viewer
  aria-label="Multi-page fixture"
  role="region"
>
  <vaadin-pdf-viewer-button
    aria-expanded="false"
    aria-label="Toolbar"
    has-tooltip=""
    icon="expand-toolbar"
    role="button"
    slot="toolbar-toggle"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-14"
        role="tooltip"
        slot="overlay"
      >
        Toolbar
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-disabled="true"
    aria-label="Previous page"
    disabled=""
    has-tooltip=""
    icon="previous-page"
    role="button"
    slot="toolbar-page"
    tabindex="-1"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-9"
        role="tooltip"
        slot="overlay"
      >
        Previous page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-pdf-viewer-button
    aria-label="Next page"
    has-tooltip=""
    icon="next-page"
    role="button"
    slot="toolbar-page"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-10"
        role="tooltip"
        slot="overlay"
      >
        Next page
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-integer-field
    accessible-name="Page of 6"
    has-value=""
    manual-validation=""
    max="6"
    min="1"
    slot="page-field"
    style="--_page-digits: 2"
    theme="align-right"
  >
    <span
      aria-hidden="true"
      slot="suffix"
    >
      / 6
    </span>
    <label
      for="input-vaadin-integer-field-13"
      id="label-vaadin-integer-field-1"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-integer-field-3"
      slot="error-message"
    >
    </div>
    <input
      aria-describedby="pdf-viewer-page-error-0"
      aria-label="Page of 6"
      id="input-vaadin-integer-field-13"
      max="6"
      min="1"
      slot="input"
      step="any"
      tabindex="0"
      type="number"
    >
  </vaadin-integer-field>
  <span
    aria-live="assertive"
    id="pdf-viewer-page-error-0"
    slot="page-error"
  >
  </span>
  <vaadin-pdf-viewer-button
    aria-label="Zoom out"
    has-tooltip=""
    icon="zoom-out"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-11"
        role="tooltip"
        slot="overlay"
      >
        Zoom out
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
  <vaadin-select
    accessible-name="Zoom"
    has-value=""
    slot="toolbar-zoom"
    theme="align-center"
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
      id="label-vaadin-select-4"
      slot="label"
    >
    </label>
    <div
      hidden=""
      id="error-message-vaadin-select-6"
      slot="error-message"
    >
    </div>
    <vaadin-select-value-button
      aria-expanded="false"
      aria-haspopup="listbox"
      aria-labelledby="label-vaadin-select-8 value-vaadin-select-7"
      role="button"
      slot="value"
      tabindex="0"
    >
      <vaadin-select-item id="value-vaadin-select-7">
        Page width
      </vaadin-select-item>
    </vaadin-select-value-button>
    <label
      id="label-vaadin-select-8"
      slot="sr-label"
    >
      Zoom
    </label>
  </vaadin-select>
  <vaadin-pdf-viewer-button
    aria-label="Zoom in"
    has-tooltip=""
    icon="zoom-in"
    role="button"
    slot="toolbar-zoom"
    tabindex="0"
    theme="tertiary icon"
  >
    <vaadin-tooltip
      modeless=""
      slot="tooltip"
    >
      <div
        id="vaadin-tooltip-12"
        role="tooltip"
        slot="overlay"
      >
        Zoom in
      </div>
    </vaadin-tooltip>
  </vaadin-pdf-viewer-button>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host toolbar collapsed */

snapshots["vaadin-pdf-viewer shadow header"] = 
`<div class="top-area">
  <div part="header">
    <span
      dir="auto"
      part="title"
      title="Annual report"
    >
      Annual report
    </span>
    <slot name="toolbar-toggle">
    </slot>
  </div>
  <div
    aria-label="PDF toolbar"
    part="toolbar"
    role="toolbar"
  >
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-page">
      </slot>
      <slot name="page-field">
      </slot>
      <slot name="page-error">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <div part="zoom-controls">
        <slot name="toolbar-zoom">
        </slot>
      </div>
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
        <div
          class="link-layer"
          data-main-rotation="0"
        >
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
        <div
          class="link-layer"
          data-main-rotation="0"
        >
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
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow header */

snapshots["vaadin-pdf-viewer shadow toolbar collapsed"] = 
`<div class="top-area">
  <div part="header">
    <span
      dir="auto"
      part="title"
      title="Multi-page fixture"
    >
      Multi-page fixture
    </span>
    <slot name="toolbar-toggle">
    </slot>
  </div>
  <div
    aria-label="PDF toolbar"
    hidden=""
    part="toolbar"
    role="toolbar"
  >
    <div
      class="navigation"
      part="toolbar-group"
    >
      <slot name="toolbar-page">
      </slot>
      <slot name="page-field">
      </slot>
      <slot name="page-error">
      </slot>
    </div>
    <div
      class="viewing"
      part="toolbar-group"
    >
      <div part="zoom-controls">
        <slot name="toolbar-zoom">
        </slot>
      </div>
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
        <div
          class="link-layer"
          data-main-rotation="0"
        >
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
        <div
          class="link-layer"
          data-main-rotation="0"
        >
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
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow toolbar collapsed */

snapshots["vaadin-pdf-viewer page tagged"] = 
`<div
  aria-label="Page 1"
  part="page"
  role="group"
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
          <span aria-owns="p2R_mc1">
          </span>
        </span>
      </span>
      <span role="paragraph">
        <span role="none">
          <span aria-owns="p2R_mc2">
          </span>
        </span>
        <span>
          <span role="none">
            <span aria-owns="p2R_mc3">
            </span>
          </span>
          <span>
          </span>
        </span>
        <span role="none">
          <span aria-owns="p2R_mc4">
          </span>
        </span>
      </span>
      <span
        lang="sv"
        role="paragraph"
      >
        <span role="none">
          <span aria-owns="p2R_mc5">
          </span>
        </span>
      </span>
      <span
        aria-level="2"
        role="heading"
      >
        <span role="none">
          <span aria-owns="p2R_mc6">
          </span>
        </span>
      </span>
      <span role="list">
        <span role="listitem">
          <span aria-owns="p2R_mc7">
          </span>
          <span role="none">
            <span aria-owns="p2R_mc8">
            </span>
          </span>
        </span>
        <span role="listitem">
          <span aria-owns="p2R_mc9">
          </span>
          <span role="none">
            <span aria-owns="p2R_mc10">
            </span>
          </span>
        </span>
      </span>
      <span
        aria-level="2"
        role="heading"
      >
        <span role="none">
          <span aria-owns="p2R_mc11">
          </span>
        </span>
      </span>
      <span role="table">
        <span role="row">
          <span role="columnheader">
            <span role="none">
              <span aria-owns="p2R_mc12">
              </span>
            </span>
          </span>
          <span role="columnheader">
            <span role="none">
              <span aria-owns="p2R_mc13">
              </span>
            </span>
          </span>
        </span>
        <span role="row">
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc14">
              </span>
            </span>
          </span>
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc15">
              </span>
            </span>
          </span>
        </span>
        <span role="row">
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc16">
              </span>
            </span>
          </span>
          <span role="cell">
            <span role="none">
              <span aria-owns="p2R_mc17">
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
          <span aria-owns="p2R_mc18">
          </span>
        </span>
      </span>
      <span
        aria-owns="p2R_mc19"
        role="figure"
      >
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
        aria-hidden="true"
        dir="ltr"
        role="presentation"
      >
        Vaadin website
      </span>
      <a
        aria-label="Vaadin website (opens in a new tab)"
        class="link"
        href="https://vaadin.com/"
        rel="noopener noreferrer"
        target="_blank"
      >
      </a>
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
  <div
    class="link-layer"
    data-main-rotation="0"
  >
  </div>
</div>
`;
/* end snapshot vaadin-pdf-viewer page tagged */

