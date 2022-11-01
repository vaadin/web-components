/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-upload host default"] = 
`<vaadin-upload>
  <vaadin-button
    role="button"
    slot="add-button"
    tabindex="0"
  >
    Upload Files...
  </vaadin-button>
  <span slot="drop-label">
    Drop files here
  </span>
  <vaadin-upload-icon slot="drop-label-icon">
  </vaadin-upload-icon>
</vaadin-upload>
`;
/* end snapshot vaadin-upload host default */

snapshots["vaadin-upload host max files"] = 
`<vaadin-upload max-files-reached="">
  <vaadin-button
    aria-disabled="true"
    disabled=""
    role="button"
    slot="add-button"
    tabindex="-1"
  >
    Upload File...
  </vaadin-button>
  <span slot="drop-label">
    Drop file here
  </span>
  <vaadin-upload-icon slot="drop-label-icon">
  </vaadin-upload-icon>
</vaadin-upload>
`;
/* end snapshot vaadin-upload host max files */

snapshots["vaadin-upload shadow default"] = 
`<div part="primary-buttons">
  <slot name="add-button">
  </slot>
  <div
    aria-hidden="true"
    id="dropLabelContainer"
    part="drop-label"
  >
    <slot name="drop-label-icon">
    </slot>
    <slot name="drop-label">
    </slot>
  </div>
</div>
<slot name="file-list">
  <ul
    id="fileList"
    part="file-list"
  >
    <li>
      <vaadin-upload-file
        complete=""
        tabindex="0"
      >
        <vaadin-progress-bar
          aria-valuemax="1"
          aria-valuemin="0"
          aria-valuenow="0"
          role="progressbar"
          slot="progress"
          style="--vaadin-progress-value:0;"
        >
        </vaadin-progress-bar>
      </vaadin-upload-file>
    </li>
    <li>
      <vaadin-upload-file tabindex="0">
        <vaadin-progress-bar
          aria-valuemax="1"
          aria-valuemin="0"
          aria-valuenow="0.6"
          role="progressbar"
          slot="progress"
          style="--vaadin-progress-value:0.6;"
        >
        </vaadin-progress-bar>
      </vaadin-upload-file>
    </li>
    <li>
      <vaadin-upload-file
        error=""
        tabindex="0"
      >
        <vaadin-progress-bar
          aria-valuemax="1"
          aria-valuemin="0"
          aria-valuenow="0"
          role="progressbar"
          slot="progress"
          style="--vaadin-progress-value:0;"
        >
        </vaadin-progress-bar>
      </vaadin-upload-file>
    </li>
    <dom-repeat
      as="file"
      style="display: none;"
    >
      <template is="dom-repeat">
      </template>
    </dom-repeat>
  </ul>
</slot>
<slot>
</slot>
<input
  accept=""
  hidden=""
  id="fileInput"
  multiple=""
  type="file"
>
`;
/* end snapshot vaadin-upload shadow default */

