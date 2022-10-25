/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-multi-select-combo-box host default"] = 
`<vaadin-multi-select-combo-box placeholder="">
  <label
    for="input-vaadin-multi-select-combo-box-4"
    id="label-vaadin-multi-select-combo-box-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-multi-select-combo-box-2"
    slot="error-message"
  >
  </div>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    id="input-vaadin-multi-select-combo-box-4"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <vaadin-multi-select-combo-box-chip
    hidden=""
    label="0"
    slot="overflow"
    title=""
  >
  </vaadin-multi-select-combo-box-chip>
</vaadin-multi-select-combo-box>
`;
/* end snapshot vaadin-multi-select-combo-box host default */

snapshots["vaadin-multi-select-combo-box shadow default"] = 
`<div class="vaadin-multi-select-combo-box-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-multi-select-combo-box-internal id="comboBox">
    <vaadin-multi-select-combo-box-container part="input-field">
      <slot
        name="overflow"
        slot="prefix"
      >
      </slot>
      <div
        id="chips"
        part="chips"
        slot="prefix"
      >
        <slot name="chip">
        </slot>
      </div>
      <slot name="input">
      </slot>
      <div
        aria-hidden="true"
        id="clearButton"
        part="clear-button"
        slot="suffix"
      >
      </div>
      <div
        aria-hidden="true"
        class="toggle-button"
        id="toggleButton"
        part="toggle-button"
        slot="suffix"
      >
      </div>
    </vaadin-multi-select-combo-box-container>
  </vaadin-multi-select-combo-box-internal>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
<slot name="tooltip">
</slot>
`;
/* end snapshot vaadin-multi-select-combo-box shadow default */

