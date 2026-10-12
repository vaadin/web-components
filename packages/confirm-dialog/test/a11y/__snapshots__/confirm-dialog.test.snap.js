/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-confirm-dialog default"] = 
`- alertdialog "Unsaved changes" [modal]:
  - /description: Do you want to save or discard the changes?
  - heading "Unsaved changes" [level=1]
  - text: Do you want to save or discard the changes?
  - button "Confirm" [focused]`;
/* end snapshot vaadin-confirm-dialog default */

snapshots["vaadin-confirm-dialog cancel and reject buttons"] = 
`- alertdialog "Unsaved changes" [modal]:
  - /description: Do you want to save or discard the changes?
  - heading "Unsaved changes" [level=1]
  - text: Do you want to save or discard the changes?
  - button "Cancel"
  - button "Discard"
  - button "Save" [focused]`;
/* end snapshot vaadin-confirm-dialog cancel and reject buttons */

snapshots["vaadin-confirm-dialog no header"] = 
`- alertdialog "confirmation" [modal]:
  - /description: Do you want to save or discard the changes?
  - text: Do you want to save or discard the changes?
  - button "Confirm" [focused]`;
/* end snapshot vaadin-confirm-dialog no header */

snapshots["vaadin-confirm-dialog accessible description ref"] = 
`- alertdialog "Delete account" [modal]:
  - /description: This cannot be undone.
  - heading "Delete account" [level=1]
  - text: This cannot be undone.
  - text: Enter your password.
  - button "Confirm" [focused]`;
/* end snapshot vaadin-confirm-dialog accessible description ref */

