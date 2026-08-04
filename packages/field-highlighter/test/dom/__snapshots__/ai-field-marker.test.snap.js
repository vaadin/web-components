/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-ai-field-marker host default"] = 
`<vaadin-ai-field-marker slot="ai-field-marker">
  <button
    aria-controls="vaadin-popover-6"
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
  <vaadin-popover
    aria-label="AI-provided value"
    for="vaadin-ai-field-marker-4"
    id="vaadin-popover-6"
    modeless=""
    role="dialog"
    slot="popover"
    tabindex="0"
    theme="arrow"
  >
    <p class="message">
      This field value was modified by AI.
    </p>
    <div class="actions">
      <button type="button">
        Revert Value
      </button>
    </div>
  </vaadin-popover>
  <span
    id="ai-field-marker-7"
    slot="description"
  >
    This field value was modified by AI.
  </span>
</vaadin-ai-field-marker>
`;
/* end snapshot vaadin-ai-field-marker host default */

snapshots["vaadin-ai-field-marker shadow default"] = 
`<slot name="badge">
</slot>
<slot name="tooltip">
</slot>
<slot name="popover">
</slot>
<slot name="description">
</slot>
`;
/* end snapshot vaadin-ai-field-marker shadow default */

