/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dialog host default"] = 
`<vaadin-dialog
  aria-modal="true"
  opened=""
  role="dialog"
  tabindex="0"
  with-backdrop=""
>
  <vaadin-dialog-content>
    content
  </vaadin-dialog-content>
</vaadin-dialog>
`;
/* end snapshot vaadin-dialog host default */

snapshots["vaadin-dialog host headerTitle"] = 
`<vaadin-dialog
  aria-label="Title"
  aria-modal="true"
  has-title=""
  opened=""
  role="dialog"
  tabindex="0"
  with-backdrop=""
>
  <vaadin-dialog-content>
    content
  </vaadin-dialog-content>
  <h2
    class="draggable"
    slot="title"
  >
    Title
  </h2>
</vaadin-dialog>
`;
/* end snapshot vaadin-dialog host headerTitle */

snapshots["vaadin-dialog host headerRenderer"] = 
`<vaadin-dialog
  aria-modal="true"
  has-header=""
  opened=""
  role="dialog"
  tabindex="0"
  with-backdrop=""
>
  <vaadin-dialog-content>
    content
  </vaadin-dialog-content>
  <vaadin-dialog-content slot="header-content">
    Header
  </vaadin-dialog-content>
</vaadin-dialog>
`;
/* end snapshot vaadin-dialog host headerRenderer */

snapshots["vaadin-dialog host footerRenderer"] = 
`<vaadin-dialog
  aria-modal="true"
  has-footer=""
  opened=""
  role="dialog"
  tabindex="0"
  with-backdrop=""
>
  <vaadin-dialog-content>
    content
  </vaadin-dialog-content>
  <vaadin-dialog-content slot="footer">
    Footer
  </vaadin-dialog-content>
</vaadin-dialog>
`;
/* end snapshot vaadin-dialog host footerRenderer */

snapshots["vaadin-dialog shadow default"] = 
`<vaadin-dialog-overlay
  exportparts="backdrop, overlay, header, title, header-content, content, footer"
  focus-trap=""
  id="overlay"
  opened=""
  popover="manual"
  restore-focus-on-close=""
  with-backdrop=""
>
  <slot
    name="title"
    slot="title"
  >
  </slot>
  <slot
    name="header-content"
    slot="header-content"
  >
  </slot>
  <slot
    name="footer"
    slot="footer"
  >
  </slot>
  <slot>
  </slot>
</vaadin-dialog-overlay>
`;
/* end snapshot vaadin-dialog shadow default */

snapshots["vaadin-dialog shadow modeless"] = 
`<vaadin-dialog-overlay
  exportparts="backdrop, overlay, header, title, header-content, content, footer"
  focus-trap=""
  id="overlay"
  modeless=""
  opened=""
  popover="manual"
  restore-focus-on-close=""
>
  <slot
    name="title"
    slot="title"
  >
  </slot>
  <slot
    name="header-content"
    slot="header-content"
  >
  </slot>
  <slot
    name="footer"
    slot="footer"
  >
  </slot>
  <slot>
  </slot>
</vaadin-dialog-overlay>
`;
/* end snapshot vaadin-dialog shadow modeless */

snapshots["vaadin-dialog shadow theme"] = 
`<vaadin-dialog-overlay
  exportparts="backdrop, overlay, header, title, header-content, content, footer"
  focus-trap=""
  id="overlay"
  opened=""
  popover="manual"
  restore-focus-on-close=""
  theme="custom"
  with-backdrop=""
>
  <slot
    name="title"
    slot="title"
  >
  </slot>
  <slot
    name="header-content"
    slot="header-content"
  >
  </slot>
  <slot
    name="footer"
    slot="footer"
  >
  </slot>
  <slot>
  </slot>
</vaadin-dialog-overlay>
`;
/* end snapshot vaadin-dialog shadow theme */

snapshots["vaadin-dialog shadow overlay"] = 
`<div
  id="backdrop"
  part="backdrop"
>
</div>
<div
  id="overlay"
  part="overlay"
>
  <section
    class="resizer-container"
    id="resizerContainer"
  >
    <header part="header">
      <div part="title">
        <slot name="title">
        </slot>
      </div>
      <div part="header-content">
        <slot name="header-content">
        </slot>
      </div>
    </header>
    <div
      id="content"
      part="content"
    >
      <slot>
      </slot>
    </div>
    <footer part="footer">
      <slot name="footer">
      </slot>
    </footer>
    <div class="edge n resizer">
    </div>
    <div class="e edge resizer">
    </div>
    <div class="edge resizer s">
    </div>
    <div class="edge resizer w">
    </div>
    <div class="nw resizer">
    </div>
    <div class="ne resizer">
    </div>
    <div class="resizer se">
    </div>
    <div class="resizer sw">
    </div>
  </section>
</div>
`;
/* end snapshot vaadin-dialog shadow overlay */

