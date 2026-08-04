/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-ai-field-marker host default"] = 
`<vaadin-ai-field-marker slot="ai-field-marker">
  <button
    aria-controls=""
    aria-describedby="vaadin-tooltip-5"
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="AI-provided value"
    id="vaadin-ai-field-marker-4"
    slot="badge"
    type="button"
  >
  </button>
  <vaadin-tooltip
    for="vaadin-ai-field-marker-4"
    modeless=""
    slot="tooltip"
  >
    <div
      id="vaadin-tooltip-5"
      role="tooltip"
      slot="overlay"
    >
      Field value modified by AI.
Click for details
    </div>
  </vaadin-tooltip>
  <p slot="message">
    This field value was modified by AI.
  </p>
  <div slot="actions">
    <button type="button">
      Revert Value
    </button>
  </div>
  <span
    id="ai-field-marker-6"
    slot="description"
  >
    This field value was modified by AI.
  </span>
</vaadin-ai-field-marker>
`;
/* end snapshot vaadin-ai-field-marker host default */

snapshots["vaadin-ai-field-marker host custom content"] = 
`<vaadin-ai-field-marker slot="ai-field-marker">
  <button
    aria-controls=""
    aria-describedby="vaadin-tooltip-5"
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="AI-provided value"
    id="vaadin-ai-field-marker-4"
    slot="badge"
    type="button"
  >
  </button>
  <vaadin-tooltip
    for="vaadin-ai-field-marker-4"
    modeless=""
    slot="tooltip"
  >
    <div
      id="vaadin-tooltip-5"
      role="tooltip"
      slot="overlay"
    >
      Field value modified by AI.
Click for details
    </div>
  </vaadin-tooltip>
  <p slot="message">
    This field value was modified by AI.
  </p>
  <div slot="actions">
    <button type="button">
      Revert Value
    </button>
  </div>
  <span
    id="ai-field-marker-6"
    slot="description"
  >
    This field value was modified by AI.
  </span>
  <div>
    Extracted from the uploaded document.
  </div>
</vaadin-ai-field-marker>
`;
/* end snapshot vaadin-ai-field-marker host custom content */

snapshots["vaadin-ai-field-marker shadow default"] = 
`<slot name="badge">
</slot>
<slot name="tooltip">
</slot>
<vaadin-popover
  aria-label="AI-provided value"
  autofocus=""
  id="vaadin-popover-7"
  modeless=""
  position="end-top"
  role="dialog"
  tabindex="0"
  theme="arrow"
>
  <slot name="message">
  </slot>
  <slot>
  </slot>
  <slot name="actions">
  </slot>
</vaadin-popover>
<slot name="description">
</slot>
`;
/* end snapshot vaadin-ai-field-marker shadow default */

