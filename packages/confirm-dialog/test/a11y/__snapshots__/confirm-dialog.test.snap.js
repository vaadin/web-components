/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-confirm-dialog default"] = 
`- alertdialog "Unsaved changes" [modal]:
  - /description: Do you want to save or discard the changes?
  - group:
    - heading "Unsaved changes" [level=1]
    - text: Do you want to save or discard the changes?
    - toolbar [orientation=horizontal]:
      - button "Confirm"`;
/* end snapshot vaadin-confirm-dialog default */

snapshots["vaadin-confirm-dialog cancel and reject buttons"] = 
`- alertdialog "Unsaved changes" [modal]:
  - /description: Do you want to save or discard the changes?
  - group:
    - heading "Unsaved changes" [level=1]
    - text: Do you want to save or discard the changes?
    - toolbar [orientation=horizontal]:
      - button "Cancel"
      - button "Discard"
      - button "Save"`;
/* end snapshot vaadin-confirm-dialog cancel and reject buttons */

snapshots["vaadin-confirm-dialog no header"] = 
`- alertdialog "confirmation" [modal]:
  - /description: Do you want to save or discard the changes?
  - group:
    - heading [level=1]
    - text: Do you want to save or discard the changes?
    - toolbar [orientation=horizontal]:
      - button "Confirm"`;
/* end snapshot vaadin-confirm-dialog no header */

snapshots["vaadin-confirm-dialog accessible description ref"] = 
`- alertdialog "Delete account" [modal]:
  - /description: This cannot be undone.
  - group:
    - heading "Delete account" [level=1]
    - paragraph: This cannot be undone.
    - paragraph: Enter your password.
    - toolbar [orientation=horizontal]:
      - button "Confirm"`;
/* end snapshot vaadin-confirm-dialog accessible description ref */

