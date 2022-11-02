/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-upload-file shadow default"] = 
`<div part="row">
  <div part="info">
    <div
      aria-hidden="true"
      hidden=""
      part="done-icon"
    >
    </div>
    <div
      aria-hidden="true"
      hidden=""
      part="warning-icon"
    >
    </div>
    <div part="meta">
      <div
        id="name"
        part="name"
      >
        Workflow.pdf
      </div>
      <div
        id="status"
        part="status"
      >
        19.7 MB: 60% (remaining time: 00:12:34)
      </div>
      <div
        hidden=""
        id="error"
        part="error"
      >
      </div>
    </div>
  </div>
  <div part="commands">
    <button
      aria-describedby="name"
      file-event="file-start"
      hidden=""
      part="start-button"
      type="button"
    >
    </button>
    <button
      aria-describedby="name"
      file-event="file-retry"
      hidden=""
      part="retry-button"
      type="button"
    >
    </button>
    <button
      aria-describedby="name"
      file-event="file-abort"
      part="remove-button"
      type="button"
    >
    </button>
  </div>
</div>
<slot name="progress">
</slot>
`;
/* end snapshot vaadin-upload-file shadow default */

