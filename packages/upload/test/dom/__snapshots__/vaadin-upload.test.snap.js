/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-upload shadow default"] = 
`<div part="primary-buttons">
  <div id="addFiles">
    <slot name="add-button">
      <vaadin-button
        id="addButton"
        part="upload-button"
        role="button"
        tabindex="0"
      >
        Upload Files...
      </vaadin-button>
    </slot>
  </div>
  <div
    aria-hidden="true"
    id="dropLabelContainer"
    part="drop-label"
  >
    <slot name="drop-label-icon">
      <div part="drop-label-icon">
      </div>
    </slot>
    <slot
      id="dropLabel"
      name="drop-label"
    >
      Drop files here
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
      </vaadin-upload-file>
    </li>
    <li>
      <vaadin-upload-file tabindex="0">
      </vaadin-upload-file>
    </li>
    <li>
      <vaadin-upload-file
        error=""
        tabindex="0"
      >
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

