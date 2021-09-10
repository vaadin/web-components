/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-select default"] = 
`<div part="container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="indicator"
    >
    </span>
  </div>
  <vaadin-input-container part="input-field">
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="value">
    </slot>
    <div
      part="toggle-button"
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
<vaadin-select-overlay>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot vaadin-select default */

snapshots["vaadin-select disabled"] = 
`<div part="container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="indicator"
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
    <slot name="value">
    </slot>
    <div
      part="toggle-button"
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
<vaadin-select-overlay>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot vaadin-select disabled */

snapshots["vaadin-select readonly"] = 
`<div part="container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="indicator"
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
    <slot name="value">
    </slot>
    <div
      part="toggle-button"
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
<vaadin-select-overlay>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot vaadin-select readonly */

snapshots["vaadin-select invalid"] = 
`<div part="container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="indicator"
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
    <slot name="value">
    </slot>
    <div
      part="toggle-button"
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
<vaadin-select-overlay>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot vaadin-select invalid */

snapshots["vaadin-select theme"] = 
`<div part="container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="indicator"
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
    <slot name="value">
    </slot>
    <div
      part="toggle-button"
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
<vaadin-select-overlay theme="align-right">
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot vaadin-select theme */

snapshots["vaadin-select slots"] = 
`<label slot="label">
</label>
<div
  aria-live="assertive"
  slot="error-message"
>
</div>
<div slot="helper">
</div>
<vaadin-select-value-button
  aria-expanded="false"
  aria-haspopup="listbox"
  aria-required="false"
  role="button"
  slot="value"
  tabindex="0"
>
</vaadin-select-value-button>
`;
/* end snapshot vaadin-select slots */

