/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-upload-button host default"] = 
`<vaadin-upload-button
  role="button"
  tabindex="0"
>
  Upload
</vaadin-upload-button>
`;
/* end snapshot vaadin-upload-button host default */

snapshots["vaadin-upload-button host disabled"] = 
`<vaadin-upload-button
  aria-disabled="true"
  disabled=""
  role="button"
  tabindex="-1"
>
  Upload
</vaadin-upload-button>
`;
/* end snapshot vaadin-upload-button host disabled */

snapshots["vaadin-upload-button host max-files-reached"] = 
`<vaadin-upload-button
  max-files-reached=""
  role="button"
  tabindex="0"
>
  Upload
</vaadin-upload-button>
`;
/* end snapshot vaadin-upload-button host max-files-reached */

snapshots["vaadin-upload-button host focused"] = 
`<vaadin-upload-button
  focused=""
  role="button"
  tabindex="0"
>
  Upload
</vaadin-upload-button>
`;
/* end snapshot vaadin-upload-button host focused */

snapshots["vaadin-upload-button host focus-ring"] = 
`<vaadin-upload-button
  focus-ring=""
  focused=""
  role="button"
  tabindex="0"
>
  Upload
</vaadin-upload-button>
`;
/* end snapshot vaadin-upload-button host focus-ring */

snapshots["vaadin-upload-button host active"] = 
`<vaadin-upload-button
  active=""
  role="button"
  tabindex="0"
>
  Upload
</vaadin-upload-button>
`;
/* end snapshot vaadin-upload-button host active */

snapshots["vaadin-upload-button shadow default"] = 
`<div class="vaadin-button-container">
  <span
    aria-hidden="true"
    part="prefix"
  >
    <slot name="prefix">
    </slot>
  </span>
  <span part="label">
    <slot>
      Upload Files...
    </slot>
  </span>
  <span
    aria-hidden="true"
    part="suffix"
  >
    <slot name="suffix">
    </slot>
  </span>
</div>
<slot name="tooltip">
</slot>
<input
  hidden=""
  id="fileInput"
  type="file"
>
`;
/* end snapshot vaadin-upload-button shadow default */

