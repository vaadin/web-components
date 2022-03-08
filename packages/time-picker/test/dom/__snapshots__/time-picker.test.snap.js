/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-time-picker host default"] = 
`<vaadin-time-picker>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host default */

snapshots["vaadin-time-picker host label"] = 
`<vaadin-time-picker has-label="">
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
    Label
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host label */

snapshots["vaadin-time-picker host helper"] = 
`<vaadin-time-picker has-helper="">
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
  <div slot="helper">
    Helper
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host helper */

snapshots["vaadin-time-picker host error"] = 
`<vaadin-time-picker
  has-error-message=""
  invalid=""
>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    aria-invalid="true"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    invalid=""
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
  </label>
  <div
    role="alert"
    slot="error-message"
  >
    Error
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host error */

snapshots["vaadin-time-picker host disabled"] = 
`<vaadin-time-picker
  aria-disabled="true"
  disabled=""
>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    disabled=""
    role="combobox"
    slot="input"
    spellcheck="false"
    tabindex="-1"
  >
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host disabled */

snapshots["vaadin-time-picker host readonly"] = 
`<vaadin-time-picker readonly="">
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    readonly=""
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host readonly */

snapshots["vaadin-time-picker host placeholder"] = 
`<vaadin-time-picker placeholder="Placeholder">
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    placeholder="Placeholder"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host placeholder */

snapshots["vaadin-time-picker host pattern"] = 
`<vaadin-time-picker>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    pattern="[0-9]*"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label slot="label">
  </label>
  <div
    hidden=""
    slot="error-message"
  >
  </div>
</vaadin-time-picker>
`;
/* end snapshot vaadin-time-picker host pattern */

snapshots["vaadin-time-picker shadow default"] = 
`<div class="vaadin-time-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-time-picker-combo-box
    dir="ltr"
    id="comboBox"
  >
    <vaadin-input-container part="input-field">
      <slot
        name="prefix"
        slot="prefix"
      >
      </slot>
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
    </vaadin-input-container>
  </vaadin-time-picker-combo-box>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-time-picker shadow default */

snapshots["vaadin-time-picker shadow disabled"] = 
`<div class="vaadin-time-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-time-picker-combo-box
    aria-disabled="true"
    dir="ltr"
    disabled=""
    id="comboBox"
  >
    <vaadin-input-container
      disabled=""
      part="input-field"
    >
      <slot
        name="prefix"
        slot="prefix"
      >
      </slot>
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
    </vaadin-input-container>
  </vaadin-time-picker-combo-box>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-time-picker shadow disabled */

snapshots["vaadin-time-picker shadow readonly"] = 
`<div class="vaadin-time-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-time-picker-combo-box
    dir="ltr"
    id="comboBox"
    readonly=""
  >
    <vaadin-input-container
      part="input-field"
      readonly=""
    >
      <slot
        name="prefix"
        slot="prefix"
      >
      </slot>
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
    </vaadin-input-container>
  </vaadin-time-picker-combo-box>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-time-picker shadow readonly */

snapshots["vaadin-time-picker shadow invalid"] = 
`<div class="vaadin-time-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-time-picker-combo-box
    dir="ltr"
    id="comboBox"
  >
    <vaadin-input-container
      invalid=""
      part="input-field"
    >
      <slot
        name="prefix"
        slot="prefix"
      >
      </slot>
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
    </vaadin-input-container>
  </vaadin-time-picker-combo-box>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-time-picker shadow invalid */

snapshots["vaadin-time-picker shadow theme"] = 
`<div class="vaadin-time-picker-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-time-picker-combo-box
    dir="ltr"
    id="comboBox"
    theme="align-right"
  >
    <vaadin-input-container
      part="input-field"
      theme="align-right"
    >
      <slot
        name="prefix"
        slot="prefix"
      >
      </slot>
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
    </vaadin-input-container>
  </vaadin-time-picker-combo-box>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
`;
/* end snapshot vaadin-time-picker shadow theme */

