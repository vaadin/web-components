/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-confirm-dialog host"] = 
`<vaadin-confirm-dialog
  aria-description="Do you want to save or discard the changes?"
  aria-label="Unsaved changes"
  header="Unsaved changes"
  opened=""
  role="alertdialog"
  with-backdrop=""
>
  Do you want to save or discard the changes?
  <h3 slot="header">
    Unsaved changes
  </h3>
  <vaadin-button
    hidden=""
    role="button"
    slot="cancel-button"
    tabindex="0"
    theme="tertiary"
  >
    Cancel
  </vaadin-button>
  <vaadin-button
    hidden=""
    role="button"
    slot="reject-button"
    tabindex="0"
    theme="error tertiary"
  >
    Reject
  </vaadin-button>
  <vaadin-button
    focused=""
    role="button"
    slot="confirm-button"
    tabindex="0"
    theme="primary"
  >
    Confirm
  </vaadin-button>
</vaadin-confirm-dialog>
`;
/* end snapshot vaadin-confirm-dialog host */

snapshots["vaadin-confirm-dialog shadow"] = 
`<vaadin-confirm-dialog-overlay
  exportparts="backdrop, overlay, header, content, message, footer, cancel-button, confirm-button, reject-button"
  focus-trap=""
  has-footer=""
  has-header=""
  id="overlay"
  opened=""
  popover="manual"
  restore-focus-on-close=""
  with-backdrop=""
>
  <slot
    name="header"
    slot="header"
  >
  </slot>
  <slot>
  </slot>
  <slot
    name="cancel-button"
    slot="cancel-button"
  >
  </slot>
  <slot
    name="reject-button"
    slot="reject-button"
  >
  </slot>
  <slot
    name="confirm-button"
    slot="confirm-button"
  >
  </slot>
</vaadin-confirm-dialog-overlay>
`;
/* end snapshot vaadin-confirm-dialog shadow */

snapshots["vaadin-confirm-dialog theme"] = 
`<vaadin-confirm-dialog-overlay
  exportparts="backdrop, overlay, header, content, message, footer, cancel-button, confirm-button, reject-button"
  focus-trap=""
  has-footer=""
  has-header=""
  id="overlay"
  opened=""
  popover="manual"
  restore-focus-on-close=""
  theme="custom"
  with-backdrop=""
>
  <slot
    name="header"
    slot="header"
  >
  </slot>
  <slot>
  </slot>
  <slot
    name="cancel-button"
    slot="cancel-button"
  >
  </slot>
  <slot
    name="reject-button"
    slot="reject-button"
  >
  </slot>
  <slot
    name="confirm-button"
    slot="confirm-button"
  >
  </slot>
</vaadin-confirm-dialog-overlay>
`;
/* end snapshot vaadin-confirm-dialog theme */

snapshots["vaadin-confirm-dialog overlay"] = 
`<div
  id="backdrop"
  part="backdrop"
>
</div>
<div
  id="overlay"
  part="overlay"
  tabindex="0"
>
  <header part="header">
    <slot name="header">
    </slot>
  </header>
  <div
    id="content"
    part="content"
  >
    <div part="message">
      <slot>
      </slot>
    </div>
  </div>
  <footer
    part="footer"
    role="toolbar"
  >
    <div
      hidden=""
      part="cancel-button"
    >
      <slot name="cancel-button">
      </slot>
    </div>
    <div
      hidden=""
      part="reject-button"
    >
      <slot name="reject-button">
      </slot>
    </div>
    <div part="confirm-button">
      <slot name="confirm-button">
      </slot>
    </div>
  </footer>
</div>
`;
/* end snapshot vaadin-confirm-dialog overlay */

