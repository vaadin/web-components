/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-tooltip in menus context menu item tooltip opened"] = 
`- button "Actions"
- group:
  - menu [orientation=vertical]:
    - menuitem "Copy":
      - /description: Copy to the clipboard
    - menuitem "Paste"
- group:
  - tooltip "Copy to the clipboard"`;
/* end snapshot vaadin-tooltip in menus context menu item tooltip opened */

snapshots["vaadin-tooltip in menus menu bar root item tooltip opened"] = 
`- menubar "Main" [orientation=horizontal]:
  - menuitem "Edit":
    - /description: Edit the document
  - menuitem "Share"
  - group:
    - tooltip "Edit the document"`;
/* end snapshot vaadin-tooltip in menus menu bar root item tooltip opened */

