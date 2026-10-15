/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-query-field host default"] = 
`<vaadin-query-field modeless="">
  <label
    for="input-vaadin-query-field-3"
    id="label-vaadin-query-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-query-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocomplete="off"
    id="input-vaadin-query-field-3"
    role="combobox"
    slot="input"
    spellcheck="false"
    type="text"
  >
  <div
    id="listbox-vaadin-query-field-4"
    role="listbox"
    slot="overlay"
  >
  </div>
</vaadin-query-field>
`;
/* end snapshot vaadin-query-field host default */

snapshots["vaadin-query-field host suggestions"] = 
`<vaadin-query-field
  focused=""
  has-value=""
  modeless=""
  start-aligned=""
  top-aligned=""
>
  <label
    for="input-vaadin-query-field-3"
    id="label-vaadin-query-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-query-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-autocomplete="list"
    aria-controls="listbox-vaadin-query-field-4"
    aria-expanded="true"
    autocomplete="off"
    id="input-vaadin-query-field-3"
    role="combobox"
    slot="input"
    spellcheck="false"
    type="text"
  >
  <div
    id="listbox-vaadin-query-field-4"
    role="listbox"
    slot="overlay"
  >
    <vaadin-item
      aria-selected="false"
      id="listbox-vaadin-query-field-4-0"
      role="option"
    >
      label:
    </vaadin-item>
  </div>
</vaadin-query-field>
`;
/* end snapshot vaadin-query-field host suggestions */

snapshots["vaadin-query-field shadow default"] = 
`<div class="vaadin-field-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container
    id="inputField"
    part="input-field"
  >
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <div
      aria-hidden="true"
      id="highlights"
      part="highlights"
    >
      <span id="highlightsContent">
      </span>
    </div>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      aria-hidden="true"
      id="clearButton"
      part="field-button clear-button"
      slot="suffix"
    >
    </div>
  </vaadin-input-container>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
  <slot name="tooltip">
  </slot>
</div>
<vaadin-query-field-overlay
  exportparts="overlay, content"
  id="overlay"
  modeless=""
  no-vertical-overlap=""
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-query-field-overlay>
`;
/* end snapshot vaadin-query-field shadow default */

snapshots["vaadin-query-field shadow tokens"] = 
`<div class="vaadin-field-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container
    id="inputField"
    part="input-field"
  >
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <div
      aria-hidden="true"
      id="highlights"
      part="highlights"
    >
      <span id="highlightsContent">
        <span
          data-index="0"
          part="token filter-label"
        >
          <span part="token-name">
            label:
          </span>
          <span part="token-value">
            "Warp Records"
          </span>
        </span>
        <span data-index="1">
        </span>
        <span
          data-index="2"
          part="token invalid-token filter-year"
        >
          <span part="token-name">
            year:
          </span>
          <span part="token-value">
            abc
          </span>
        </span>
        <span data-index="3">
        </span>
        <span data-index="4">
          foo
        </span>
      </span>
    </div>
    <slot name="input">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      aria-hidden="true"
      id="clearButton"
      part="field-button clear-button"
      slot="suffix"
    >
    </div>
  </vaadin-input-container>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
  <slot name="tooltip">
  </slot>
</div>
<vaadin-query-field-overlay
  exportparts="overlay, content"
  id="overlay"
  modeless=""
  no-vertical-overlap=""
  popover="manual"
>
  <slot name="overlay">
  </slot>
</vaadin-query-field-overlay>
`;
/* end snapshot vaadin-query-field shadow tokens */

