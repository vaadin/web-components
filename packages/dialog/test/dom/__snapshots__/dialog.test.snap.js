/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dialog host"] =
`<vaadin-dialog
  opened=""
  role="dialog"
  with-backdrop=""
>
  content
</vaadin-dialog>
`;
/* end snapshot vaadin-dialog host */

snapshots["vaadin-dialog overlay"] =
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
/* end snapshot vaadin-dialog overlay */

snapshots["vaadin-dialog overlay modeless"] =
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
/* end snapshot vaadin-dialog overlay modeless */

snapshots["vaadin-dialog overlay theme"] =
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
/* end snapshot vaadin-dialog overlay theme */
