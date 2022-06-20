/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-select host default"] = 
`<vaadin-select>
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    role="button"
    slot="value"
    tabindex="0"
  >
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host default */

snapshots["vaadin-select host label"] = 
`<vaadin-select has-label="">
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    role="button"
    slot="value"
    tabindex="0"
  >
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host label */

snapshots["vaadin-select host disabled"] = 
`<vaadin-select
  aria-disabled="true"
  disabled=""
>
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-disabled="true"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    disabled=""
    role="button"
    slot="value"
    tabindex="-1"
  >
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host disabled */

snapshots["vaadin-select host required"] = 
`<vaadin-select required="">
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="true"
    role="button"
    slot="value"
    tabindex="0"
  >
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host required */

snapshots["vaadin-select host value"] = 
`<vaadin-select has-value="">
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    role="button"
    slot="value"
    tabindex="0"
  >
    <vaadin-select-item
      aria-selected="true"
      id="vaadin-select-3"
      selected=""
    >
      Option 1
    </vaadin-select-item>
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host value */

snapshots["vaadin-select host helper"] = 
`<vaadin-select has-helper="">
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-describedby="helper-vaadin-select-1"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    role="button"
    slot="value"
    tabindex="0"
  >
  </vaadin-select-value-button>
  <div
    id="helper-vaadin-select-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-select>
`;
/* end snapshot vaadin-select host helper */

snapshots["vaadin-select host error"] = 
`<vaadin-select
  has-error-message=""
  invalid=""
>
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-select-2"
    role="alert"
    slot="error-message"
  >
    Error
  </div>
  <vaadin-select-value-button
    aria-describedby="error-message-vaadin-select-2"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    role="button"
    slot="value"
    tabindex="0"
  >
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host error */

snapshots["vaadin-select host opened default"] = 
`<vaadin-select opened="">
  <label
    id="label-vaadin-select-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-select-2"
    slot="error-message"
  >
  </div>
  <vaadin-select-value-button
    aria-expanded="true"
    aria-haspopup="listbox"
    aria-labelledby="label-vaadin-select-0 vaadin-select-3"
    aria-required="false"
    role="button"
    slot="value"
    tabindex="0"
  >
  </vaadin-select-value-button>
</vaadin-select>
`;
/* end snapshot vaadin-select host opened default */

snapshots["vaadin-select host opened overlay"] = 
`<vaadin-select-overlay
  dir="ltr"
  opened=""
  start-aligned=""
  top-aligned=""
>
  <vaadin-select-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-select-item
      aria-selected="false"
      focus-ring=""
      focused=""
      role="option"
      tabindex="0"
    >
      Option 1
    </vaadin-select-item>
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Option 2
    </vaadin-select-item>
  </vaadin-select-list-box>
</vaadin-select-overlay>
`;
/* end snapshot vaadin-select host opened overlay */

snapshots["vaadin-select shadow default"] = 
`<div class="vaadin-select-container">
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
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
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
  <vaadin-select-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="0"
    >
      Option 1
    </vaadin-select-item>
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Option 2
    </vaadin-select-item>
  </vaadin-select-list-box>
</vaadin-select-overlay>
`;
/* end snapshot vaadin-select shadow default */

snapshots["vaadin-select shadow disabled"] = 
`<div class="vaadin-select-container">
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
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
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
  <vaadin-select-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="0"
    >
      Option 1
    </vaadin-select-item>
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Option 2
    </vaadin-select-item>
  </vaadin-select-list-box>
</vaadin-select-overlay>
`;
/* end snapshot vaadin-select shadow disabled */

snapshots["vaadin-select shadow readonly"] = 
`<div class="vaadin-select-container">
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
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
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
  <vaadin-select-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="0"
    >
      Option 1
    </vaadin-select-item>
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Option 2
    </vaadin-select-item>
  </vaadin-select-list-box>
</vaadin-select-overlay>
`;
/* end snapshot vaadin-select shadow readonly */

snapshots["vaadin-select shadow invalid"] = 
`<div class="vaadin-select-container">
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
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
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
  <vaadin-select-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="0"
    >
      Option 1
    </vaadin-select-item>
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Option 2
    </vaadin-select-item>
  </vaadin-select-list-box>
</vaadin-select-overlay>
`;
/* end snapshot vaadin-select shadow invalid */

snapshots["vaadin-select shadow theme"] = 
`<div class="vaadin-select-container">
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
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
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
  <vaadin-select-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="0"
    >
      Option 1
    </vaadin-select-item>
    <vaadin-select-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Option 2
    </vaadin-select-item>
  </vaadin-select-list-box>
</vaadin-select-overlay>
`;
/* end snapshot vaadin-select shadow theme */

