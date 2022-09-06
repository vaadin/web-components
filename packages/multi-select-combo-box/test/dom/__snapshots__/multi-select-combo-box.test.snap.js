/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-multi-select-combo-box default"] = 
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
      <vaadin-multi-select-combo-box-chip
        hidden=""
        id="overflow"
        part="chip overflow"
        slot="prefix"
        title=""
      >
      </vaadin-multi-select-combo-box-chip>
      <div
        id="chips"
        part="chips"
        slot="prefix"
      >
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
/* end snapshot vaadin-multi-select-combo-box default */

