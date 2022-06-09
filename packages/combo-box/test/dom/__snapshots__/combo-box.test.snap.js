/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-combo-box host placeholder"] = 
`<vaadin-combo-box placeholder="Placeholder">
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    id="input-vaadin-combo-box-4"
    placeholder="Placeholder"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label
    for="input-vaadin-combo-box-4"
    id="label-vaadin-combo-box-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-combo-box-2"
    slot="error-message"
  >
  </div>
</vaadin-combo-box>
`;
/* end snapshot vaadin-combo-box host placeholder */

snapshots["vaadin-combo-box host pattern"] = 
`<vaadin-combo-box>
  <input
    aria-autocomplete="list"
    aria-expanded="false"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    id="input-vaadin-combo-box-4"
    pattern="[0-9]*"
    role="combobox"
    slot="input"
    spellcheck="false"
  >
  <label
    for="input-vaadin-combo-box-4"
    id="label-vaadin-combo-box-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-combo-box-2"
    slot="error-message"
  >
  </div>
</vaadin-combo-box>
`;
/* end snapshot vaadin-combo-box host pattern */

snapshots["vaadin-combo-box shadow default"] = 
`<div class="vaadin-combo-box-container">
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
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      id="toggleButton"
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
<vaadin-combo-box-overlay
  hidden=""
  id="overlay"
  no-vertical-overlap=""
>
  <vaadin-combo-box-scroller
    aria-setsize="0"
    id="vaadin-combo-box-scroller-3"
    role="listbox"
  >
  </vaadin-combo-box-scroller>
</vaadin-combo-box-overlay>
`;
/* end snapshot vaadin-combo-box shadow default */

snapshots["vaadin-combo-box shadow disabled"] = 
`<div class="vaadin-combo-box-container">
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
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      id="toggleButton"
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
<vaadin-combo-box-overlay
  hidden=""
  id="overlay"
  no-vertical-overlap=""
>
  <vaadin-combo-box-scroller
    aria-setsize="0"
    id="vaadin-combo-box-scroller-3"
    role="listbox"
  >
  </vaadin-combo-box-scroller>
</vaadin-combo-box-overlay>
`;
/* end snapshot vaadin-combo-box shadow disabled */

snapshots["vaadin-combo-box shadow readonly"] = 
`<div class="vaadin-combo-box-container">
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
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      id="toggleButton"
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
<vaadin-combo-box-overlay
  hidden=""
  id="overlay"
  no-vertical-overlap=""
>
  <vaadin-combo-box-scroller
    aria-setsize="0"
    id="vaadin-combo-box-scroller-3"
    role="listbox"
  >
  </vaadin-combo-box-scroller>
</vaadin-combo-box-overlay>
`;
/* end snapshot vaadin-combo-box shadow readonly */

snapshots["vaadin-combo-box shadow invalid"] = 
`<div class="vaadin-combo-box-container">
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
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      id="toggleButton"
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
<vaadin-combo-box-overlay
  hidden=""
  id="overlay"
  no-vertical-overlap=""
>
  <vaadin-combo-box-scroller
    aria-setsize="0"
    id="vaadin-combo-box-scroller-3"
    role="listbox"
  >
  </vaadin-combo-box-scroller>
</vaadin-combo-box-overlay>
`;
/* end snapshot vaadin-combo-box shadow invalid */

snapshots["vaadin-combo-box shadow theme"] = 
`<div class="vaadin-combo-box-container">
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
      id="clearButton"
      part="clear-button"
      slot="suffix"
    >
    </div>
    <div
      aria-hidden="true"
      id="toggleButton"
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
<vaadin-combo-box-overlay
  hidden=""
  id="overlay"
  no-vertical-overlap=""
  theme="align-right"
>
  <vaadin-combo-box-scroller
    aria-setsize="0"
    id="vaadin-combo-box-scroller-3"
    role="listbox"
  >
  </vaadin-combo-box-scroller>
</vaadin-combo-box-overlay>
`;
/* end snapshot vaadin-combo-box shadow theme */

snapshots["vaadin-combo-box slots default"] = 
`<input
  aria-autocomplete="list"
  aria-expanded="false"
  autocapitalize="off"
  autocomplete="off"
  autocorrect="off"
  id="input-vaadin-combo-box-4"
  role="combobox"
  slot="input"
  spellcheck="false"
>
<label
  for="input-vaadin-combo-box-4"
  id="label-vaadin-combo-box-0"
  slot="label"
>
</label>
<div
  hidden=""
  id="error-message-vaadin-combo-box-2"
  slot="error-message"
>
</div>
`;
/* end snapshot vaadin-combo-box slots default */

snapshots["vaadin-combo-box slots label"] = 
`<input
  aria-autocomplete="list"
  aria-expanded="false"
  aria-labelledby="label-vaadin-combo-box-0"
  autocapitalize="off"
  autocomplete="off"
  autocorrect="off"
  id="input-vaadin-combo-box-4"
  role="combobox"
  slot="input"
  spellcheck="false"
>
<label
  for="input-vaadin-combo-box-4"
  id="label-vaadin-combo-box-0"
  slot="label"
>
  Label
</label>
<div
  hidden=""
  id="error-message-vaadin-combo-box-2"
  slot="error-message"
>
</div>
`;
/* end snapshot vaadin-combo-box slots label */

snapshots["vaadin-combo-box slots helper"] = 
`<input
  aria-autocomplete="list"
  aria-describedby="helper-vaadin-combo-box-1"
  aria-expanded="false"
  autocapitalize="off"
  autocomplete="off"
  autocorrect="off"
  id="input-vaadin-combo-box-4"
  role="combobox"
  slot="input"
  spellcheck="false"
>
<label
  for="input-vaadin-combo-box-4"
  id="label-vaadin-combo-box-0"
  slot="label"
>
</label>
<div
  hidden=""
  id="error-message-vaadin-combo-box-2"
  slot="error-message"
>
</div>
<div
  id="helper-vaadin-combo-box-1"
  slot="helper"
>
  Helper
</div>
`;
/* end snapshot vaadin-combo-box slots helper */

snapshots["vaadin-combo-box slots error"] = 
`<input
  aria-autocomplete="list"
  aria-expanded="false"
  aria-invalid="true"
  autocapitalize="off"
  autocomplete="off"
  autocorrect="off"
  id="input-vaadin-combo-box-4"
  invalid=""
  role="combobox"
  slot="input"
  spellcheck="false"
>
<label
  for="input-vaadin-combo-box-4"
  id="label-vaadin-combo-box-0"
  slot="label"
>
</label>
<div
  id="error-message-vaadin-combo-box-2"
  role="alert"
  slot="error-message"
>
  Error
</div>
`;
/* end snapshot vaadin-combo-box slots error */

