/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["vaadin-tabsheet default"] = 
`- generic:
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3"
- generic:
  - text: Content 1`;
/* end snapshot vaadin-tabsheet default */

snapshots["vaadin-tabsheet selected"] = 
`- generic:
  - tab "Tab 1"
  - tab "Tab 2"
  - tab "Tab 3" [selected]
- generic:
  - text: Content 3`;
/* end snapshot vaadin-tabsheet selected */

snapshots["vaadin-tabsheet prefix and suffix"] = 
`- button "Back"
- generic:
  - tab "Tab 1" [selected]
  - tab "Tab 2"
  - tab "Tab 3"
- button "Add"
- generic:
  - text: Content 1`;
/* end snapshot vaadin-tabsheet prefix and suffix */

