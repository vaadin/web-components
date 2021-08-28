/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-rich-text-editor default"] = 
`<div class="vaadin-rich-text-editor-container">
  <div
    class="ql-toolbar"
    part="toolbar"
  >
    <span part="toolbar-group toolbar-group-history">
      <button
        part="toolbar-button toolbar-button-undo"
        title="undo"
        type="button"
      >
      </button>
      <button
        part="toolbar-button toolbar-button-redo"
        tabindex="-1"
        title="redo"
        type="button"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-emphasis">
      <button
        class="ql-bold"
        part="toolbar-button toolbar-button-bold"
        tabindex="-1"
        title="bold"
        type="button"
      >
      </button>
      <button
        class="ql-italic"
        part="toolbar-button toolbar-button-italic"
        tabindex="-1"
        title="italic"
        type="button"
      >
      </button>
      <button
        class="ql-underline"
        part="toolbar-button toolbar-button-underline"
        tabindex="-1"
        title="underline"
        type="button"
      >
      </button>
      <button
        class="ql-strike"
        part="toolbar-button toolbar-button-strike"
        tabindex="-1"
        title="strike"
        type="button"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-heading">
      <button
        class="ql-header"
        part="toolbar-button toolbar-button-h1"
        tabindex="-1"
        title="h1"
        type="button"
        value="1"
      >
      </button>
      <button
        class="ql-header"
        part="toolbar-button toolbar-button-h2"
        tabindex="-1"
        title="h2"
        type="button"
        value="2"
      >
      </button>
      <button
        class="ql-header"
        part="toolbar-button toolbar-button-h3"
        tabindex="-1"
        title="h3"
        type="button"
        value="3"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-glyph-transformation">
      <button
        class="ql-script"
        part="toolbar-button toolbar-button-subscript"
        tabindex="-1"
        title="subscript"
        type="button"
        value="sub"
      >
      </button>
      <button
        class="ql-script"
        part="toolbar-button toolbar-button-superscript"
        tabindex="-1"
        title="superscript"
        type="button"
        value="super"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-list">
      <button
        class="ql-list"
        part="toolbar-button toolbar-button-list-ordered"
        tabindex="-1"
        title="list ordered"
        type="button"
        value="ordered"
      >
      </button>
      <button
        class="ql-list"
        part="toolbar-button toolbar-button-list-bullet"
        tabindex="-1"
        title="list bullet"
        type="button"
        value="bullet"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-alignment">
      <button
        class="ql-align"
        part="toolbar-button toolbar-button-align-left"
        tabindex="-1"
        title="align left"
        type="button"
        value=""
      >
      </button>
      <button
        class="ql-align"
        part="toolbar-button toolbar-button-align-center"
        tabindex="-1"
        title="align center"
        type="button"
        value="center"
      >
      </button>
      <button
        class="ql-align"
        part="toolbar-button toolbar-button-align-right"
        tabindex="-1"
        title="align right"
        type="button"
        value="right"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-rich-text">
      <button
        part="toolbar-button toolbar-button-image"
        tabindex="-1"
        title="image"
        type="button"
      >
      </button>
      <button
        part="toolbar-button toolbar-button-link"
        tabindex="-1"
        title="link"
        type="button"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-block">
      <button
        class="ql-blockquote"
        part="toolbar-button toolbar-button-blockquote"
        tabindex="-1"
        title="blockquote"
        type="button"
      >
      </button>
      <button
        class="ql-code-block"
        part="toolbar-button toolbar-button-code-block"
        tabindex="-1"
        title="code block"
        type="button"
      >
      </button>
    </span>
    <span part="toolbar-group toolbar-group-format">
      <button
        class="ql-clean"
        part="toolbar-button toolbar-button-clean"
        tabindex="-1"
        title="clean"
        type="button"
      >
      </button>
    </span>
    <input
      accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
      id="fileInput"
      type="file"
    >
  </div>
  <div
    class="ql-container"
    part="content"
  >
    <div
      aria-multiline="true"
      class="ql-blank ql-editor"
      contenteditable="true"
      data-gramm="false"
      role="textbox"
    >
      <p>
        <br>
      </p>
    </div>
    <div
      class="ql-clipboard"
      contenteditable="true"
      tabindex="-1"
    >
    </div>
  </div>
  <div
    aria-live="polite"
    class="announcer"
  >
  </div>
</div>
<vaadin-confirm-dialog id="linkDialog">
  <vaadin-text-field
    id="linkUrl"
    style="width: 100%;"
    tabindex="0"
  >
  </vaadin-text-field>
  <vaadin-button
    id="confirmLink"
    role="button"
    slot="confirm-button"
    tabindex="0"
    theme="primary"
  >
    OK
  </vaadin-button>
  <vaadin-button
    hidden=""
    id="removeLink"
    role="button"
    slot="reject-button"
    tabindex="0"
    theme="error"
  >
    Remove
  </vaadin-button>
  <vaadin-button
    id="cancelLink"
    role="button"
    slot="cancel-button"
    tabindex="0"
  >
    Cancel
  </vaadin-button>
</vaadin-confirm-dialog>
`;
/* end snapshot vaadin-rich-text-editor default */

