/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host default */

snapshots["vaadin-pdf-viewer host error"] = 
`<vaadin-pdf-viewer has-error="">
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host error */

snapshots["vaadin-pdf-viewer shadow default"] = 
`<div
  id="content"
  part="content"
>
  <div id="pages">
  </div>
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow default */

snapshots["vaadin-pdf-viewer shadow document"] = 
`<div
  id="content"
  part="content"
>
  <div id="pages">
    <div part="page">
      <canvas aria-hidden="true">
      </canvas>
    </div>
  </div>
</div>
<div
  hidden=""
  part="error-message"
>
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow document */

snapshots["vaadin-pdf-viewer shadow error"] = 
`<div
  id="content"
  part="content"
>
  <div id="pages">
  </div>
</div>
<div part="error-message">
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow error */

