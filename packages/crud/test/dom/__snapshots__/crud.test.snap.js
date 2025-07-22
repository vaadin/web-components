/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-crud host default"] =
`<vaadin-crud editor-position="">
  <vaadin-confirm-dialog
    aria-description="There are unsaved changes to this item."
    aria-label="Discard changes"
    cancel-button-visible=""
    confirm-theme="primary"
    role="alertdialog"
    slot="confirm-cancel"
    with-backdrop=""
  >
    <h3 slot="header">
      Discard changes
    </h3>
    <div>
      There are unsaved changes to this item.
    </div>
    <vaadin-button
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
      role="button"
      slot="confirm-button"
      tabindex="0"
      theme="primary"
    >
      Discard
    </vaadin-button>
  </vaadin-confirm-dialog>
  <vaadin-confirm-dialog
    aria-description="Are you sure you want to delete this item? This action cannot be undone."
    aria-label="Delete item"
    cancel-button-visible=""
    confirm-theme="primary error"
    role="alertdialog"
    slot="confirm-delete"
    with-backdrop=""
  >
    <h3 slot="header">
      Delete item
    </h3>
    <div>
      Are you sure you want to delete this item? This action cannot be undone.
    </div>
    <vaadin-button
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
      role="button"
      slot="confirm-button"
      tabindex="0"
      theme="primary error"
    >
      Delete
    </vaadin-button>
  </vaadin-confirm-dialog>
  <vaadin-crud-grid
    slot="grid"
    style="touch-action: none;"
  >
    <vaadin-grid-column-group>
      <vaadin-grid-column>
      </vaadin-grid-column>
    </vaadin-grid-column-group>
    <vaadin-grid-column-group>
      <vaadin-grid-column>
      </vaadin-grid-column>
    </vaadin-grid-column-group>
    <vaadin-crud-edit-column>
    </vaadin-crud-edit-column>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-0">
      <vaadin-grid-sorter
        aria-label="Sort by Name"
        path="name"
      >
        Name
      </vaadin-grid-sorter>
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-1">
      <vaadin-grid-sorter
        aria-label="Sort by Age"
        path="age"
      >
        Age
      </vaadin-grid-sorter>
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-2">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-3">
      <vaadin-grid-filter
        aria-label="Filter by Name"
        path="name"
        style="display: flex;"
      >
        <vaadin-text-field
          focus-target="true"
          style="width: 100%;"
          theme="small"
        >
          <label
            for="input-vaadin-text-field-6"
            id="label-vaadin-text-field-0"
            slot="label"
          >
          </label>
          <div
            hidden=""
            id="error-message-vaadin-text-field-2"
            slot="error-message"
          >
          </div>
          <input
            id="input-vaadin-text-field-6"
            slot="input"
            type="text"
          >
        </vaadin-text-field>
      </vaadin-grid-filter>
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-4">
      <vaadin-grid-filter
        aria-label="Filter by Age"
        path="age"
        style="display: flex;"
      >
        <vaadin-text-field
          focus-target="true"
          style="width: 100%;"
          theme="small"
        >
          <label
            for="input-vaadin-text-field-7"
            id="label-vaadin-text-field-3"
            slot="label"
          >
          </label>
          <div
            hidden=""
            id="error-message-vaadin-text-field-5"
            slot="error-message"
          >
          </div>
          <input
            id="input-vaadin-text-field-7"
            slot="input"
            type="text"
          >
        </vaadin-text-field>
      </vaadin-grid-filter>
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-5">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-6">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-7">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-8">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-9">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-10">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-11">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-12">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-13">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-14">
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-15">
      John
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-16">
      30
    </vaadin-grid-cell-content>
    <vaadin-grid-cell-content slot="vaadin-grid-cell-content-17">
      <vaadin-crud-edit
        aria-label="Edit"
        role="button"
        tabindex="0"
      >
      </vaadin-crud-edit>
    </vaadin-grid-cell-content>
  </vaadin-crud-grid>
  <vaadin-button
    role="button"
    slot="new-button"
    tabindex="0"
    theme="primary"
  >
    New item
  </vaadin-button>
  <h3 slot="header">
    Edit item
  </h3>
  <vaadin-crud-form slot="form">
  </vaadin-crud-form>
  <vaadin-button
    aria-disabled="true"
    disabled=""
    role="button"
    slot="save-button"
    tabindex="-1"
    theme="primary"
  >
    Save
  </vaadin-button>
  <vaadin-button
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
    slot="delete-button"
    tabindex="0"
    theme="tertiary error"
  >
    Delete...
  </vaadin-button>
</vaadin-crud>
`;
/* end snapshot vaadin-crud host default */

snapshots["vaadin-crud shadow default"] =
`<div id="container">
  <div id="main">
    <slot name="grid">
    </slot>
    <div
      id="toolbar"
      part="toolbar"
    >
      <slot name="toolbar">
      </slot>
      <slot name="new-button">
      </slot>
    </div>
  </div>
</div>
<vaadin-crud-dialog
  exportparts="backdrop, overlay, header, content, footer"
  id="dialog"
>
  <slot
    name="header"
    slot="header"
  >
  </slot>
  <slot
    name="form"
    slot="form"
  >
  </slot>
  <slot
    name="save-button"
    slot="save-button"
  >
  </slot>
  <slot
    name="cancel-button"
    slot="cancel-button"
  >
  </slot>
  <slot
    name="delete-button"
    slot="delete-button"
  >
  </slot>
</vaadin-crud-dialog>
<slot name="confirm-cancel">
</slot>
<slot name="confirm-delete">
</slot>
`;
/* end snapshot vaadin-crud shadow default */

snapshots["vaadin-crud shadow inline editor"] =
`<div id="container">
  <div id="main">
    <slot name="grid">
    </slot>
    <div
      id="toolbar"
      part="toolbar"
    >
      <slot name="toolbar">
      </slot>
      <slot name="new-button">
      </slot>
    </div>
  </div>
  <div
    aria-labelledby="header"
    hidden=""
    id="editor"
    part="editor"
    role="group"
    tabindex="0"
  >
    <div
      id="scroller"
      part="scroller"
    >
      <div
        id="header"
        part="header"
      >
        <slot name="header">
        </slot>
      </div>
      <slot name="form">
      </slot>
    </div>
    <div
      part="footer"
      role="toolbar"
    >
      <slot name="save-button">
      </slot>
      <slot name="cancel-button">
      </slot>
      <slot name="delete-button">
      </slot>
    </div>
  </div>
</div>
<slot name="confirm-cancel">
</slot>
<slot name="confirm-delete">
</slot>
`;
/* end snapshot vaadin-crud shadow inline editor */
