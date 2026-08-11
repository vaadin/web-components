/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-ai-field-marker host default"] = 
`<vaadin-ai-field-marker slot="ai-field-marker">
  <span
    class="description sr-only"
    id="ai-field-marker-5"
  >
    This field value was modified by AI.
  </span>
  <button
    aria-controls="vaadin-popover-7"
    aria-describedby="vaadin-tooltip-6"
    aria-expanded="false"
    aria-haspopup="dialog"
    aria-label="AI-provided value"
    class="badge"
    id="vaadin-ai-field-marker-4"
    tabindex="0"
    type="button"
  >
  </button>
  <vaadin-tooltip
    for="vaadin-ai-field-marker-4"
    modeless=""
    text="Field value modified by AI.
Click for details"
  >
    <div
      id="vaadin-tooltip-6"
      role="tooltip"
      slot="overlay"
    >
      Field value modified by AI.
Click for details
    </div>
  </vaadin-tooltip>
  <vaadin-popover
    aria-label="AI-provided value"
    autofocus=""
    for="vaadin-ai-field-marker-4"
    id="vaadin-popover-7"
    modeless=""
    position="end-top"
    role="dialog"
    tabindex="0"
    theme="arrow"
  >
    <p class="message">
      This field value was modified by AI.
    </p>
    <div class="actions">
      <button
        tabindex="0"
        type="button"
      >
        Revert Value
      </button>
    </div>
  </vaadin-popover>
</vaadin-ai-field-marker>
`;
/* end snapshot vaadin-ai-field-marker host default */

snapshots["vaadin-ai-field-marker host unmarked"] = 
`<vaadin-ai-field-marker slot="ai-field-marker">
</vaadin-ai-field-marker>
`;
/* end snapshot vaadin-ai-field-marker host unmarked */

