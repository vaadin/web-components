/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-pdf-viewer host default"] = 
`<vaadin-pdf-viewer role="region">
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host default */

snapshots["vaadin-pdf-viewer host loading"] = 
`<vaadin-pdf-viewer
  loading=""
  role="region"
>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host loading */

snapshots["vaadin-pdf-viewer host error"] = 
`<vaadin-pdf-viewer
  has-error=""
  role="region"
>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host error */

snapshots["vaadin-pdf-viewer shadow default"] = 
`<div part="loader">
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-label="Pages"
    id="content"
    part="content"
    role="document"
    tabindex="-1"
  >
    <div id="pages">
    </div>
  </div>
  <div class="content-focus-ring">
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

snapshots["vaadin-pdf-viewer shadow error"] = 
`<div part="loader">
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-label="Pages"
    id="content"
    part="content"
    role="document"
    tabindex="-1"
  >
    <div id="pages">
    </div>
  </div>
  <div class="content-focus-ring">
  </div>
</div>
<div part="error-message">
  The document could not be loaded.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow error */

snapshots["vaadin-pdf-viewer shadow password error"] = 
`<div part="loader">
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-label="Pages"
    id="content"
    part="content"
    role="document"
    tabindex="-1"
  >
    <div id="pages">
    </div>
  </div>
  <div class="content-focus-ring">
  </div>
</div>
<div part="error-message">
  Password-protected documents are not supported.
</div>
`;
/* end snapshot vaadin-pdf-viewer shadow password error */

snapshots["vaadin-pdf-viewer host document"] = 
`<vaadin-pdf-viewer
  aria-label="Multi-page fixture"
  role="region"
>
</vaadin-pdf-viewer>
`;
/* end snapshot vaadin-pdf-viewer host document */

snapshots["vaadin-pdf-viewer shadow document"] = 
`<div part="loader">
</div>
<div class="content-area">
  <div
    aria-busy="false"
    aria-label="Pages"
    id="content"
    part="content"
    role="document"
    tabindex="0"
  >
    <div id="pages">
      <div
        aria-label="Page 1"
        part="page"
        role="group"
      >
        <canvas aria-hidden="true">
        </canvas>
      </div>
      <div
        aria-label="Page 2"
        part="page"
        role="group"
      >
        <canvas aria-hidden="true">
        </canvas>
      </div>
      <div
        aria-label="Page 3"
        part="page"
        role="group"
      >
      </div>
      <div
        aria-label="Page 4"
        part="page"
        role="group"
      >
      </div>
      <div
        aria-label="Page 5"
        part="page"
        role="group"
      >
      </div>
      <div
        aria-label="Page 6"
        part="page"
        role="group"
      >
      </div>
    </div>
  </div>
  <div class="content-focus-ring">
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

