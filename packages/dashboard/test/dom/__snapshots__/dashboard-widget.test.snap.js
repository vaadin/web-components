/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dashboard-widget host"] = 
`<vaadin-dashboard-widget role="article">
</vaadin-dashboard-widget>
`;
/* end snapshot vaadin-dashboard-widget host */

snapshots["vaadin-dashboard-widget shadow"] = 
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
<div
  class="mode-controls"
  hidden=""
  id="resize-controls"
>
  <vaadin-dashboard-button
    aria-label="Apply"
    id="resize-apply"
    part="resize-apply-button"
    role="button"
    tabindex="0"
    theme="primary icon large"
    title="Apply"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
  <vaadin-dashboard-button
    aria-label="Shrink width"
    hidden=""
    id="resize-shrink-width"
    part="resize-shrink-width-button"
    role="button"
    tabindex="0"
    theme="primary icon"
    title="Shrink width"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
  <vaadin-dashboard-button
    aria-label="Grow width"
    hidden=""
    id="resize-grow-width"
    part="resize-grow-width-button"
    role="button"
    tabindex="0"
    theme="primary icon"
    title="Grow width"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
  <vaadin-dashboard-button
    aria-label="Shrink height"
    hidden=""
    id="resize-shrink-height"
    part="resize-shrink-height-button"
    role="button"
    tabindex="0"
    theme="primary icon"
    title="Shrink height"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
  <vaadin-dashboard-button
    aria-label="Grow height"
    id="resize-grow-height"
    part="resize-grow-height-button"
    role="button"
    tabindex="0"
    theme="primary icon"
    title="Grow height"
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
      aria-label="Select widget for editing"
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
    <slot name="header-content">
    </slot>
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
  <vaadin-dashboard-button
    aria-label="Resize"
    class="resize-handle"
    id="resize-handle"
    part="resize-button"
    role="button"
    tabindex="-1"
    theme="icon tertiary"
    title="Resize"
  >
    <div class="icon">
    </div>
  </vaadin-dashboard-button>
</div>
<div
  id="content"
  part="content"
>
  <slot>
  </slot>
</div>
`;
/* end snapshot vaadin-dashboard-widget shadow */

