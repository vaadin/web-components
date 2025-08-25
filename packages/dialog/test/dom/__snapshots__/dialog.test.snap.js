/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dialog host"] = 
`<vaadin-dialog
  aria-modal="true"
  opened=""
  role="dialog"
  tabindex="0"
  with-backdrop=""
>
  content
</vaadin-dialog>
`;
/* end snapshot vaadin-dialog host */

snapshots["vaadin-dialog shadow"] = 
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
/* end snapshot vaadin-dialog shadow */

snapshots["vaadin-dialog modeless"] = 
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
/* end snapshot vaadin-dialog modeless */

snapshots["vaadin-dialog theme"] = 
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
/* end snapshot vaadin-dialog theme */

snapshots["vaadin-dialog overlay"] = 
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
/* end snapshot vaadin-dialog overlay */

