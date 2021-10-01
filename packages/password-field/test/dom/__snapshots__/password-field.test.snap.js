/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-password-field shadow default"] = 
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
    <slot name="input">
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow default */

snapshots["vaadin-password-field shadow disabled"] = 
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
    <slot name="input">
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow disabled */

snapshots["vaadin-password-field shadow readonly"] = 
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
    <slot name="input">
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow readonly */

snapshots["vaadin-password-field shadow invalid"] = 
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
    <slot name="input">
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow invalid */

snapshots["vaadin-password-field shadow theme"] = 
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
    <slot name="input">
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
    <div
      part="reveal-button"
      slot="suffix"
    >
      <slot name="reveal">
      </slot>
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
/* end snapshot vaadin-password-field shadow theme */

snapshots["vaadin-password-field slots default"] = 
`<label slot="label">
</label>
<div
  aria-live="assertive"
  slot="error-message"
>
</div>
<button
  aria-label="Show password"
  aria-pressed="false"
  slot="reveal"
  tabindex="0"
  type="button"
>
</button>
<input
  autocapitalize="off"
  slot="input"
  type="password"
>
`;
/* end snapshot vaadin-password-field slots default */

snapshots["vaadin-password-field slots helper"] = 
`<label slot="label">
</label>
<div
  aria-live="assertive"
  slot="error-message"
>
</div>
<button
  aria-label="Show password"
  aria-pressed="false"
  slot="reveal"
  tabindex="0"
  type="button"
>
</button>
<input
  autocapitalize="off"
  slot="input"
  type="password"
>
<div slot="helper">
  Helper
</div>
`;
/* end snapshot vaadin-password-field slots helper */

