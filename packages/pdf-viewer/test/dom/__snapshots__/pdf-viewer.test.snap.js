/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host default */

snapshots["vaadin-pdf-viewer host loading"] = 
`<vaadin-pdf-viewer loading="">
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host loading */

snapshots["vaadin-pdf-viewer host error"] = 
`<vaadin-pdf-viewer has-error="">
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host error */

snapshots["vaadin-pdf-viewer shadow default"] = 
`<div part="loader">
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow default */

snapshots["vaadin-pdf-viewer shadow error"] = 
`<div part="loader">
</div>
<div part="error-message">
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow error */

snapshots["vaadin-pdf-viewer shadow password error"] = 
`<div part="loader">
</div>
<div part="error-message">
  Password-protected documents are not supported.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow password error */

