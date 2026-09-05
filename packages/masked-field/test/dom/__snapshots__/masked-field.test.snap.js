/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-masked-field host default"] = 
`<vaadin-masked-field>
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-masked-field-3"
    slot="input"
    type="text"
  >
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host default */

snapshots["vaadin-masked-field host label"] = 
`<vaadin-masked-field has-label="">
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-labelledby="label-vaadin-masked-field-0"
    id="input-vaadin-masked-field-3"
    slot="input"
    type="text"
  >
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host label */

snapshots["vaadin-masked-field host helper"] = 
`<vaadin-masked-field has-helper="">
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="helper-vaadin-masked-field-1"
    id="input-vaadin-masked-field-3"
    slot="input"
    type="text"
  >
  <div
    id="helper-vaadin-masked-field-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host helper */

snapshots["vaadin-masked-field host error"] = 
`<vaadin-masked-field
  has-error-message=""
  invalid=""
>
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
    Error
  </div>
  <input
    aria-describedby="error-message-vaadin-masked-field-2"
    aria-invalid="true"
    id="input-vaadin-masked-field-3"
    invalid=""
    slot="input"
    type="text"
  >
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host error */

snapshots["vaadin-masked-field host accessibleDescriptionRef"] = 
`<vaadin-masked-field>
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
  </div>
  <input
    aria-describedby="accessible-description-ref-0"
    id="input-vaadin-masked-field-3"
    slot="input"
    type="text"
  >
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host accessibleDescriptionRef */

snapshots["vaadin-masked-field host inputMode property"] = 
`<vaadin-masked-field>
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-masked-field-3"
    inputmode="search"
    slot="input"
    type="text"
  >
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host inputMode property */

snapshots["vaadin-masked-field host inputmode attribute"] = 
`<vaadin-masked-field inputmode="search">
  <label
    for="input-vaadin-masked-field-3"
    id="label-vaadin-masked-field-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-masked-field-2"
    slot="error-message"
  >
  </div>
  <input
    id="input-vaadin-masked-field-3"
    inputmode="search"
    slot="input"
    type="text"
  >
</vaadin-masked-field>
`;
/* end snapshot vaadin-masked-field host inputmode attribute */

snapshots["vaadin-masked-field shadow default"] = 
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
      part="prompt"
    >
      <span>
      </span>
    </div>
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
`;
/* end snapshot vaadin-masked-field shadow default */

snapshots["vaadin-masked-field shadow disabled"] = 
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
      part="prompt"
    >
      <span>
      </span>
    </div>
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
`;
/* end snapshot vaadin-masked-field shadow disabled */

snapshots["vaadin-masked-field shadow readonly"] = 
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
      part="prompt"
    >
      <span>
      </span>
    </div>
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
`;
/* end snapshot vaadin-masked-field shadow readonly */

snapshots["vaadin-masked-field shadow invalid"] = 
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
      part="prompt"
    >
      <span>
      </span>
    </div>
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
`;
/* end snapshot vaadin-masked-field shadow invalid */

snapshots["vaadin-masked-field shadow theme"] = 
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
      part="prompt"
    >
      <span>
      </span>
    </div>
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
`;
/* end snapshot vaadin-masked-field shadow theme */

