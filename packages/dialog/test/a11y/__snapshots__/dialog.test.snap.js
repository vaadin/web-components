/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dialog default"] = 
`- dialog [modal]:
  - group: Content`;
/* end snapshot vaadin-dialog default */

snapshots["vaadin-dialog header title"] = 
`- dialog "Title" [modal]:
  - group:
    - sectionheader:
      - heading "Title" [level=1]
    - text: Content`;
/* end snapshot vaadin-dialog header title */

snapshots["vaadin-dialog header and footer"] = 
`- dialog "Title" [modal]:
  - group:
    - sectionheader:
      - heading "Title" [level=1]
      - button "Close": "×"
    - text: Content
    - sectionfooter:
      - button "Cancel"
      - button "Save"`;
/* end snapshot vaadin-dialog header and footer */

snapshots["vaadin-dialog aria-label"] = 
`- dialog "Edit user" [modal]:
  - group: Content`;
/* end snapshot vaadin-dialog aria-label */

snapshots["vaadin-dialog modeless"] = 
`- dialog "Title":
  - group:
    - sectionheader:
      - heading "Title" [level=2]
    - text: Content`;
/* end snapshot vaadin-dialog modeless */

snapshots["vaadin-dialog overlay role"] = 
`- alertdialog "Title" [modal]:
  - group:
    - sectionheader:
      - heading "Title" [level=1]
    - text: Content`;
/* end snapshot vaadin-dialog overlay role */

