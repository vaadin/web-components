/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-slider host default"] = 
`<vaadin-slider>
  <input
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host default */

snapshots["vaadin-slider host value"] = 
`<vaadin-slider>
  <input
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host value */

snapshots["vaadin-slider host min"] = 
`<vaadin-slider>
  <input
    id="slider-3"
    max="100"
    min="20"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host min */

snapshots["vaadin-slider host max"] = 
`<vaadin-slider>
  <input
    id="slider-3"
    max="80"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host max */

snapshots["vaadin-slider host step"] = 
`<vaadin-slider>
  <input
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="10"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host step */

snapshots["vaadin-slider host disabled"] = 
`<vaadin-slider
  aria-disabled="true"
  disabled=""
>
  <input
    disabled=""
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="-1"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host disabled */

snapshots["vaadin-slider host label"] = 
`<vaadin-slider has-label="">
  <input
    aria-labelledby="label-vaadin-slider-0"
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
    Label
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host label */

snapshots["vaadin-slider host helper"] = 
`<vaadin-slider has-helper="">
  <input
    aria-describedby="helper-vaadin-slider-1"
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
  <div
    id="helper-vaadin-slider-1"
    slot="helper"
  >
    Helper
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host helper */

snapshots["vaadin-slider host required"] = 
`<vaadin-slider required="">
  <input
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    hidden=""
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host required */

snapshots["vaadin-slider host error"] = 
`<vaadin-slider
  has-error-message=""
  invalid=""
>
  <input
    aria-describedby="error-message-vaadin-slider-2"
    id="slider-3"
    max="100"
    min="0"
    slot="input"
    step="1"
    tabindex="0"
    type="range"
  >
  <label
    id="label-vaadin-slider-0"
    slot="label"
  >
  </label>
  <div
    id="error-message-vaadin-slider-2"
    slot="error-message"
  >
    Error
  </div>
</vaadin-slider>
`;
/* end snapshot vaadin-slider host error */

snapshots["vaadin-slider shadow default"] = 
`<div class="vaadin-slider-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div id="controls">
    <div part="track">
      <div
        part="track-fill"
        style="inset-inline-start:0;inset-inline-end:100%;"
      >
      </div>
    </div>
    <div
      part="thumb"
      style="inset-inline-start:calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 0 / 100);"
    >
    </div>
    <slot name="input">
    </slot>
  </div>
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
/* end snapshot vaadin-slider shadow default */

snapshots["vaadin-slider shadow value"] = 
`<div class="vaadin-slider-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div id="controls">
    <div part="track">
      <div
        part="track-fill"
        style="inset-inline: 0px 50%;"
      >
      </div>
    </div>
    <div
      part="thumb"
      style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 50 / 100);"
    >
    </div>
    <slot name="input">
    </slot>
  </div>
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
/* end snapshot vaadin-slider shadow value */

snapshots["vaadin-slider shadow min"] = 
`<div class="vaadin-slider-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div id="controls">
    <div part="track">
      <div
        part="track-fill"
        style="inset-inline: 0px 25%;"
      >
      </div>
    </div>
    <div
      part="thumb"
      style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 75 / 100);"
    >
    </div>
    <slot name="input">
    </slot>
  </div>
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
/* end snapshot vaadin-slider shadow min */

snapshots["vaadin-slider shadow max"] = 
`<div class="vaadin-slider-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div id="controls">
    <div part="track">
      <div
        part="track-fill"
        style="inset-inline: 0px 75%;"
      >
      </div>
    </div>
    <div
      part="thumb"
      style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 25 / 100);"
    >
    </div>
    <slot name="input">
    </slot>
  </div>
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
/* end snapshot vaadin-slider shadow max */

snapshots["vaadin-slider shadow step"] = 
`<div class="vaadin-slider-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <div id="controls">
    <div part="track">
      <div
        part="track-fill"
        style="inset-inline: 0px 50%;"
      >
      </div>
    </div>
    <div
      part="thumb"
      style="inset-inline-start: calc(var(--_thumb-width) / 2 + calc(100% - var(--_thumb-width)) * 50 / 100);"
    >
    </div>
    <slot name="input">
    </slot>
  </div>
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
/* end snapshot vaadin-slider shadow step */

