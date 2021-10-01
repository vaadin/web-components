/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-text-area shadow default"] = 
`<div part="container">
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
    <slot name="textarea">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      id="clearButton"
      part="clear-button"
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
</div>
`;
/* end snapshot vaadin-text-area shadow default */

snapshots["vaadin-text-area shadow disabled"] = 
`<div part="container">
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
    <slot name="textarea">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      id="clearButton"
      part="clear-button"
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
</div>
`;
/* end snapshot vaadin-text-area shadow disabled */

snapshots["vaadin-text-area shadow readonly"] = 
`<div part="container">
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
    <slot name="textarea">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      id="clearButton"
      part="clear-button"
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
</div>
`;
/* end snapshot vaadin-text-area shadow readonly */

snapshots["vaadin-text-area shadow invalid"] = 
`<div part="container">
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
    <slot name="textarea">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      id="clearButton"
      part="clear-button"
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
</div>
`;
/* end snapshot vaadin-text-area shadow invalid */

snapshots["vaadin-text-area shadow theme"] = 
`<div part="container">
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
    <slot name="textarea">
    </slot>
    <slot
      name="suffix"
      slot="suffix"
    >
    </slot>
    <div
      id="clearButton"
      part="clear-button"
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
</div>
`;
/* end snapshot vaadin-text-area shadow theme */

snapshots["vaadin-text-area slots default"] = 
`<label slot="label">
</label>
<div
  aria-live="assertive"
  slot="error-message"
>
</div>
<textarea slot="textarea">
</textarea>
`;
/* end snapshot vaadin-text-area slots default */

snapshots["vaadin-text-area slots helper"] = 
`<label slot="label">
</label>
<div
  aria-live="assertive"
  slot="error-message"
>
</div>
<textarea slot="textarea">
</textarea>
<div slot="helper">
  Helper
</div>
`;
/* end snapshot vaadin-text-area slots helper */

