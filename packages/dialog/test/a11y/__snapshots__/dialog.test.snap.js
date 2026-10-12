/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-dialog default"] = 
`- dialog [focused, modal]:
  - text: Content`;
/* end snapshot vaadin-dialog default */

snapshots["vaadin-dialog header title"] = 
`- dialog "Title" [focused, modal]`;
/* end snapshot vaadin-dialog header title */

snapshots["vaadin-dialog header and footer"] = 
`- dialog "Title" [focused, modal]:
  - heading "Title" [level=1]
  - button "Close"
  - text: Content
  - button "Cancel"
  - button "Save"`;
/* end snapshot vaadin-dialog header and footer */

snapshots["vaadin-dialog aria-label"] = 
`- dialog "Edit user" [focused, modal]`;
/* end snapshot vaadin-dialog aria-label */

snapshots["vaadin-dialog modeless"] = 
`- dialog "Title" [focused]`;
/* end snapshot vaadin-dialog modeless */

snapshots["vaadin-dialog overlay role"] = 
`- alertdialog "Title" [focused, modal]`;
/* end snapshot vaadin-dialog overlay role */

