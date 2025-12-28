/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dashboard-section host"] = 
`<vaadin-dashboard-section role="region">
</vaadin-dashboard-section>
`;
/* end snapshot vaadin-dashboard-section host */

snapshots["vaadin-dashboard-section shadow"] = 
`<div
  class="mode-controls"
  hidden=""
  id="move-controls"
>
  <vaadin-dashboard-button
    aria-label="Move Backward"
    id="move-backward"
    part="move-backward-button"
    role="button"
    tabindex="0"
    theme="primary icon"
    title="Move Backward"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
  <vaadin-dashboard-button
    aria-label="Apply"
    id="move-apply"
    part="move-apply-button"
    role="button"
    tabindex="0"
    theme="primary icon large"
    title="Apply"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
  <vaadin-dashboard-button
    aria-label="Move Forward"
    id="move-forward"
    part="move-forward-button"
    role="button"
    tabindex="0"
    theme="primary icon"
    title="Move Forward"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
</div>
<div id="focustrap">
  <label
    class="drag-handle"
    draggable="true"
    id="focus-button-wrapper"
  >
    <button
      aria-describedby="title"
      aria-label="Select section for editing"
      aria-pressed="false"
      id="focus-button"
    >
    </button>
  </label>
  <header part="header">
    <vaadin-dashboard-button
      aria-label="Move"
      class="drag-handle"
      draggable="true"
      id="drag-handle"
      part="move-button"
      role="button"
      tabindex="-1"
      theme="icon tertiary"
      title="Move"
    >
      <div class="icon">
      </div>
    </vaadin-dashboard-button>
    <div
      aria-level="2"
      id="title"
      part="title"
      role="heading"
    >
      Custom title
    </div>
    <vaadin-dashboard-button
      aria-label="Remove"
      id="remove-button"
      part="remove-button"
      role="button"
      tabindex="-1"
      theme="icon tertiary"
      title="Remove"
    >
      <div class="icon">
      </div>
    </vaadin-dashboard-button>
  </header>
</div>
<slot>
</slot>
`;
/* end snapshot vaadin-dashboard-section shadow */

